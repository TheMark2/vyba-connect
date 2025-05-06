import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  reloadUserData: () => Promise<void>;
  avatarUrl: string | null;
  userName: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  isOnboardingCompleted: false,
  reloadUserData: async () => {},
  avatarUrl: null,
  userName: null,
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Función mejorada para recargar datos del usuario
  const reloadUserData = async () => {
    try {
      console.log("AuthContext: Recargando datos de usuario...");
      
      // Obtener datos actualizados del usuario
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("AuthContext: Error al obtener usuario:", error);
        throw error;
      }
      
      if (data && data.user) {
        console.log("AuthContext: Usuario obtenido correctamente", {
          id: data.user.id,
          email: data.user.email,
          has_metadata: !!data.user.user_metadata,
          metadata_keys: data.user.user_metadata ? Object.keys(data.user.user_metadata) : []
        });
        
        // Actualizar el estado del usuario
        setUser(data.user);
        
        // Actualizar bandera de onboarding
        const isCompleted = data.user.user_metadata?.onboarding_completed === true;
        setIsOnboardingCompleted(isCompleted);
        
        // Obtener avatar URL y nombre de usuario de los metadatos
        let newAvatarUrl = data.user.user_metadata?.avatar_url || null;
        let newUserName = data.user.user_metadata?.name || null;
        
        console.log("AuthContext: Metadatos del usuario:", data.user.user_metadata);
        console.log("AuthContext: Nombre desde metadatos:", newUserName);
        
        // Si no hay avatar o nombre en los metadatos, intentar obtenerlo de la tabla de perfiles
        if (!newAvatarUrl || !newUserName) {
          try {
            // Consulta a la tabla de perfiles
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('name, last_name, email, avatar_url')
              .eq('id', data.user.id)
              .single();
            
            console.log("AuthContext: Perfil obtenido:", profileData);
            console.log("AuthContext: Error de perfil:", profileError);
            
            if (!profileError && profileData) {
              // Verificar si hay nombre en el perfil
              if (!newUserName && profileData.name) {
                const firstName = profileData.name || '';
                const lastName = profileData.last_name || '';
                
                if (firstName || lastName) {
                  newUserName = `${firstName} ${lastName}`.trim();
                  console.log("AuthContext: Nombre obtenido del perfil:", newUserName);
                }
              }
              
              // Verificar si hay avatar en el perfil (si existe el campo avatar_url)
              if (!newAvatarUrl && 'avatar_url' in profileData && profileData.avatar_url) {
                newAvatarUrl = String(profileData.avatar_url);
                console.log("AuthContext: Avatar obtenido del perfil:", newAvatarUrl);
              }
            }
          } catch (profileErr) {
            console.error("AuthContext: Error al consultar perfil:", profileErr);
          }
        }
        
        // Si aún no hay nombre, usar la parte del email antes de @
        if (!newUserName && data.user.email) {
          newUserName = data.user.email.split('@')[0];
          console.log("AuthContext: Usando nombre desde email:", newUserName);
        }
        
        // Actualizar avatar URL y nombre de usuario en el estado
        setAvatarUrl(newAvatarUrl);
        setUserName(newUserName);
        console.log("AuthContext: Estado actualizado con:", {
          avatarUrl: newAvatarUrl,
          userName: newUserName,
          isOnboardingCompleted: isCompleted
        });
        
        // Forzar una actualización de la sesión
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData && sessionData.session) {
          setSession(sessionData.session);
          console.log("AuthContext: Sesión actualizada");
        }
        
        console.log("AuthContext: Datos de usuario actualizados con éxito");
      }
    } catch (error) {
      console.error("AuthContext: Error general al recargar datos:", error);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Limpiar el estado
      setUser(null);
      setSession(null);
      setAvatarUrl(null);
      setUserName(null);
      setIsOnboardingCompleted(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Intentar recuperar datos de sesión al cargar
    const fetchInitialSession = async () => {
      try {
        setIsLoading(true);
        
        // Obtener sesión actual
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          setIsOnboardingCompleted(currentSession.user.user_metadata?.onboarding_completed === true);
          setAvatarUrl(currentSession.user.user_metadata?.avatar_url || null);
          setUserName(currentSession.user.user_metadata?.name || 
                      currentSession.user.email?.split('@')[0] || 
                      'Usuario');
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          setUser(newSession.user);
          setIsOnboardingCompleted(newSession.user.user_metadata?.onboarding_completed === true);
          setAvatarUrl(newSession.user.user_metadata?.avatar_url || null);
          setUserName(newSession.user.user_metadata?.name || 
                      newSession.user.email?.split('@')[0] || 
                      'Usuario');
        } else {
          setUser(null);
          setAvatarUrl(null);
          setUserName(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const contextValue = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    isOnboardingCompleted,
    reloadUserData,
    avatarUrl,
    userName,
    signOut
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
