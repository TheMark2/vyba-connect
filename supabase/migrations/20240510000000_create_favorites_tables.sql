-- Crear tabla para listas de favoritos
CREATE TABLE IF NOT EXISTS favorite_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar índices para mejorar el rendimiento de las consultas por usuario
CREATE INDEX IF NOT EXISTS favorite_lists_user_id_idx ON favorite_lists(user_id);
CREATE INDEX IF NOT EXISTS favorite_lists_created_at_idx ON favorite_lists(created_at DESC);
CREATE INDEX IF NOT EXISTS favorite_lists_updated_at_idx ON favorite_lists(updated_at DESC);

-- Crear tabla para artistas favoritos
CREATE TABLE IF NOT EXISTS favorite_artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES favorite_lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id TEXT NOT NULL, -- ID del artista
  artist_name TEXT NOT NULL, -- Nombre del artista (para facilitar consultas)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS favorite_artists_list_id_idx ON favorite_artists(list_id);
CREATE INDEX IF NOT EXISTS favorite_artists_user_id_idx ON favorite_artists(user_id);
CREATE INDEX IF NOT EXISTS favorite_artists_artist_id_idx ON favorite_artists(artist_id);
CREATE INDEX IF NOT EXISTS favorite_artists_created_at_idx ON favorite_artists(created_at DESC);

-- Índice compuesto para búsquedas comunes
CREATE INDEX IF NOT EXISTS favorite_artists_user_list_idx ON favorite_artists(user_id, list_id);

-- Restricción para evitar duplicados (un artista solo puede estar una vez en cada lista)
ALTER TABLE favorite_artists ADD CONSTRAINT unique_artist_per_list UNIQUE (list_id, artist_id);

-- Crear función de trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar automáticamente updated_at en favorite_lists
CREATE TRIGGER update_favorite_lists_updated_at
BEFORE UPDATE ON favorite_lists
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Crear función para obtener conteo de artistas por lista
CREATE OR REPLACE FUNCTION get_artist_count(list_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM favorite_artists
    WHERE favorite_artists.list_id = $1
  );
END;
$$ LANGUAGE plpgsql;

-- Crear vista materializada para estadísticas de listas
CREATE MATERIALIZED VIEW IF NOT EXISTS list_statistics AS
SELECT 
  l.id as list_id,
  l.user_id,
  l.name,
  COUNT(fa.id) as artist_count,
  MAX(fa.created_at) as last_artist_added
FROM favorite_lists l
LEFT JOIN favorite_artists fa ON l.id = fa.list_id
GROUP BY l.id, l.user_id, l.name;

-- Crear índice para la vista materializada
CREATE UNIQUE INDEX IF NOT EXISTS list_statistics_list_id_idx ON list_statistics(list_id);

-- Función para refrescar la vista materializada
CREATE OR REPLACE FUNCTION refresh_list_statistics()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY list_statistics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers para mantener la vista materializada actualizada
CREATE TRIGGER refresh_list_statistics_on_favorite_artists
AFTER INSERT OR UPDATE OR DELETE ON favorite_artists
FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_list_statistics();

CREATE TRIGGER refresh_list_statistics_on_favorite_lists
AFTER INSERT OR UPDATE OR DELETE ON favorite_lists
FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_list_statistics();

-- Permisos RLS (Row Level Security)
ALTER TABLE favorite_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_artists ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para favorite_lists
CREATE POLICY "Users can view their own lists"
  ON favorite_lists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lists"
  ON favorite_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
  ON favorite_lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
  ON favorite_lists FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para favorite_artists
CREATE POLICY "Users can view their own artists"
  ON favorite_artists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own artists"
  ON favorite_artists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own artists"
  ON favorite_artists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own artists"
  ON favorite_artists FOR DELETE
  USING (auth.uid() = user_id);

-- Crear tipo ENUM para el estado del onboarding
CREATE TYPE onboarding_status AS ENUM ('pending', 'completed', 'skipped');

-- Agregar campo de onboarding a la tabla profiles
ALTER TABLE profiles
DROP COLUMN IF EXISTS onboarding_completed,
DROP COLUMN IF EXISTS onboarding_skipped,
ADD COLUMN IF NOT EXISTS onboarding_status onboarding_status DEFAULT 'pending';

-- Actualizar registros existentes
UPDATE profiles
SET onboarding_status = 'completed'
WHERE onboarding_status IS NULL; 