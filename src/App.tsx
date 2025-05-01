import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import SeekerThankYouPage from './pages/SeekerThankYouPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import ArtistBenefitsPage from './pages/ArtistBenefitsPage';
import ArtistOnboardingPage from './pages/ArtistOnboardingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";
import LandingArtist from './pages/LandingArtist';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Profile from './pages/dashboard/Profile';
import Messages from './pages/dashboard/Messages';
import Analytics from './pages/dashboard/Analytics';
import CalendarPage from './pages/dashboard/Calendar';
import Settings from './pages/dashboard/Settings';
import Djs from './pages/artist-type/djs';
import UserDashboardPage from './pages/user-dashboard/UserDashboardPage';
import ProfilePage from './pages/user-dashboard/ProfilePage';
import MessagesPage from './pages/user-dashboard/MessagesPage';
import UserOnboardingPage from './pages/UserOnboardingPage';
import { supabase } from './integrations/supabase/client';

const RedirectToDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // Obtener parámetros de URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const skipOnboarding = searchParams.get('skipOnboarding') === 'true';

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        // Verificar si hay una sesión activa
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          // Si hay sesión, obtener datos del usuario
          const { data: userData } = await supabase.auth.getUser();
          
          // Verificar si es un usuario nuevo que necesita completar el onboarding
          const isOnboardingCompleted = userData.user?.user_metadata?.onboarding_completed === true;
          
          // Verificar el rol del usuario
          const userRole = userData.user?.user_metadata?.role || 'user';
          
          if (userRole === 'artist') {
            // Si es artista, redirigir a su onboarding si es necesario
            const isArtistOnboardingCompleted = userData.user?.user_metadata?.artist_onboarding_completed === true;
            if (!isArtistOnboardingCompleted && !skipOnboarding) {
              navigate('/register/artist');
            } else {
              navigate('/dashboard');
            }
          } else {
            // Si es usuario normal y no ha completado el onboarding, redirigir al onboarding
            if (!isOnboardingCompleted && !skipOnboarding) {
              navigate('/user-onboarding');
            } else {
              // Si se solicita saltar el onboarding, actualizar los metadatos del usuario
              if (skipOnboarding && !isOnboardingCompleted) {
                await supabase.auth.updateUser({
                  data: {
                    onboarding_completed: true
                  }
                });
              }
              navigate('/user-dashboard');
            }
          }
        } else {
          // Si no hay sesión, redirigir a la página principal
          navigate('/');
        }
      } catch (error) {
        console.error('Error al verificar usuario:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [navigate, skipOnboarding]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse">Cargando...</div>
      </div>
    );
  }

  return null;
};

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/check-dashboard" element={<RedirectToDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/seeker-thank-you" element={<SeekerThankYouPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artista/:id" element={<ArtistProfilePage />} />
          <Route path="/artist-benefits" element={<ArtistBenefitsPage />} />
          <Route path="/artist-onboarding" element={<ArtistOnboardingPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/landing-artist" element={<LandingArtist />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout><Overview /></DashboardLayout>} />
          <Route path="/dashboard/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/dashboard/messages" element={<DashboardLayout><Messages /></DashboardLayout>} />
          <Route path="/dashboard/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
          <Route path="/dashboard/calendar" element={<DashboardLayout><CalendarPage /></DashboardLayout>} />
          <Route path="/dashboard/calendar/:tab" element={<DashboardLayout><CalendarPage /></DashboardLayout>} />

          {/* Artist Type Routes */}
          <Route path="/artist-type/djs" element={<Djs />} />
          
          {/* Rutas del dashboard de usuarios normales */}
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/user-dashboard/profile" element={<ProfilePage />} />
          <Route path="/user-dashboard/messages" element={<MessagesPage />} />
          
          <Route path="/register/artist" element={<ArtistOnboardingPage />} />
          <Route path="/user-onboarding" element={<UserOnboardingPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  );
}

export default App;
