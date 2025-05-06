-- Corregir configuración del bucket useravatar para solucionar el error 400
-- Este script debe ejecutarse directamente en la consola SQL de Supabase

-- 1. Asegurarnos de que el bucket existe y es público
INSERT INTO storage.buckets (id, name, public)
VALUES ('useravatar', 'useravatar', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Asegurar que todas las políticas necesarias estén presentes
-- Política para permitir la lectura sin restricciones
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'useravatar');

-- Política para permitir la inserción a cualquier usuario autenticado
DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
CREATE POLICY "Auth Insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'useravatar' AND
  auth.role() = 'authenticated'
);

-- 3. Confirmar la configuración
SELECT 
  b.id, 
  b.name, 
  b.public, 
  b.cors_rules,
  p.policyname,
  p.permissive,
  p.cmd
FROM 
  storage.buckets b
LEFT JOIN
  pg_policies p ON p.tablename = 'objects' AND p.schemaname = 'storage'
WHERE 
  b.id = 'useravatar'; 