
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  radius?: number; // radio en kilómetros
  location?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, radius = 5, location }) => {
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

    // Crear un marcador minimalista personalizado
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `
      <div style="width: 32px; height: 32px; border-radius: 50%; background-color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
        <svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-location"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.891 2.006l.106 -.006l.13 .008l.09 .016l.123 .035l.107 .046l.1 .057l.09 .067l.082 .075l.052 .059l.082 .116l.052 .096c.047 .1 .077 .206 .09 .316l.005 .106c0 .075 -.008 .149 -.024 .22l-.035 .123l-6.532 18.077a1.55 1.55 0 0 1 -1.409 .903a1.547 1.547 0 0 1 -1.329 -.747l-.065 -.127l-3.352 -6.702l-6.67 -3.336a1.55 1.55 0 0 1 -.898 -1.259l-.006 -.149c0 -.56 .301 -1.072 .841 -1.37l.14 -.07l18.017 -6.506l.106 -.03l.108 -.018z" /></svg>
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

      // Añadir el círculo de rango con tamaño fijo en kilómetros
      const radiusInMeters = 5000; // 5 kilómetros
      const metersToPixels = (meters: number, lat: number, zoom: number) => {
        return meters / (156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom));
      };

      map.current.addLayer({
        id: 'radius',
        type: 'circle',
        source: 'radius',
        paint: {
          'circle-radius': metersToPixels(radiusInMeters, latitude, 12),
          'circle-color': '#000000',
          'circle-opacity': 0.1,
        }
      });

      // Actualizar el radio cuando cambie el zoom
      map.current.on('zoom', () => {
        if (!map.current) return;
        const currentZoom = map.current.getZoom();
        map.current.setPaintProperty('radius', 'circle-radius', 
          metersToPixels(radiusInMeters, latitude, currentZoom)
        );
      });

      // Corregido: Usar la API correcta de Mapbox GL para actualizar los datos de origen
      const radiusSource = map.current.getSource('radius');
      if (radiusSource && 'setData' in radiusSource) {
        // Asegurarnos de que radiusSource tenga el método setData
        (radiusSource as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          properties: {
            lat: latitude
          }
        });
      }
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

  if (location === 'no especificada') {
    return (
      <div className="w-full h-full bg-vyba-beige flex items-center justify-center">
        <p className="text-vyba-tertiary">No se ha especificado la ubicación</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-2xl"
      style={{
        minHeight: '300px',
        position: 'relative',
        backgroundColor: '#F8F8F8'
      }}
    />
  );
};

export default LocationMap;
