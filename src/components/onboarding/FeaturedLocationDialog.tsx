
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';

export interface Location {
  venue: string;
  city: string;
}

interface FeaturedLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLocation: (location: Location) => void;
}

export const FeaturedLocationDialog: React.FC<FeaturedLocationDialogProps> = ({
  open,
  onOpenChange,
  onAddLocation,
}) => {
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (venue.trim() && city.trim()) {
      onAddLocation({ venue: venue.trim(), city: city.trim() });
      setVenue('');
      setCity('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="w-full flex justify-center gap-4 relative mt-4 overflow-hidden">
          <img
            src="/lovable-uploads/image.png"
            alt="Imagen 1"
            className="w-64 h-80 object-cover rounded-xl"
          />
          <img
            src="/lovable-uploads/image2.png"
            alt="Imagen 2"
            className="w-68 h-80 object-cover rounded-xl z-20"
          />
          <img
            src="/lovable-uploads/image1.png"
            alt="Imagen 3"
            className="w-64 h-80 object-cover rounded-xl"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 px-12">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nombre del sitio
            </label>
            <Input
              placeholder="Ej: Joy Eslava"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Ciudad o pueblo
            </label>
            <Input
              placeholder="Ej: Madrid"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" type="submit" disabled={!venue.trim() || !city.trim()}>
              <Plus className="h-4 w-4" />
              Añadir lugar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
