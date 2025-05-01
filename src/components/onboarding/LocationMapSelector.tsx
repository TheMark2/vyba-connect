
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Check, MapPin } from 'lucide-react';

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
        const { data } = await supabase.functions.invoke('get-mapbox-token');
        if (data && data.token) {
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
      const centerCoords = await geocodeInitialLocation();

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [centerCoords.lng, centerCoords.lat],
        zoom: 13,
      });

      // Agregar controles de navegación
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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
      });
    })();

    return () => {
      map.current?.remove();
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
        <Label>Selecciona tu ubicación en el mapa</Label>
        <div 
          ref={mapContainer} 
          className="h-[400px] w-full rounded-lg border border-vyba-gray overflow-hidden"
        />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-8 w-8 animate-spin text-vyba-navy" />
          </div>
        )}
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
