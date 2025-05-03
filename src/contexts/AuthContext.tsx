import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Definir tipo para el contexto
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
  userMetadata: Record<string, any> | null;
  avatarUrl: string | null;
  userDisplayName: string | null;
  isOnboardingCompleted: boolean;
  isArtistOnboardingCompleted: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
  getRedirectUrl: () => string;
}

// Crear el contexto con valores predeterminados
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: null,
  userMetadata: null,
  avatarUrl: null,
  userDisplayName: null,
  isOnboardingCompleted: false,
  isArtistOnboardingCompleted: false,
  refreshUser: async () => {},
  signOut: async () => {},
  getRedirectUrl: () => '',
});

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Función para obtener datos del almacenamiento local
const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue; // SSR check
  
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  
  try {
    return JSON.parse(stored) as T;
  } catch (e) {
    console.error(`Error parsing stored data for key "${key}":`, e);
    return defaultValue;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Inicializar desde localStorage para evitar parpadeo
  const [user, setUser] = useState<User | null>(getFromLocalStorage('auth_user', null));
  const [session, setSession] = useState<Session | null>(getFromLocalStorage('auth_session', null));
  const [isLoading, setIsLoading] = useState(!user); // Solo cargar si no hay usuario
  const [userRole, setUserRole] = useState<string | null>(getFromLocalStorage('auth_role', null));
  const [userMetadata, setUserMetadata] = useState<Record<string, any> | null>(getFromLocalStorage('auth_metadata', null));
  const [avatarUrl, setAvatarUrl] = useState<string | null>(getFromLocalStorage('auth_avatar', null));
  const [userDisplayName, setUserDisplayName] = useState<string | null>(getFromLocalStorage('auth_display_name', null));
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(getFromLocalStorage('auth_onboarding_completed', false));
  const [isArtistOnboardingCompleted, setIsArtistOnboardingCompleted] = useState<boolean>(getFromLocalStorage('auth_artist_onboarding_completed', false));

  // Función para actualizar toda la información del usuario
  const updateUserData = (user: User | null, session: Session | null) => {
    if (user) {
      // Actualizar estados
      setUser(user);
      setUserRole(user.user_metadata?.role || 'user');
      setUserMetadata(user.user_metadata || {});
      setAvatarUrl(user.user_metadata?.avatar_url || null);
      
      // Establecer nombre para mostrar con prioridades
      const displayName = 
        user.user_metadata?.name || 
        user.user_metadata?.full_name || 
        (user.email ? user.email.split('@')[0] : 'Usuario');
      
      setUserDisplayName(displayName);
      
      // Comprobar estado del onboarding
      setIsOnboardingCompleted(user.user_metadata?.onboarding_completed === true);
      setIsArtistOnboardingCompleted(user.user_metadata?.artist_onboarding_completed === true);
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_session', JSON.stringify(session));
      localStorage.setItem('auth_role', user.user_metadata?.role || 'user');
      localStorage.setItem('auth_metadata', JSON.stringify(user.user_metadata || {}));
      localStorage.setItem('auth_avatar', user.user_metadata?.avatar_url || '');
      localStorage.setItem('auth_display_name', displayName);
      localStorage.setItem('auth_onboarding_completed', JSON.stringify(user.user_metadata?.onboarding_completed === true));
      localStorage.setItem('auth_artist_onboarding_completed', JSON.stringify(user.user_metadata?.artist_onboarding_completed === true));
    } else {
      // Limpiar todos los datos si no hay usuario
      setUser(null);
      setUserRole(null);
      setUserMetadata(null);
      setAvatarUrl(null);
      setUserDisplayName(null);
      setIsOnboardingCompleted(false);
      setIsArtistOnboardingCompleted(false);
      
      // Limpiar localStorage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_metadata');
      localStorage.removeItem('auth_avatar');
      localStorage.removeItem('auth_display_name');
      localStorage.removeItem('auth_onboarding_completed');
      localStorage.removeItem('auth_artist_onboarding_completed');
    }
    
    setSession(session);
  };

  // Obtener datos del usuario actual
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (sessionData && sessionData.session) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        if (userData && userData.user) {
          updateUserData(userData.user, sessionData.session);
        } else {
          updateUserData(null, null);
        }
      } else {
        updateUserData(null, null);
      }
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      // No mostrar toast en refreshUser para evitar mensajes de error innecesarios
      updateUserData(null, null);
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializar y configurar escucha para cambios de autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      // Solo mostrar loading si no tenemos datos en localStorage
      if (!user) {
        setIsLoading(true);
      }
      
      try {
        // Obtener sesión actual
        await refreshUser();
        
        // Configurar listener para cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Evento de autenticación:', event);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (session) {
                const { data, error } = await supabase.auth.getUser();
                if (!error && data.user) {
                  updateUserData(data.user, session);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              updateUserData(null, null);
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        toast.error('Error al inicializar autenticación');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Configurar un intervalo para refrescar el token automáticamente
    const refreshInterval = setInterval(() => {
      // Solo refrescar si hay una sesión activa
      if (session) {
        supabase.auth.refreshSession();
      }
    }, 3600000); // Refrescar cada hora
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Cerrar sesión
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      updateUserData(null, null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  // Determinar la URL de redirección según el rol y estado del onboarding
  const getRedirectUrl = () => {
    if (!user) return '/auth';
    
    if (userRole === 'artist') {
      return isArtistOnboardingCompleted ? '/dashboard' : '/register/artist';
    } else {
      // Para usuarios regulares, redirigir al onboarding si no lo ha completado
      return isOnboardingCompleted ? '/user-dashboard' : '/user-onboarding';
    }
  };

  // Proveer el contexto a la aplicación
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        userRole,
        userMetadata,
        avatarUrl,
        userDisplayName,
        isOnboardingCompleted,
        isArtistOnboardingCompleted,
        refreshUser,
        signOut,
        getRedirectUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 