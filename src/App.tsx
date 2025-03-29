import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ArtistsPage from "./pages/ArtistsPage";
import ArtistProfilePage from "./pages/ArtistProfilePage";
import AuthPage from "./pages/AuthPage";
import ProfileInfoPage from "./pages/ProfileInfoPage";
import ArtistThankYouPage from "./pages/ArtistThankYouPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add('theme-transition');
    
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const currentTheme = localStorage.getItem('theme');
      if (!currentTheme || currentTheme === 'system') {
        document.documentElement.classList.add('theme-transition');
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
        }, 500);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SonnerToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/artistas" element={<ArtistsPage />} />
            <Route path="/todos-artistas" element={<ArtistsPage />} />
            <Route path="/artista/:id" element={<ArtistProfilePage />} />
            <Route path="/todos-generos" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile-info" element={<ProfileInfoPage />} />
            <Route path="/thank-you" element={<ArtistThankYouPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
