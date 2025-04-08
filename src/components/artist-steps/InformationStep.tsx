import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Datos de ejemplo para los selects
const artistTypes = [{
  value: "dj",
  label: "DJ"
}, {
  value: "band",
  label: "Banda"
}, {
  value: "singer",
  label: "Cantante"
}, {
  value: "musician",
  label: "Músico"
}, {
  value: "producer",
  label: "Productor"
}];
const musicGenres = [{
  value: "electronic",
  label: "Electrónica"
}, {
  value: "rock",
  label: "Rock"
}, {
  value: "pop",
  label: "Pop"
}, {
  value: "jazz",
  label: "Jazz"
}, {
  value: "hiphop",
  label: "Hip Hop"
}, {
  value: "reggaeton",
  label: "Reggaeton"
}, {
  value: "latin",
  label: "Música Latina"
}];
const eventTypes = [{
  value: "wedding",
  label: "Bodas"
}, {
  value: "corporate",
  label: "Eventos corporativos"
}, {
  value: "party",
  label: "Fiestas privadas"
}, {
  value: "club",
  label: "Clubes"
}, {
  value: "festival",
  label: "Festivales"
}];

interface InformationStepProps {
  formData: {
    artistType: string;
    artistName: string;
    genres: string[];
    eventTypes: string[];
  };
  updateFormData: (data: Partial<{
    artistType: string;
    artistName: string;
    genres: string[];
    eventTypes: string[];
  }>) => void;
}

const InformationStep: React.FC<InformationStepProps> = ({
  formData,
  updateFormData
}) => {
  return <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-black text-center mb-16">Información</h1>
      
      <div className="space-y-8 max-w-md mx-auto">
        {/* Tipo de artista */}
        <div className="space-y-2">
          <Label htmlFor="artistType" className="block font-bold">Tipo de artista</Label>
          <Select value={formData.artistType} onValueChange={value => updateFormData({
          artistType: value
        })}>
            <SelectTrigger className="w-full h-12 bg-[#F7F7F7]">
              <SelectValue placeholder="Selecciona el tipo de artista" />
            </SelectTrigger>
            <SelectContent>
              {artistTypes.map(type => <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        {/* Nombre de artista */}
        <div className="space-y-2">
          <Label htmlFor="artistName" className="block font-bold">Nombre de artista</Label>
          <Input id="artistName" placeholder="DJ Mave" value={formData.artistName} onChange={e => updateFormData({
          artistName: e.target.value
        })} className="h-12 bg-[#F7F7F7]" />
        </div>
        
        {/* Géneros principales */}
        <div className="space-y-2">
          <Label htmlFor="genres" className="block font-bold">Géneros principales</Label>
          <Select value={formData.genres[0] || ""} // Simplificado para este ejemplo
        onValueChange={value => updateFormData({
          genres: [value]
        })}>
            <SelectTrigger className="w-full h-12 bg-[#F7F7F7]">
              <SelectValue placeholder="Selecciona los géneros principales" />
            </SelectTrigger>
            <SelectContent>
              {musicGenres.map(genre => <SelectItem key={genre.value} value={genre.value}>
                  {genre.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tipos de eventos */}
        <div className="space-y-2">
          <Label htmlFor="eventTypes" className="block font-bold">Tipos de eventos principales</Label>
          <Select value={formData.eventTypes[0] || ""} // Simplificado para este ejemplo
        onValueChange={value => updateFormData({
          eventTypes: [value]
        })}>
            <SelectTrigger className="w-full h-12 bg-[#F7F7F7]">
              <SelectValue placeholder="Selecciona los tipos de eventos" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>;
};

export default InformationStep;
