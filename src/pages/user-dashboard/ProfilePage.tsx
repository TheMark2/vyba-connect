import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Check, Loader2, PenLine, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // En una aplicación real, obtendrías más datos del perfil desde una tabla en Supabase
          setUserData({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            phone: user.user_metadata?.phone || '',
            address: user.user_metadata?.address || '',
            city: user.user_metadata?.city || '',
            bio: user.user_metadata?.bio || '',
          });
          
          setEditedData({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            phone: user.user_metadata?.phone || '',
            address: user.user_metadata?.address || '',
            city: user.user_metadata?.city || '',
            bio: user.user_metadata?.bio || '',
          });
          
          // Obtener avatar si existe
          if (user.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        toast.error('No se pudieron cargar tus datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Actualizar datos del perfil
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: editedData.name,
          phone: editedData.phone,
          address: editedData.address,
          city: editedData.city,
          bio: editedData.bio,
        }
      });
      
      if (updateError) throw updateError;
      
      // Subir avatar si se seleccionó uno nuevo
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userData.id}-${Date.now()}.${fileExt}`;
        
        // Subir a storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);
          
        if (uploadError) throw uploadError;
        
        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        if (urlData) {
          // Actualizar URL en metadata
          await supabase.auth.updateUser({
            data: { avatar_url: urlData.publicUrl }
          });
          
          setAvatarUrl(urlData.publicUrl);
        }
      }
      
      // Actualizar datos locales
      setUserData(editedData);
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar tu perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
    setAvatarPreview('');
    setAvatarFile(null);
  };

  if (isLoading) {
    return (
      <UserDashboardLayout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-vyba-navy" />
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <p className="text-vyba-tertiary">Gestiona tu información personal</p>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <PenLine className="h-4 w-4 mr-2" />
              Editar perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Guardar
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna izquierda - Avatar e info básica */}
          <div className="col-span-1">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={avatarPreview || avatarUrl} alt={userData.name} />
                    <AvatarFallback className="text-3xl">
                      {userData.name?.charAt(0) || userData.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <div className="absolute bottom-4 right-0">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="bg-vyba-navy text-white rounded-full p-2">
                          <Camera className="h-5 w-5" />
                        </div>
                      </Label>
                      <Input 
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-medium">{userData.name || 'Usuario'}</h2>
                <p className="text-vyba-tertiary">{userData.email}</p>
                
                <div className="w-full mt-6 space-y-3">
                  <div>
                    <p className="text-sm text-vyba-tertiary">Miembro desde</p>
                    <p>Mayo 2023</p>
                  </div>
                  <div>
                    <p className="text-sm text-vyba-tertiary">Última conexión</p>
                    <p>Hoy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Columna derecha - Info detallada */}
          <div className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    {isEditing ? (
                      <Input 
                        id="name"
                        name="name"
                        value={editedData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{userData.name || '-'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <p className="mt-1">{userData.email}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    {isEditing ? (
                      <Input 
                        id="phone"
                        name="phone"
                        value={editedData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{userData.phone || '-'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    {isEditing ? (
                      <Input 
                        id="city"
                        name="city"
                        value={editedData.city}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{userData.city || '-'}</p>
                    )}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    {isEditing ? (
                      <Input 
                        id="address"
                        name="address"
                        value={editedData.address}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1">{userData.address || '-'}</p>
                    )}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <Label htmlFor="bio">Sobre mí</Label>
                    {isEditing ? (
                      <Textarea 
                        id="bio"
                        name="bio"
                        value={editedData.bio}
                        onChange={handleInputChange}
                        className="mt-1"
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1">{userData.bio || '-'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preferencias</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-vyba-tertiary">Próximamente: configuración de notificaciones, preferencias de música, etc.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default ProfilePage; 