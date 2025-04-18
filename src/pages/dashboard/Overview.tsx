import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Mail, User, Settings, BarChart } from "lucide-react";
import { CircleAlert } from "lucide-react";

const Overview = () => {
  const [userName] = useState<string>("Usuario"); // Aquí deberías obtener el nombre del usuario de tu estado global o API

  return (
    <div className="mt-32">
      <div className="flex flex-col justify-between items-left mb-8 px-32 ">
        <h1 className="text-6xl font-semibold mb-6">Bienvenido, {userName}</h1>
        <p className="text-xl font-light text-muted-foreground text-vyba-tertiary">Acaba de completar tu perfil para recibir mas solicitudes</p>
      </div>

      {/* Seccion de tarjetas novedades, etc...*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-32">
        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <h2 className="text-2xl font-medium mb-1">Verifica tu identidad</h2>
          <p className="text-muted-foreground text-xs text-red-500">
            Requerido para publicar tu perfil
          </p>
          
          <div className="flex items-center w-full mt-4">
            <Button variant="link" className="p-0 text-vyba-tertiary text-base text-vyba-navy underline rounded-none">
              Verificar ahora
            </Button>
          </div>
          <CircleAlert className="absolute top-1/2 right-6 -translate-y-1/2 h-9 w-9 text-red-500" />
        </div>
        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <h2 className="text-2xl font-medium mb-1">Progreso</h2>
          <p className="text-muted-foreground text-sm text-vyba-tertiary pr-32 text-light mb-0">
            Con un 100% hay mas probabilidades de recibir mas solicitudes
          </p>
          <CircleAlert className="absolute top-1/2 right-6 -translate-y-1/2 h-9 w-9 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default Overview; 