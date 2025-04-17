
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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
      <DialogContent className="w-[90%] max-w-md rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Nombre del sitio
            </label>
            <Input
              placeholder="Ej: Joy Eslava"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Ciudad o pueblo
            </label>
            <Input
              placeholder="Ej: Madrid"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!venue.trim() || !city.trim()}>
              Añadir lugar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
