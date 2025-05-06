import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check } from 'lucide-react';

interface DebugAvatarImageProps {
  src: string | null;
  size?: number;
}

/**
 * Componente para depurar problemas con imágenes de avatar
 * Solo usar en desarrollo para diagnosticar problemas
 */
export const DebugAvatarImage: React.FC<DebugAvatarImageProps> = ({ 
  src, 
  size = 80 
}) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (!src) {
      setStatus('error');
      setInfo({ error: 'No URL provided' });
      return;
    }

    const checkImage = async () => {
      try {
        setStatus('loading');
        
        // Intentar cargar la imagen con HEAD para verificar si existe
        const headResponse = await fetch(src, { method: 'HEAD' });
        const contentType = headResponse.headers.get('content-type');
        const contentLength = headResponse.headers.get('content-length');
        
        if (!headResponse.ok) {
          setStatus('error');
          setInfo({
            status: headResponse.status,
            statusText: headResponse.statusText,
            url: src
          });
          return;
        }
        
        // Si el HEAD fue exitoso, intentar cargar la imagen para verificar que sea una imagen válida
        const imgElement = new Image();
        
        imgElement.onload = () => {
          setStatus('success');
          setInfo({
            width: imgElement.width,
            height: imgElement.height,
            contentType,
            contentLength: contentLength ? `${Math.round(parseInt(contentLength) / 1024)} KB` : 'unknown',
            src
          });
        };
        
        imgElement.onerror = () => {
          setStatus('error');
          setInfo({
            error: 'Failed to load image',
            contentType,
            src
          });
        };
        
        imgElement.src = src;
      } catch (error) {
        setStatus('error');
        setInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          src
        });
      }
    };
    
    checkImage();
  }, [src]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4 w-full max-w-md">
      <h3 className="text-sm font-semibold mb-2">Avatar URL Debug</h3>
      
      <div className="flex items-start gap-4">
        <div 
          className="shrink-0 rounded-full overflow-hidden bg-white"
          style={{ width: size, height: size }}
        >
          {src ? (
            <img 
              src={src} 
              alt="Debug avatar" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
              No URL
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className={`${
              status === 'loading' ? 'animate-spin bg-blue-500' : 
              status === 'success' ? 'bg-green-500' : 
              'bg-red-500'
            } w-4 h-4 rounded-full`}>
              {status === 'success' && <Check className="w-4 h-4 text-white" />}
              {status === 'error' && <AlertTriangle className="w-4 h-4 text-white" />}
            </div>
            <span className="font-medium">
              {status === 'loading' ? 'Checking...' : 
               status === 'success' ? 'Image loaded successfully' : 
               'Failed to load image'}
            </span>
          </div>
          
          <div className="bg-gray-200 p-2 rounded-md text-xs font-mono overflow-x-auto whitespace-pre">
            {info ? JSON.stringify(info, null, 2) : 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAvatarImage; 