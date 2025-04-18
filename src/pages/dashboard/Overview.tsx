
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Mail, User, Settings, BarChart } from "lucide-react";
import { CircleAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Overview = () => {
  const [userName] = useState<string>("Usuario");
  const [profileProgress] = useState<number>(45); // This would come from your state management or API

  return (
    <div className="mt-32">
      <div className="flex flex-col justify-between items-left mb-8 px-32 ">
        <h1 className="text-6xl font-semibold mb-6">Bienvenido, {userName}</h1>
        <p className="text-xl font-light text-muted-foreground text-vyba-tertiary">Acaba de completar tu perfil para recibir mas solicitudes</p>
      </div>

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
          <div className="flex justify-between items-center">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-medium mb-1">Progreso</h2>
              <p className="text-muted-foreground text-sm text-vyba-tertiary text-light mb-0">
                Con un 100% hay mas probabilidades de recibir mas solicitudes
              </p>
            </div>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                    />
                    <circle
                      className="text-blue-500 stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 40}`,
                        strokeDashoffset: `${2 * Math.PI * 40 * (1 - profileProgress / 100)}`,
                        transformOrigin: '50% 50%',
                        transform: 'rotate(-90deg)',
                        transition: 'stroke-dashoffset 0.5s ease-in-out'
                      }}
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium">{profileProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
