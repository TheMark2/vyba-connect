
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import ArtistThankYouPage from './pages/ArtistThankYouPage';
import SeekerThankYouPage from './pages/SeekerThankYouPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/thank-you" element={<ArtistThankYouPage />} />
        <Route path="/seeker-thank-you" element={<SeekerThankYouPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artista/:id" element={<ArtistProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
