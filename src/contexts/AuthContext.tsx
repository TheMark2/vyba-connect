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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userMetadata, setUserMetadata] = useState<Record<string, any> | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isArtistOnboardingCompleted, setIsArtistOnboardingCompleted] = useState(false);

  // Función para actualizar toda la información del usuario
  const updateUserData = (user: User | null, session: Session | null) => {
    if (user) {
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
    } else {
      // Limpiar todos los datos si no hay usuario
      setUser(null);
      setUserRole(null);
      setUserMetadata(null);
      setAvatarUrl(null);
      setUserDisplayName(null);
      setIsOnboardingCompleted(false);
      setIsArtistOnboardingCompleted(false);
    }
    
    setSession(session);
  };

  // Obtener datos del usuario actual
  const refreshUser = async () => {
    try {
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
      toast.error('Error al cargar información de usuario');
      updateUserData(null, null);
    }
  };

  // Inicializar y configurar escucha para cambios de autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
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