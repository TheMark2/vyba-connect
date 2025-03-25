
import React from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface NotFoundArtistProps {
  onBack: () => void;
}

const NotFoundArtist = ({ onBack }: NotFoundArtistProps) => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <h1 className="text-2xl font-bold mb-4">Artista no encontrado</h1>
        <Button onClick={onBack}>Volver</Button>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundArtist;
