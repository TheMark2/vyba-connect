
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { X, Sun, Moon, Monitor } from "lucide-react";

const MobileMenu = () => {
  return (
    <SheetContent side="top" className="h-full pt-10 bg-vyba-cream overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">VYBA</h2>
        <SheetClose className="rounded-full p-2 hover:bg-gray-100">
          <X className="h-6 w-6" />
        </SheetClose>
      </div>

      <nav className="flex flex-col space-y-2 mb-6">
        <Link to="/" className="px-4 py-4 rounded-lg bg-[#F5F1EB] text-black font-medium">
          Inicio
        </Link>
        <Link to="/artistas" className="px-4 py-4 rounded-lg hover:bg-[#F5F1EB] text-black font-medium">
          Artistas
        </Link>
        <Link to="/todos-generos" className="px-4 py-4 rounded-lg hover:bg-[#F5F1EB] text-black font-medium">
          Todos los géneros
        </Link>
        <Link to="/todos-artistas" className="px-4 py-4 rounded-lg hover:bg-[#F5F1EB] text-black font-medium">
          Todos los artistas
        </Link>
      </nav>

      <Separator className="my-6" />

      <div className="flex justify-center space-x-6 my-6">
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <Moon className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <Monitor className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col space-y-3 mt-6">
        <Button className="w-full rounded-full bg-[#F5F1EB] text-black hover:bg-[#EDE8E0]">
          Iniciar sesión/Registrarse
        </Button>
        <Button className="w-full rounded-full bg-[#D4DDFF] text-[#222845] hover:bg-primary-hover">
          Promocionarse como artista
        </Button>
      </div>
    </SheetContent>
  );
};

export default MobileMenu;
