-- Crear tabla para listas de favoritos
CREATE TABLE IF NOT EXISTS favorite_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar índice para mejorar el rendimiento de las consultas por usuario
CREATE INDEX IF NOT EXISTS favorite_lists_user_id_idx ON favorite_lists(user_id);

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

-- Permisos RLS (Row Level Security)
ALTER TABLE favorite_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_artists ENABLE ROW LEVEL SECURITY;

-- Políticas para listas de favoritos
CREATE POLICY "Usuarios pueden ver sus propias listas" 
  ON favorite_lists FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias listas" 
  ON favorite_lists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias listas" 
  ON favorite_lists FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias listas" 
  ON favorite_lists FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas para artistas favoritos
CREATE POLICY "Usuarios pueden ver sus artistas favoritos" 
  ON favorite_artists FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden añadir artistas a sus favoritos" 
  ON favorite_artists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar artistas de sus favoritos" 
  ON favorite_artists FOR DELETE 
  USING (auth.uid() = user_id); 