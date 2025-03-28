
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistName: string;
  userImage?: string;
  userName?: string;
}

const ContactDialog = ({
  open,
  onOpenChange,
  artistName,
  userImage = "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
  userName = "Marc Vendrell"
}: ContactDialogProps) => {
  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] rounded-[40px] p-8 bg-white border-none">
        <DialogTitle className="text-3xl font-black mb-6">
          Contacta con {artistName}
        </DialogTitle>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-gray-200">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Contactando como</span>
              <span className="font-semibold text-lg">{userName}</span>
            </div>
          </div>
          
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Fecha del evento
              </label>
              <Input
                id="date"
                type="text"
                placeholder="Fecha del evento"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border-0 rounded-xl shadow-none h-12 focus-visible:ring-0 pl-4"
              />
            </div>
            
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium mb-2">
                Tipo de evento
              </label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="bg-white border-0 rounded-xl shadow-none h-12 focus-visible:ring-0 pl-4">
                  <SelectValue placeholder="Selecciona el tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boda">Boda</SelectItem>
                  <SelectItem value="cumpleanos">Cumpleaños</SelectItem>
                  <SelectItem value="fiesta">Fiesta privada</SelectItem>
                  <SelectItem value="corporativo">Evento corporativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Ubicación del evento
              </label>
              <Input
                id="location"
                type="text"
                placeholder="Sant Feliu de Codines"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-0 rounded-xl shadow-none h-12 focus-visible:ring-0 pl-4"
              />
            </div>
            
            {/* Placeholder para el mapa */}
            <div className="rounded-2xl overflow-hidden h-[200px] bg-gray-200 my-4">
              <img 
                src="/lovable-uploads/e5b6825a-d587-49ec-bd58-853dfffeb371.png"
                alt="Mapa de ubicación"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-2">
                Duración del evento
              </label>
              <Input
                id="duration"
                type="text"
                placeholder="2 horas"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-white border-0 rounded-xl shadow-none h-12 focus-visible:ring-0 pl-4"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Mensaje (opcional)
              </label>
              <Textarea
                id="message"
                placeholder="Escribe tu mensaje aquí..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white border-0 rounded-xl shadow-none min-h-[120px] focus-visible:ring-0 pl-4 pt-4"
              />
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex justify-end mt-2">
          <Button className="bg-blue-100 hover:bg-blue-200 text-black font-medium rounded-full px-8">
            Siguiente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
