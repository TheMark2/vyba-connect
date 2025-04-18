import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Search, Clock, CheckCircle2 } from "lucide-react";

const Messages = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Mensajes</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar mensajes" className="pl-8" />
          </div>
          <Button>Nuevo mensaje</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="font-medium">Nombre del contacto {i}</div>
                  <div className="text-sm text-muted-foreground">Último mensaje...</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <CardTitle>Nombre del contacto</CardTitle>
                <div className="text-sm text-muted-foreground">En línea</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="bg-gray-100 p-4 rounded-lg">
                <p>Hola, ¿cómo estás?</p>
                <div className="text-xs text-muted-foreground mt-2">10:30 AM</div>
              </div>
            </div>
            <div className="flex items-start gap-4 justify-end">
              <div className="bg-blue-100 p-4 rounded-lg">
                <p>¡Hola! Estoy bien, ¿y tú?</p>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  10:32 AM <CheckCircle2 className="h-3 w-3" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages; 