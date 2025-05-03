import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageSquare, Bell, Search, Users, Music, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([]);

  // Datos de ejemplo para artistas destacados
  const mockFeaturedArtists = [
    {
      id: 1,
      name: 'DJ Marcos',
      imageUrl: '/images/dj1.webp',
      type: 'DJ',
      rating: 4.8,
      price: '300€'
    },
    {
      id: 2,
      name: 'Laura Voz',
      imageUrl: '/images/dj2.webp',
      type: 'Cantante',
      rating: 4.7,
      price: '450€'
    },
    {
      id: 3,
      name: 'Carlos Sax',
      imageUrl: '/images/dj3.webp',
      type: 'Saxofonista',
      rating: 4.9,
      price: '350€'
    }
  ];

  // Mock de mensajes recientes
  const recentMessages = [
    {
      id: 1,
      sender: 'DJ Marcos',
      avatar: '/images/dj1.webp',
      preview: 'Hola, gracias por contactarme...',
      time: '10:30'
    },
    {
      id: 2,
      sender: 'Laura Voz',
      avatar: '/images/dj2.webp',
      preview: 'Tengo disponibilidad para...',
      time: 'Ayer'
    }
  ];

  // Obtener información del usuario
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserName(user.user_metadata.name || user.email?.split('@')[0] || 'Usuario');
          
          // Aquí iría la lógica para obtener los datos reales del usuario
          // Como favoritos, mensajes, etc.
          
          // Por ahora usamos datos simulados
          setFavoritesCount(5);
          setMessagesCount(2);
          setFeaturedArtists(mockFeaturedArtists);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        toast.error('Error al cargar tus datos', {
          description: 'Por favor, intenta refrescar la página'
        });
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, []);

  return (
    <UserDashboardLayout>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="flex flex-col gap-8">
          {/* Encabezado y saludo */}
          <div>
            <h1 className="text-3xl font-bold">¡Hola, {userName}!</h1>
            <p className="text-vyba-tertiary">Bienvenido a tu dashboard</p>
          </div>

          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/user-dashboard/favorites" className="block">
              <Card>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-vyba-tertiary text-sm font-medium">Favoritos</p>
                    <p className="text-3xl font-bold mt-1">{favoritesCount}</p>
                  </div>
                  <div className="p-4 bg-vyba-gray rounded-full">
                    <Heart className="h-6 w-6 text-vyba-navy" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/user-dashboard/messages" className="block">
              <Card>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-vyba-tertiary text-sm font-medium">Mensajes</p>
                    <p className="text-3xl font-bold mt-1">{messagesCount}</p>
                  </div>
                  <div className="p-4 bg-vyba-gray rounded-full">
                    <MessageSquare className="h-6 w-6 text-vyba-navy" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/user-dashboard/notifications" className="block">
              <Card>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-vyba-tertiary text-sm font-medium">Notificaciones</p>
                    <p className="text-3xl font-bold mt-1">3</p>
                  </div>
                  <div className="p-4 bg-vyba-gray rounded-full">
                    <Bell className="h-6 w-6 text-vyba-navy" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Sección de acciones rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/artists"
              className="h-auto flex flex-col items-center py-6 bg-vyba-gray/50 rounded-xl hover:bg-vyba-gray"
            >
              <Search className="h-6 w-6 mb-2" />
              <span>Buscar artistas</span>
            </Link>
            
            <Link 
              to="/user-dashboard/favorites"
              className="h-auto flex flex-col items-center py-6 bg-vyba-gray/50 rounded-xl hover:bg-vyba-gray"
            >
              <Heart className="h-6 w-6 mb-2" />
              <span>Favoritos</span>
            </Link>
            
            <Link 
              to="/user-dashboard/messages"
              className="h-auto flex flex-col items-center py-6 bg-vyba-gray/50 rounded-xl hover:bg-vyba-gray"
            >
              <MessageSquare className="h-6 w-6 mb-2" />
              <span>Mensajes</span>
            </Link>
            
            <Link 
              to="/categories"
              className="h-auto flex flex-col items-center py-6 bg-vyba-gray/50 rounded-xl hover:bg-vyba-gray"
            >
              <Music className="h-6 w-6 mb-2" />
              <span>Categorías</span>
            </Link>
          </div>

          {/* Artistas Destacados */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Artistas Destacados</h2>
              <Link to="/artists" className="text-sm text-vyba-navy hover:underline">
                Ver todos
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredArtists.map((artist) => (
                <Link to={`/artists/${artist.id}`} key={artist.id} className="block">
                  <Card className="overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={artist.imageUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium">
                        {artist.price}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{artist.name}</h3>
                          <p className="text-sm text-vyba-tertiary">{artist.type}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm">{artist.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mensajes Recientes */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Mensajes Recientes</h2>
              <Link to="/user-dashboard/messages" className="text-sm text-vyba-navy hover:underline">
                Ver todos
              </Link>
            </div>
            
            <Card>
              {recentMessages.map((message) => (
                <Link to={`/user-dashboard/messages/${message.id}`} key={message.id} className="block">
                  <CardContent className="p-4 hover:bg-vyba-gray/20 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{message.sender}</p>
                          <span className="text-xs text-vyba-tertiary">{message.time}</span>
                        </div>
                        <p className="text-sm text-vyba-tertiary truncate">{message.preview}</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default UserDashboardPage; 