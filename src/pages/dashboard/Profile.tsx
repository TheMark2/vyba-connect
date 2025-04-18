import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Perfil</h1>
        <Button>Guardar cambios</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Tu nombre" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea id="bio" placeholder="Cuéntanos sobre ti" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes sociales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" placeholder="@tuinstagram" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" placeholder="@tutwitter" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spotify">Spotify</Label>
              <Input id="spotify" placeholder="Link de Spotify" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 