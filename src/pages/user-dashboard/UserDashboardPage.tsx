
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Heart, MessageCircle, UserRound } from "lucide-react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import UserDashboardLayout from "@/components/dashboard/UserDashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Datos de ejemplo para artistas favoritos
const favoriteArtists = [
  {
    id: "1",
    name: "DJ Marcos",
    type: "DJ",
    description: "DJ especializado en bodas y eventos corporativos",
    images: [
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
    ],
    rating: 4.8,
    priceRange: "450-550€",
    isFavorite: true,
  },
  {
    id: "2",
    name: "Los Brillantes",
    type: "Banda",
    description: "Banda versátil para todo tipo de eventos",
    images: [
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
      "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
      "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
    ],
    rating: 4.9,
    priceRange: "600-800€",
    isFavorite: true,
  },
];

// Datos de ejemplo para conversaciones
const conversations = [
  {
    id: "conv1",
    artist: {
      id: "1",
      name: "DJ Marcos",
      avatar: "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
    },
    lastMessage: "Hola, ¿está disponible para el 15 de agosto?",
    timestamp: "Hace 2 horas",
    unread: true,
  },
  {
    id: "conv2",
    artist: {
      id: "2",
      name: "Los Brillantes",
      avatar: "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
    },
    lastMessage: "Gracias por la consulta. Puedo enviarle más información.",
    timestamp: "Ayer",
    unread: false,
  },
];

// Datos de ejemplo para artistas recomendados
const recommendedArtists = [
  {
    id: "3",
    name: "Sara Soprano",
    type: "Solista",
    description: "Cantante lírica para ceremonias y eventos formales",
    images: [
      "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
    ],
    rating: 4.7,
    priceRange: "350-450€",
    isFavorite: false,
  },
  {
    id: "4",
    name: "DJ Ana",
    type: "DJ",
    description: "DJ versátil con repertorio internacional",
    images: [
      "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
      "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
      "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
    ],
    rating: 4.9,
    priceRange: "450-550€",
    isFavorite: false,
  },
];

// Componente principal del tablero de usuario
const UserDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [recentFavorites, setRecentFavorites] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchFavoriteArtists();
    }
  }, [user]);

  // Función para obtener el perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setUserProfile(data || {
        name: user?.user_metadata?.name || "Usuario",
        email: user?.email || "",
      });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener los artistas favoritos del usuario
  const fetchFavoriteArtists = async () => {
    // En un escenario real, aquí iría la lógica para obtener los favoritos de Supabase
    // Por ahora, usamos los datos de ejemplo
    setRecentFavorites(favoriteArtists);
  };

  // Manejador para hacer clic en un artista
  const handleArtistClick = (artistId: string) => {
    navigate(`/artista/${artistId}`);
  };

  // Obtener el nombre del usuario
  const getUserName = () => {
    if (userProfile?.name) return userProfile.name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split("@")[0];
    return "Usuario";
  };

  // Obtener la inicial del usuario para el avatar
  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Redireccionar a la página de mensajes
  const handleMessagesClick = () => {
    navigate("/dashboard/mensajes");
  };

  // Redireccionar a la página de favoritos
  const handleFavoritesClick = () => {
    navigate("/dashboard/favoritos");
  };

  return (
    <UserDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Tarjeta de bienvenida */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={userProfile?.avatar_url || ""}
                  alt={getUserName()}
                />
                <AvatarFallback className="bg-black text-white text-xl">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">¡Hola, {getUserName()}!</h1>
                <p className="text-gray-500">
                  Bienvenido a tu panel personal de Vyba Artists
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pestañas principales */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">General</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="messages">Mensajes</TabsTrigger>
          </TabsList>

          {/* Contenido de la pestaña General */}
          <TabsContent value="overview" className="space-y-8">
            {/* Tarjetas de acceso rápido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/dashboard/perfil')}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <UserRound className="h-12 w-12 text-black mb-4" />
                  <CardTitle className="mb-2">Mi Perfil</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal y preferencias
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={handleFavoritesClick}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Heart className="h-12 w-12 text-black mb-4" />
                  <CardTitle className="mb-2">Mis Favoritos</CardTitle>
                  <CardDescription>
                    {recentFavorites.length} artistas guardados
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={handleMessagesClick}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <MessageCircle className="h-12 w-12 text-black mb-4" />
                  <CardTitle className="mb-2">Mis Mensajes</CardTitle>
                  <CardDescription>
                    {conversations.filter(c => c.unread).length} mensajes sin leer
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Sección de favoritos recientes */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Favoritos recientes</h2>
                <Button variant="ghost" onClick={handleFavoritesClick}>Ver todos</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentFavorites.slice(0, 3).map((artist) => (
                  <ArtistProfileCard 
                    key={artist.id}
                    id={artist.id}
                    name={artist.name}
                    type={artist.type}
                    description={artist.description}
                    images={artist.images}
                    rating={artist.rating}
                    priceRange={artist.priceRange}
                    isFavorite={artist.isFavorite}
                    onClick={() => handleArtistClick(artist.id)}
                    onFavoriteToggle={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Sección de artistas recomendados */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recomendados para ti</h2>
                <Button variant="ghost" onClick={() => navigate('/artistas')}>
                  Ver más artistas
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedArtists.map((artist) => (
                  <ArtistProfileCard 
                    key={artist.id}
                    id={artist.id}
                    name={artist.name}
                    type={artist.type}
                    description={artist.description}
                    images={artist.images}
                    rating={artist.rating}
                    priceRange={artist.priceRange}
                    isFavorite={artist.isFavorite}
                    onClick={() => handleArtistClick(artist.id)}
                    onFavoriteToggle={() => {}}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Contenido de la pestaña Favoritos */}
          <TabsContent value="favorites" className="space-y-8">
            <Button onClick={() => navigate('/dashboard/favoritos')}>
              Ver todos mis favoritos
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFavorites.map((artist) => (
                <ArtistProfileCard 
                  key={artist.id}
                  id={artist.id}
                  name={artist.name}
                  type={artist.type}
                  description={artist.description}
                  images={artist.images}
                  rating={artist.rating}
                  priceRange={artist.priceRange}
                  isFavorite={artist.isFavorite}
                  onClick={() => handleArtistClick(artist.id)}
                  onFavoriteToggle={() => {}}
                />
              ))}
            </div>
          </TabsContent>

          {/* Contenido de la pestaña Mensajes */}
          <TabsContent value="messages" className="space-y-6">
            <Button onClick={() => navigate('/dashboard/mensajes')}>
              Ver todos mis mensajes
            </Button>
            
            <div className="space-y-4">
              {conversations.map((conv) => (
                <Card 
                  key={conv.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${conv.unread ? 'bg-gray-50' : ''}`}
                  onClick={() => navigate(`/dashboard/mensajes/${conv.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={conv.artist.avatar} alt={conv.artist.name} />
                        <AvatarFallback>{conv.artist.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{conv.artist.name}</h3>
                          <span className="text-sm text-gray-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </UserDashboardLayout>
  );
};

export default UserDashboardPage;
