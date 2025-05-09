
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { supabase } from './client';

type OrderByConfig = {
  column: string;
  ascending: boolean;
};

type PaginationConfig = {
  page?: number;
  pageSize?: number;
};

type Filters = Record<string, any>;

type QueryConfig = {
  filters?: Filters;
  orderBy?: OrderByConfig;
  pagination?: PaginationConfig;
  select?: string;
};

// Caché simple en memoria
const queryCache = new Map<string, { data: any; timestamp: number }>();

// Tiempo de expiración del caché en ms (5 minutos)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Función para aplicar filtros a una consulta
 */
const applyFilters = (query: PostgrestFilterBuilder<any, any, any>, filters: Filters) => {
  let filteredQuery = query;
  
  for (const key in filters) {
    if (filters[key] !== undefined) {
      filteredQuery = filteredQuery.eq(key, filters[key]);
    }
  }
  
  return filteredQuery;
};

/**
 * Función para obtener datos paginados de una tabla
 */
export const paginatedQuery = async (
  table: string, 
  config: QueryConfig = {}
) => {
  const { 
    filters = {}, 
    orderBy, 
    pagination = { page: 1, pageSize: 10 },
    select = '*'
  } = config;
  
  const { page = 1, pageSize = 10 } = pagination;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  try {
    let query = supabase
      .from(table)
      .select(select)
      .range(start, end);
    
    // Aplicar filtros
    if (Object.keys(filters).length > 0) {
      query = applyFilters(query, filters);
    }
    
    // Aplicar ordenamiento
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending });
    }
    
    const { data, error, count } = await query.throwOnError();
    
    if (error) {
      throw error;
    }
    
    return { 
      data,
      page,
      pageSize,
      total: count || 0,
      error: null
    };
  } catch (error) {
    console.error(`Error en consulta paginada para tabla ${table}:`, error);
    return {
      data: [],
      page,
      pageSize,
      total: 0,
      error
    };
  }
};

// Corregido: Simplificar la función para evitar problemas de tipado con type instantiation
export const cachedQuery = async <T>(
  cacheKey: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  // Comprobar si existe en caché y no ha expirado
  const cached = queryCache.get(cacheKey);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < CACHE_EXPIRATION) {
    return cached.data as T;
  }
  
  // Si no está en caché o ha expirado, ejecutar la consulta
  const result = await queryFn();
  
  // Guardar en caché
  queryCache.set(cacheKey, { data: result, timestamp: now });
  
  return result;
};

// Función para limpiar toda la caché
export const clearCache = () => {
  queryCache.clear();
};

// Función para limpiar una entrada específica de la caché
export const clearCacheEntry = (cacheKey: string) => {
  queryCache.delete(cacheKey);
};
