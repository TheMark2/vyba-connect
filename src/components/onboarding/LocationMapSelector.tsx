import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check, MapPin, Search, ZoomIn, ZoomOut, Locate } from 'lucide-react';

interface LocationMapSelectorProps {
  onLocationSelect: (data: {
    lat: number;
    lng: number;
    city: string;
    province: string;
    formattedAddress: string;
    confirmed: boolean;
  }) => void;
  initialCity?: string;
  initialProvince?: string;
  onValidityChange?: (isValid: boolean) => void;
}

const LocationMapSelector = ({
  onLocationSelect,
  initialCity = '',
  initialProvince = '',
  onValidityChange,
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
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    city: string;
    province: string;
    formattedAddress: string;
    confirmed: boolean;
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

        // Usar el estilo streets-v12 sin labels
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12', 
          center: [centerCoords.lng, centerCoords.lat],
          zoom: 13,
          attributionControl: false, // Ocultar atribución
          logoPosition: 'bottom-left', // Colocar logo en una posición específica para ocultarlo luego
        });

        // Ocultar el logo de Mapbox y la atribución con CSS
        const mapboxCanvas = mapContainer.current.querySelector('.mapboxgl-canvas-container');
        if (mapboxCanvas) {
          const style = document.createElement('style');
          style.textContent = `
            .mapboxgl-ctrl-logo { display: none !important; }
            .mapboxgl-ctrl-attrib { display: none !important; }
            .mapboxgl-ctrl-bottom-right { bottom: 16px !important; right: 16px !important; }
            .mapboxgl-ctrl-group { background-color: rgba(255, 255, 255, 0.9) !important; border-radius: 20px !important; box-shadow: 0 2px 10px rgba(0,0,0,0.15) !important; }
            .mapboxgl-ctrl-group button { width: 36px !important; height: 36px !important; }
          `;
          mapboxCanvas.appendChild(style);
        }

        // Eliminar los controles de navegación predeterminados y crear controles personalizados en la parte inferior derecha
        const zoomContainer = document.createElement('div');
        zoomContainer.className = 'absolute bottom-4 right-4 flex flex-col bg-white/90 backdrop-blur-md rounded-full shadow-md p-1';
        
        // Añadir botón de ubicación actual
        const locateButton = document.createElement('button');
        locateButton.className = 'w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full';
        locateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#152361" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="2" y1="12" x2="4" y2="12"/></svg>';
        
        locateButton.onclick = () => getUserLocation();
        
        // Botones de zoom existentes
        const zoomInButton = document.createElement('button');
        zoomInButton.className = 'w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full';
        zoomInButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#152361" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>';
        zoomInButton.onclick = () => map.current?.zoomIn();
        
        const zoomOutButton = document.createElement('button');
        zoomOutButton.className = 'w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full';
        zoomOutButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#152361" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>';
        zoomOutButton.onclick = () => map.current?.zoomOut();

        // Agregar los botones al contenedor
        zoomContainer.appendChild(locateButton);
        zoomContainer.appendChild(zoomInButton);
        zoomContainer.appendChild(zoomOutButton);
        
        mapContainer.current.appendChild(zoomContainer);

        // Modificar el estilo del mapa cuando se cargue
        map.current.on('load', () => {
          if (map.current) {
            // Eliminar todos los tipos de labels del mapa
            const layers = map.current.getStyle().layers;
            for (const layer of layers) {
              if (layer.type === 'symbol') {
                map.current.setLayoutProperty(layer.id, 'visibility', 'none');
              }
            }

            // Cambiar colores para parecerse a Apple Maps
            map.current.setPaintProperty('land', 'background-color', '#F8F8F8');
            map.current.setPaintProperty('water', 'fill-color', '#C8D7E5');
            map.current.setPaintProperty('road-primary', 'line-color', '#FFFFFF');
            map.current.setPaintProperty('road-secondary', 'line-color', '#FFFFFF');
            map.current.setPaintProperty('road-street', 'line-color', '#FFFFFF');
            map.current.setPaintProperty('building', 'fill-color', '#E1E1E1');
            map.current.setPaintProperty('park', 'fill-color', '#E6F2D2');
            
            // Cambiar la fuente del texto a Figtree para cualquier texto que pudiera quedar visible
            map.current.setLayoutProperty('settlement-label', 'text-font', ['Figtree Regular', 'Arial Unicode MS Regular']);
            map.current.setLayoutProperty('settlement-minor-label', 'text-font', ['Figtree Regular', 'Arial Unicode MS Regular']);
            map.current.setLayoutProperty('country-label', 'text-font', ['Figtree Medium', 'Arial Unicode MS Regular']);
            map.current.setLayoutProperty('state-label', 'text-font', ['Figtree Regular', 'Arial Unicode MS Regular']);
            
            // Crear fuente para el círculo de rango
            map.current.addSource('location-source', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [centerCoords.lng, centerCoords.lat],
                },
                properties: {},
              },
            });
            
            // Agregar el círculo de rango (área de cobertura de 1km)
            // Utilizamos una expresión para mantener un radio constante en metros
            // independientemente del nivel de zoom
            map.current.addLayer({
              id: 'location-circle',
              type: 'circle',
              source: 'location-source',
              paint: {
                // Utilizamos la función 'interpolate' con 'exponential' para mejor ajuste
                'circle-radius': [
                  'interpolate',
                  ['exponential', 2], // Usamos exponencial para mejor ajuste
                  ['zoom'],
                  // zoom level : pixeles de radio (ajustados para representar ~1km)
                  10, 30,   // A zoom 10 (muy alejado)
                  12, 60,   // A zoom 12
                  13, 100,  // A zoom 13
                  14, 160,  // A zoom 14
                  15, 320,  // A zoom 15
                  16, 640,  // A zoom 16 (muy cercano)
                ],
                'circle-color': '#000000',
                'circle-opacity': 0.15,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#000000',
                'circle-stroke-opacity': 0.6,
                'circle-blur': 0,
              },
            });
            
            setMapLoaded(true);
            console.log("Mapa cargado correctamente");
          }
        });

        // Crear un marcador minimalista personalizado (sin usar el marcador estándar de Mapbox)
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <div style="width: 20px; height: 20px; border-radius: 50%; background-color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 2px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);">
            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #000000;"></div>
          </div>
        `;
        
        marker.current = new mapboxgl.Marker({
          element: markerElement,
          draggable: true,
        })
          .setLngLat([centerCoords.lng, centerCoords.lat])
          .addTo(map.current);

        // Manejar el evento de arrastrar el marcador
        marker.current.on('dragend', async () => {
          if (!marker.current || !map.current) return;
          const lngLat = marker.current.getLngLat();
          
          // Actualizar el círculo de rango cuando se mueve el marcador
          const source = map.current.getSource('location-source');
          if (source && 'setData' in source) {
            source.setData({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lngLat.lng, lngLat.lat],
              },
              properties: {},
            });
          }
          
          await reverseGeocode(lngLat.lng, lngLat.lat);
        });

        // Manejar clic en el mapa
        map.current.on('click', async (e) => {
          if (!marker.current || !map.current) return;
          marker.current.setLngLat(e.lngLat);
          
          // Actualizar el círculo de rango cuando se hace clic en el mapa
          const source = map.current.getSource('location-source');
          if (source && 'setData' in source) {
            source.setData({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [e.lngLat.lng, e.lngLat.lat],
              },
              properties: {},
            });
          }
          
          await reverseGeocode(e.lngLat.lng, e.lngLat.lat);
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

  // Función para obtener la ubicación actual del usuario
  const getUserLocation = () => {
    if (!map.current || !marker.current) return;
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Actualizar la posición del mapa y el marcador
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true
          });
          
          marker.current?.setLngLat([longitude, latitude]);
          
          // Actualizar el círculo de rango
          const source = map.current?.getSource('location-source');
          if (source && 'setData' in source) {
            source.setData({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              properties: {},
            });
          }
          
          // Realizar geocodificación inversa para obtener la dirección
          await reverseGeocode(longitude, latitude);
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          
          // Mostrar mensaje al usuario dependiendo del error
          let errorMessage = "No se pudo acceder a tu ubicación";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Necesitas permitir el acceso a tu ubicación";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "La información de tu ubicación no está disponible";
              break;
            case error.TIMEOUT:
              errorMessage = "Se agotó el tiempo para obtener tu ubicación";
              break;
          }
          
          // Aquí podrías mostrar un toast o alguna notificación visual
          console.log(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.log("La geolocalización no está disponible en este navegador");
    }
  };

  // Función para geocodificación inversa
  const reverseGeocode = async (lng: number, lat: number) => {
    if (!mapboxToken) return;

    setGeocoding(true);
    // Resetear confirmación al cambiar de ubicación
    setLocationConfirmed(false);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=place&country=es&language=es`
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
        formattedAddress = `${city}, ${province}`;
        
        setSearchQuery(formattedAddress);
        const locationData = {
          lat,
          lng,
          city,
          province,
          formattedAddress,
          confirmed: false
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
      // Modificar la búsqueda para filtrar por ciudades importantes (types=place)
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxToken}&country=es&language=es&limit=5&types=place`
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
    // Resetear confirmación al cambiar de ubicación
    setLocationConfirmed(false);
    
    if (place.center && map.current && marker.current) {
      const [lng, lat] = place.center;
      
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14
      });
      
      marker.current.setLngLat([lng, lat]);
      
      // Actualizar el círculo de rango
      const source = map.current.getSource('location-source');
      if (source && 'setData' in source) {
        source.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          properties: {},
        });
      }
      
      await reverseGeocode(lng, lat);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      // Actualizar el estado de confirmación
      setLocationConfirmed(true);
      
      // Actualizar el objeto de ubicación seleccionada con el estado de confirmación
      const confirmedLocation = {
        ...selectedLocation,
        confirmed: true
      };
      
      setSelectedLocation(confirmedLocation);
      onLocationSelect(confirmedLocation);
    }
  };

  // Efecto para actualizar la validez del paso basado en si la ubicación está confirmada
  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(locationConfirmed);
    }
  }, [locationConfirmed, onValidityChange]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-vyba-gray/10 rounded-lg h-96 font-figtree">
        <Loader2 className="h-8 w-8 animate-spin text-vyba-navy" />
        <p className="mt-2 text-vyba-tertiary">Cargando mapa...</p>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg h-96 font-figtree">
        <p className="text-red-500">No se pudo cargar el mapa. Por favor, intenta más tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-figtree">
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
                placeholder="Busca tu ciudad..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="pl-10 bg-white/20 backdrop-blur-3xl border-transparent focus:border-vyba-navy font-figtree placeholder:text-vyba-navy"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-20 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-4 py-3 hover:bg-vyba-gray/20 cursor-pointer"
                      onMouseDown={() => selectPlace(result)}
                    >
                      <p className="font-medium font-figtree text-base text-vyba-navy mb-1">{result.text}</p>
                      <p className="text-sm text-vyba-tertiary font-figtree mb-0">{result.place_name}</p>
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
        <div className="py-4 bg-vyba-gray/10 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-vyba-navy mt-0.5" />
            <div className="space-y-1 flex-1">
              <h4 className="font-medium font-figtree">{selectedLocation.city}, {selectedLocation.province}</h4>
              <p className="text-sm text-vyba-tertiary font-figtree">{selectedLocation.formattedAddress}</p>
            </div>
            <Button
              size="default"
              variant={locationConfirmed ? "secondary" : "terciary"}
              onClick={handleConfirmLocation}
              disabled={geocoding || locationConfirmed}
              className="flex items-center gap-1 font-figtree"
            >
              {geocoding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              <span>{locationConfirmed ? "Confirmado" : "Confirmar"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMapSelector;
