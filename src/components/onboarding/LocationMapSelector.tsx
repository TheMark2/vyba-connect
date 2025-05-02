
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check, MapPin, Search } from 'lucide-react';

interface LocationMapSelectorProps {
  onLocationSelect: (data: {
    lat: number;
    lng: number;
    city: string;
    province: string;
    formattedAddress: string;
  }) => void;
  initialCity?: string;
  initialProvince?: string;
}

const LocationMapSelector = ({
  onLocationSelect,
  initialCity = '',
  initialProvince = '',
}: LocationMapSelectorProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    city: string;
    province: string;
    formattedAddress: string;
  } | null>(null);

  // Obtener el token de Mapbox desde Supabase
  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          throw error;
        }
        
        if (data && data.token) {
          console.log("Token de Mapbox obtenido correctamente");
          setMapboxToken(data.token);
        } else {
          console.error('No se pudo obtener el token de Mapbox');
        }
      } catch (error) {
        console.error('Error al obtener el token de Mapbox:', error);
      } finally {
        setLoading(false);
      }
    };

    getMapboxToken();
  }, []);

  // Inicializar el mapa cuando tenemos el token
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    console.log("Inicializando mapa con token:", mapboxToken);
    mapboxgl.accessToken = mapboxToken;

    // Coordenadas iniciales (España)
    const initialCoordinates = { lng: -3.7037902, lat: 40.4167754 };

    // Si tenemos ciudad y provincia, intentar geocodificarlas para un centro inicial más preciso
    const geocodeInitialLocation = async () => {
      if (initialCity || initialProvince) {
        try {
          const searchQuery = `${initialCity ? initialCity : ''} ${initialProvince ? initialProvince : ''}`.trim();
          if (searchQuery) {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                searchQuery
              )}.json?access_token=${mapboxToken}&country=es&limit=1`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].center;
              return { lng, lat };
            }
          }
        } catch (error) {
          console.error('Error al geocodificar ubicación inicial:', error);
        }
      }
      return initialCoordinates;
    };

    (async () => {
      try {
        const centerCoords = await geocodeInitialLocation();

        // Usar un estilo minimalista similar al de Uber
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12', // Estilo claro y minimalista
          center: [centerCoords.lng, centerCoords.lat],
          zoom: 13,
          attributionControl: false, // Ocultar atribución
          logoPosition: 'bottom-left', // Colocar logo en una posición específica para ocultarlo luego
        });

        // Ocultar el logo de Mapbox con CSS
        const mapboxCanvas = mapContainer.current.querySelector('.mapboxgl-canvas-container');
        if (mapboxCanvas) {
          const style = document.createElement('style');
          style.textContent = `
            .mapboxgl-ctrl-logo { display: none !important; }
            .mapboxgl-ctrl-attrib { display: none !important; }
          `;
          mapboxCanvas.appendChild(style);
        }

        // Agregar controles de navegación pero minimalistas
        const navControl = new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        });
        map.current.addControl(navControl, 'top-right');

        // Marcador con color personalizado
        marker.current = new mapboxgl.Marker({
          color: '#152361', // Color VYBA
          draggable: true,
        })
          .setLngLat([centerCoords.lng, centerCoords.lat])
          .addTo(map.current);

        // Manejar el evento de arrastrar el marcador
        marker.current.on('dragend', async () => {
          if (!marker.current) return;
          const lngLat = marker.current.getLngLat();
          await reverseGeocode(lngLat.lng, lngLat.lat);
        });

        // Manejar clic en el mapa
        map.current.on('click', async (e) => {
          if (!marker.current) return;
          marker.current.setLngLat(e.lngLat);
          await reverseGeocode(e.lngLat.lng, e.lngLat.lat);
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          console.log("Mapa cargado correctamente");
        });
      } catch (error) {
        console.error("Error al inicializar el mapa:", error);
      }
    })();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, initialCity, initialProvince]);

  // Función para geocodificación inversa
  const reverseGeocode = async (lng: number, lat: number) => {
    if (!mapboxToken) return;

    setGeocoding(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=place,locality,district&country=es&language=es`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        // Encontrar la ciudad y provincia
        let city = '';
        let province = '';
        let formattedAddress = '';

        // Extraer datos del lugar
        const place = data.features[0];
        if (place.text) {
          city = place.text;
        }

        // Buscar la provincia en el contexto
        if (place.context) {
          const provinceContext = place.context.find((c: { id: string }) => 
            c.id.startsWith('region')
          );
          
          if (provinceContext) {
            province = provinceContext.text;
          }
        }

        // Crear dirección formateada
        formattedAddress = data.features[0].place_name || `${city}, ${province}`;
        
        setSearchQuery(formattedAddress);
        const locationData = {
          lat,
          lng,
          city,
          province,
          formattedAddress
        };

        setSelectedLocation(locationData);
        onLocationSelect(locationData);
      }
    } catch (error) {
      console.error('Error al realizar la geocodificación inversa:', error);
    } finally {
      setGeocoding(false);
    }
  };

  // Función para buscar lugares
  const searchPlaces = async (query: string) => {
    if (!mapboxToken || query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxToken}&country=es&language=es&limit=5`
      );
      
      const data = await response.json();
      
      if (data.features) {
        setSearchResults(data.features);
      }
    } catch (error) {
      console.error('Error al buscar lugares:', error);
    } finally {
      setSearching(false);
    }
  };

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(true);
    
    // Debounce para evitar demasiadas peticiones
    const handler = setTimeout(() => {
      searchPlaces(value);
    }, 300);
    
    return () => clearTimeout(handler);
  };

  // Seleccionar un lugar de los resultados
  const selectPlace = async (place: any) => {
    setSearchQuery(place.place_name);
    setShowResults(false);
    
    if (place.center && map.current && marker.current) {
      const [lng, lat] = place.center;
      
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14
      });
      
      marker.current.setLngLat([lng, lat]);
      await reverseGeocode(lng, lat);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-vyba-gray/10 rounded-lg h-96">
        <Loader2 className="h-8 w-8 animate-spin text-vyba-navy" />
        <p className="mt-2 text-vyba-tertiary">Cargando mapa...</p>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg h-96">
        <p className="text-red-500">No se pudo cargar el mapa. Por favor, intenta más tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-search">Selecciona tu ubicación</Label>
        
        {/* Contenedor principal del mapa con el input encima */}
        <div className="relative h-[450px] rounded-lg overflow-hidden border border-vyba-gray">
          {/* Input de búsqueda encima del mapa */}
          <div className="absolute top-4 left-0 right-0 z-10 px-4">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-vyba-tertiary" />
              </div>
              <Input
                id="location-search"
                placeholder="Busca tu ciudad o dirección..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="pl-10 bg-white shadow-md border-transparent focus:border-vyba-navy"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-20 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-4 py-2 hover:bg-vyba-gray/20 cursor-pointer"
                      onMouseDown={() => selectPlace(result)}
                    >
                      <p className="font-medium">{result.text}</p>
                      <p className="text-sm text-vyba-tertiary">{result.place_name}</p>
                    </div>
                  ))}
                </div>
              )}
              {searching && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="h-4 w-4 animate-spin text-vyba-tertiary" />
                </div>
              )}
            </div>
          </div>

          {/* Contenedor del mapa */}
          <div 
            ref={mapContainer} 
            className="h-full w-full"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />

          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-vyba-navy" />
            </div>
          )}
        </div>
      </div>

      {selectedLocation && (
        <div className="p-4 bg-vyba-gray/10 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-vyba-navy mt-0.5" />
            <div className="space-y-1 flex-1">
              <h4 className="font-medium">{selectedLocation.city}, {selectedLocation.province}</h4>
              <p className="text-sm text-vyba-tertiary">{selectedLocation.formattedAddress}</p>
            </div>
            <Button
              size="sm"
              variant="terciary"
              onClick={handleConfirmLocation}
              disabled={geocoding}
              className="flex items-center gap-1"
            >
              {geocoding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              <span>Confirmar</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMapSelector;
