
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import ProfileInfoPage from './pages/ProfileInfoPage';
import ArtistThankYouPage from './pages/ArtistThankYouPage';
import SeekerThankYouPage from './pages/SeekerThankYouPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile-info" element={<ProfileInfoPage />} />
      <Route path="/thank-you" element={<ArtistThankYouPage />} />
      <Route path="/seeker-thank-you" element={<SeekerThankYouPage />} />
      <Route path="/artists" element={<ArtistsPage />} />
      <Route path="/artista/:id" element={<ArtistProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
