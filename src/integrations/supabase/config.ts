import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

// Usar import.meta.env para Vite o window.env para el navegador
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || "https://zkucuolpubthcnsgjtso.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdWN1b2xwdWJ0aGNuc2dqdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjE1NzIsImV4cCI6MjA2MTY5NzU3Mn0.P4l7Dp6zY4kPp_wL54VEb_b9IfqUoygckmt0WkXpmgA";

// Configuración de caché en memoria
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos en milisegundos

// Función para limpiar el caché expirado
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
};

// Ejecutar limpieza de caché cada minuto
setInterval(cleanupCache, 60 * 1000);

// Crear cliente de Supabase con configuración optimizada
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br'
    }
  },
  db: {
    schema: 'public'
  }
});

// Función helper para consultas con caché
export const cachedQuery = async <T>(
  key: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: { ttl?: number } = {}
): Promise<{ data: T | null; error: any }> => {
  const cacheKey = `query:${key}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < (options.ttl || CACHE_TTL)) {
    return { data: cached.data, error: null };
  }

  const result = await queryFn();
  if (result.data) {
    cache.set(cacheKey, { data: result.data, timestamp: now });
  }

  return result;
};

// Función helper para paginación
export const paginatedQuery = async <T>(
  table: keyof Database['public']['Tables'],
  options: {
    page?: number;
    pageSize?: number;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    select?: string;
  } = {}
) => {
  const {
    page = 1,
    pageSize = 10,
    filters = {},
    orderBy,
    select = '*'
  } = options;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from(table)
    .select(select, { count: 'exact' });

  // Aplicar filtros
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  // Aplicar ordenamiento
  if (orderBy) {
    query = query.order(orderBy.column, {
      ascending: orderBy.ascending ?? true
    });
  }

  // Aplicar paginación
  const { data, error, count } = await query.range(from, to);

  return {
    data,
    error,
    count,
    page,
    pageSize,
    totalPages: count ? Math.ceil(count / pageSize) : 0
  };
}; 