
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const MobileMenu = () => {
  const [theme, setTheme] = useState("light");

  return (
    <SheetContent 
      side="bottom" 
      className="h-[calc(100vh-96px)] bg-white pt-10 overflow-y-auto mt-24 border-t-0"
    >
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

      <div className="flex justify-center my-6">
        <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value)} className="bg-[#F5F1EB] p-1 rounded-full">
          <ToggleGroupItem value="light" aria-label="Modo claro" className="data-[state=on]:bg-white rounded-bl-full rounded-tl-full w-14 h-10 flex items-center justify-center border-1 border-black">
            <Sun className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Modo oscuro" className="data-[state=on]:bg-white w-14 h-10 flex items-center justify-center">
            <Moon className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="system" aria-label="Modo sistema" className="data-[state=on]:bg-white rounded-br-full rounded-tr-full w-14 h-10 flex items-center justify-center">
            <Monitor className="h-5 w-5" />
          </ToggleGroupItem>
        </ToggleGroup>
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
