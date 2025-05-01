import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageSquare, Bell, Search, Users, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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
          </div>

          {/* Sección de acciones rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/artists')}
              className="h-auto flex flex-col items-center py-6 bg-vyba-gray/50 rounded-xl hover:bg-vyba-gray"
            >
              <Search className="h-6 w-6 mb-2" />
              <span>Buscar artistas</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/user-dashboard/favorites')}
              className="h-auto flex flex-col items-center py-6 bg-vyba-gray/50 rounded-xl hover:bg-vyba-gray"
            >
              <Heart className="h-6 w-6 mb-2" />
              <span>Favoritos</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/user-dashboard/messages')}
              className="h-auto flex flex-col items-center py-6 bg-vyba-gray/50 rounded-xl hover:bg-vyba-gray"
            >
              <MessageSquare className="h-6 w-6 mb-2" />
              <span>Mensajes</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/categories')}
              className="h-auto flex flex-col items-center py-6 bg-vyba-gray/50 rounded-xl hover:bg-vyba-gray"
            >
              <Music className="h-6 w-6 mb-2" />
              <span>Categorías</span>
            </Button>
          </div>

          {/* Artistas Destacados */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Artistas destacados</h2>
              <Button variant="ghost" onClick={() => navigate('/artists')}>Ver todos</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredArtists.map((artist) => (
                <Card key={artist.id} className="overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={artist.imageUrl} 
                      alt={artist.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{artist.name}</h3>
                        <p className="text-vyba-tertiary">{artist.type}</p>
                      </div>
                      <Button variant="ghost" className="p-0 h-8 w-8">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center">
                        <span className="text-amber-500">★</span>
                        <span className="ml-1">{artist.rating}</span>
                      </div>
                      <span className="font-medium">{artist.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mensajes Recientes */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Mensajes recientes</h2>
              <Button variant="ghost" onClick={() => navigate('/user-dashboard/messages')}>Ver todos</Button>
            </div>
            
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <Card key={message.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={message.avatar} 
                          alt={message.sender} 
                          className="w-12 h-12 rounded-full object-cover" 
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{message.sender}</h3>
                            <span className="text-sm text-vyba-tertiary">{message.time}</span>
                          </div>
                          <p className="text-vyba-tertiary truncate">{message.preview}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-vyba-gray mb-4" />
                  <p className="text-vyba-tertiary">No tienes mensajes recientes</p>
                  <Button className="mt-4" variant="terciary" onClick={() => navigate('/artists')}>
                    Explorar artistas
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default UserDashboardPage; 