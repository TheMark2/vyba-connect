import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Phone, ShieldX } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
const ProfilePage = () => {
  const { user, userName, avatarUrl } = useAuth();
  const [joinDate, setJoinDate] = useState<string>('');

  useEffect(() => {
    if (user?.created_at) {
      const date = new Date(user.created_at);
      const month = date.toLocaleString('es-ES', { month: 'long' });
      const year = date.getFullYear();
      setJoinDate(`${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`);
    }
  }, [user]);

  return (
    <UserDashboardLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold mb-8">Mi perfil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Columna izquierda - Solo tarjeta de perfil */}
          <div>
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="flex items-start gap-6">
                <div className="w-36 h-36 rounded-full overflow-hidden bg-vyba-beige">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={userName || 'Usuario'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-0">{userName || 'Usuario'}</h2>
                  <p className="text-vyba-tertiary mb-2">{user?.email}</p>
                  <Badge variant="secondary" className="text-sm bg-red-100 gap-2 text-red-500">
                    <ShieldX className="h-4 w-4 text-red-500" />
                    Sin móvil
                  </Badge>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-base text-vyba-navy mb-2">
                  Eres miembro desde
                </p>
                <p className="font-medium text-vyba-navy">
                  {joinDate}
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Resto de secciones */}
          <div className="space-y-8">
            {/* Información personal */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Información personal</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-base text-vyba-navy mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-vyba-navy">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-base text-vyba-navy mb-1">Móvil</p>
                  <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm bg-red-100 gap-2 text-red-500">
                    <ShieldX className="h-4 w-4 text-red-500" />
                    Sin verificar
                  </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Mapa de ubicación */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Ubicación</h3>
              <div className="flex items-center gap-2">
                <p className="font-medium text-vyba-navy mb-4">Sant Feliu de Codines, provincia de Barcelona</p>
              </div>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-vyba-beige">
                {/* Aquí irá el componente de mapa */}
                <div className="w-full h-full bg-[#1B4339]"></div>
              </div>
            </div>

            <Separator />

            {/* Preferencias musicales */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Tus preferencias musicales</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-base text-vyba-navy mb-3">Géneros favoritos</p>
                  <div className="flex items-center -space-x-12 py-12">
                    <div className="w-40 h-60 rounded-lg bg-vyba-beige rotate-12">
                      <img src="/images/generos/pop.png" alt="Pop" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-40 h-60 rounded-lg bg-vyba-beige -rotate-12">
                      <img src="/images/generos/reggaeton.png" alt="Reggaeton" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-40 h-60 rounded-lg bg-vyba-beige rotate-12">
                      <img src="/images/generos/rock.png" alt="Rock" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-40 h-60 rounded-lg bg-vyba-beige rotate-">
                      <img src="/images/generos/rock.png" alt="Rock" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Pop</Badge>
                    <Badge variant="secondary">Reggaeton</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-base text-vyba-navy mb-3">Tipos de artistas favoritos</p>
                  <div className="flex -space-x-8 py-4">
                    <div className="w-24 h-24 rounded-full bg-vyba-beige border border-white border-4">
                      <img src="/images/artistas/ed_sheeran.png" alt="Ed Sheeran" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-24 h-24 rounded-full bg-vyba-beige border border-white border-4">
                      <img src="/images/artistas/ed_sheeran.png" alt="Ed Sheeran" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-24 h-24 rounded-full bg-vyba-beige border border-white border-4">
                      <img src="/images/artistas/ed_sheeran.png" alt="Ed Sheeran" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-24 h-24 rounded-full bg-vyba-beige border border-white border-4">
                      <img src="/images/artistas/ed_sheeran.png" alt="Ed Sheeran" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Ed Sheeran</Badge>
                    <Badge variant="secondary">Ed Sheeran</Badge>
                    <Badge variant="secondary">Ed Sheeran</Badge>
                    <Badge variant="secondary">Ed Sheeran</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default ProfilePage;
