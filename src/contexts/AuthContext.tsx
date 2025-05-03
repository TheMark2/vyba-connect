
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  reloadUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  isOnboardingCompleted: false,
  reloadUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  const reloadUserData = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(data.user);
      setIsOnboardingCompleted(data.user?.user_metadata?.onboarding_completed === true);
    } catch (error) {
      console.error("Error reloading user data:", error);
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
        setUser(newSession?.user || null);
        setIsOnboardingCompleted(newSession?.user?.user_metadata?.onboarding_completed === true);
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
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
