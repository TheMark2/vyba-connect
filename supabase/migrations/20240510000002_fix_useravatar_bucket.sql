-- Corregir configuración del bucket useravatar
-- 1. Asegurarnos de que el bucket existe y es público
INSERT INTO storage.buckets (id, name, public)
VALUES ('useravatar', 'useravatar', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Configurar CORS para permitir acceso desde cualquier origen
UPDATE storage.buckets
SET cors_rules = '[
  {
    "origin": "*",
    "methods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "headers": ["Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Origin", "Cache-Control", "X-Requested-With"],
    "max_age_seconds": 86400
  }
]'::jsonb
WHERE id = 'useravatar';

-- 3. Asegurarse de que las políticas son lo más permisivas posible para depuración
-- Política para permitir la lectura pública de avatares (sin restricciones)
DROP POLICY IF EXISTS "Todos pueden ver los avatares" ON storage.objects;
CREATE POLICY "Todos pueden ver los avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'useravatar');

-- Política para permitir que cualquier usuario autenticado suba avatares
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir avatares" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir avatares"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'useravatar' AND
  auth.role() = 'authenticated'
);

-- Política para permitir que cualquier usuario autenticado actualice avatares
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar avatares" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden actualizar avatares"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'useravatar' AND
  auth.role() = 'authenticated'
);

-- Política para permitir que cualquier usuario autenticado elimine avatares
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar avatares" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden eliminar avatares"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'useravatar' AND
  auth.role() = 'authenticated'
);

-- 4. También permitir acceso anónimo para testing
DROP POLICY IF EXISTS "Acceso anónimo a avatares" ON storage.objects;
CREATE POLICY "Acceso anónimo a avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'useravatar');

-- 5. Asegurar que la configuración de RLS está activada pero permite las políticas anteriores
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 