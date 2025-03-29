
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

const queryClient = new QueryClient();

const App = () => {
  // Comprobar el tema del sistema al iniciar la aplicación
  useEffect(() => {
    // Añadir la clase de transición para suavizar el cambio inicial
    document.documentElement.classList.add('theme-transition');
    
    // Comprobar preferencias guardadas
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Si no hay tema guardado o es 'system', usar la preferencia del sistema
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Quitar la clase de transición después de aplicar el tema inicial
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
    
    // Escuchar cambios en la preferencia del sistema
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
        {/* Use only SonnerToaster to avoid conflicts */}
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
