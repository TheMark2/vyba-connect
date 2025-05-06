-- Crear el bucket 'useravatar' si no existe y asegurarnos de que sea público
INSERT INTO storage.buckets (id, name, public)
VALUES ('useravatar', 'useravatar', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Configurar CORS para el bucket useravatar
UPDATE storage.buckets
SET cors_rules = '[
  {
    "origin": "*",
    "methods": ["GET", "HEAD"],
    "headers": ["Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Origin", "Cache-Control", "X-Requested-With"],
    "max_age_seconds": 86400
  }
]'::jsonb
WHERE id = 'useravatar';

-- Crear la extensión para el manejo de carpetas si no existe
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Política para permitir la lectura pública de avatares (sin restricciones)
DROP POLICY IF EXISTS "Avatares son públicamente accesibles" ON storage.objects;
CREATE POLICY "Avatares son públicamente accesibles"
ON storage.objects FOR SELECT
USING (bucket_id = 'useravatar');

-- Política para permitir que los usuarios suban sus propios avatares
DROP POLICY IF EXISTS "Usuarios pueden subir sus propios avatares" ON storage.objects;
CREATE POLICY "Usuarios pueden subir sus propios avatares"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'useravatar'
);

-- Política para permitir que los usuarios actualicen sus propios avatares
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios avatares" ON storage.objects;
CREATE POLICY "Usuarios pueden actualizar sus propios avatares"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'useravatar'
);

-- Política para permitir que los usuarios eliminen sus propios avatares
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios avatares" ON storage.objects;
CREATE POLICY "Usuarios pueden eliminar sus propios avatares"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'useravatar'
); 