import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  radius?: number; // radio en kilómetros
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, radius = 5 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 12,
      attributionControl: false,
      logoPosition: 'bottom-left',
    });

    // Ocultar el logo de Mapbox y la atribución con CSS
    const mapboxCanvas = mapContainer.current.querySelector('.mapboxgl-canvas-container');
    if (mapboxCanvas) {
      const style = document.createElement('style');
      style.textContent = `
        .mapboxgl-ctrl-logo { display: none !important; }
        .mapboxgl-ctrl-attrib { display: none !important; }
      `;
      mapboxCanvas.appendChild(style);
    }

    // Añadir controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: false
    }), 'bottom-right');

    // Crear un marcador minimalista personalizado
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `
      <div style="width: 20px; height: 20px; border-radius: 50%; background-color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 2px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);">
        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #000000;"></div>
      </div>
    `;

    new mapboxgl.Marker({
      element: markerElement
    })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // Modificar el estilo del mapa cuando se cargue
    map.current.on('load', () => {
      if (!map.current) return;

      // Eliminar todos los tipos de labels del mapa
      const layers = map.current.getStyle().layers;
      for (const layer of layers) {
        if (layer.type === 'symbol') {
          map.current.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      }

      // Cambiar colores para un estilo más limpio
      map.current.setPaintProperty('land', 'background-color', '#F8F8F8');
      map.current.setPaintProperty('water', 'fill-color', '#C8D7E5');
      map.current.setPaintProperty('road-primary', 'line-color', '#FFFFFF');
      map.current.setPaintProperty('road-secondary', 'line-color', '#FFFFFF');
      map.current.setPaintProperty('road-street', 'line-color', '#FFFFFF');
      map.current.setPaintProperty('building', 'fill-color', '#E1E1E1');
      map.current.setPaintProperty('park', 'fill-color', '#E6F2D2');

      // Crear fuente para el círculo de rango
      map.current.addSource('radius', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          properties: {}
        }
      });

      // Añadir el círculo de rango
      map.current.addLayer({
        id: 'radius',
        type: 'circle',
        source: 'radius',
        paint: {
          'circle-radius': {
            stops: [
              [10, 30],   // A zoom 10 (muy alejado)
              [12, 60],   // A zoom 12
              [13, 100],  // A zoom 13
              [14, 160],  // A zoom 14
              [15, 320],  // A zoom 15
              [16, 640],  // A zoom 16 (muy cercano)
            ]
          },
          'circle-color': '#000000',
          'circle-opacity': 0.15,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#000000',
          'circle-stroke-opacity': 0.6,
          'circle-blur': 0,
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, latitude, longitude, radius]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-vyba-beige">
        <Loader2 className="h-8 w-8 animate-spin text-vyba-navy" />
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="w-full h-full bg-vyba-beige flex items-center justify-center">
        <p className="text-vyba-tertiary">No se pudo cargar el mapa</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-2xl"
    />
  );
};

export default LocationMap; 