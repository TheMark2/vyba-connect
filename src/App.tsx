import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import SeekerThankYouPage from './pages/SeekerThankYouPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import ArtistBenefitsPage from './pages/ArtistBenefitsPage';
import ArtistOnboardingPage from './pages/ArtistOnboardingPage';
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

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/seeker-thank-you" element={<SeekerThankYouPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artista/:id" element={<ArtistProfilePage />} />
          <Route path="/artist-benefits" element={<ArtistBenefitsPage />} />
          <Route path="/artist-onboarding" element={<ArtistOnboardingPage />} />
          <Route path="/landing-artist" element={<LandingArtist />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout><Overview /></DashboardLayout>} />
          <Route path="/dashboard/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/dashboard/messages" element={<DashboardLayout><Messages /></DashboardLayout>} />
          <Route path="/dashboard/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
          <Route path="/dashboard/calendar" element={<DashboardLayout><CalendarPage /></DashboardLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  );
}

export default App;
