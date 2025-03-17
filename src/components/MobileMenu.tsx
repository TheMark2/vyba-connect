import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const MobileMenu = () => {
  const [theme, setTheme] = useState("light");
  const backgroundRef = useRef(null);
  const containerRef = useRef(null);

  // Función para mover el fondo
  const moveBackground = (value) => {
    if (!backgroundRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const items = container.querySelectorAll('[data-value]');
    const targetItem = Array.from(items).find(item => item.dataset.value === value);
    
    if (targetItem) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetItem.getBoundingClientRect();
      
      const left = targetRect.left - containerRect.left;
      
      backgroundRef.current.style.transform = `translateX(${left}px)`;
      backgroundRef.current.style.width = `${targetRect.width}px`;
    }
  };

  // Actualizar la posición del fondo cuando cambia el tema
  useEffect(() => {
    moveBackground(theme);
  }, [theme]);

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
        <div 
          ref={containerRef}
          className="bg-[#F5F1EB] p-1 rounded-full flex relative"
        >
          {/* Fondo animado */}
          <div 
            ref={backgroundRef}
            className="absolute top-1 bottom-1 bg-[#F8F8F8] rounded-full transition-transform duration-300 ease-in-out"
            style={{ width: '56px', height: 'calc(100% - 8px)' }}
          />

          {/* Botones de cambio de tema */}
          <ToggleGroupItem 
            data-value="light"
            value="light" 
            aria-label="Modo claro" 
            onClick={() => setTheme("light")}
            className={`rounded-bl-full rounded-tl-full w-14 h-10 flex items-center justify-center z-10 ${
              theme !== 'light' ? 'border border-[#F8F8F8]' : ''
            }`}
          >
            <Sun className="h-5 w-5" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            data-value="dark"
            value="dark" 
            aria-label="Modo oscuro" 
            onClick={() => setTheme("dark")}
            className={`w-14 h-10 flex items-center justify-center rounded-none z-10 ${
              theme !== 'dark' ? 'border border-[#F8F8F8]' : ''
            }`}
          >
            <Moon className="h-5 w-5" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            data-value="system"
            value="system" 
            aria-label="Modo sistema" 
            onClick={() => setTheme("system")}
            className={`rounded-br-full rounded-tr-full w-14 h-10 flex items-center justify-center z-10 ${
              theme !== 'system' ? 'border border-[#F8F8F8]' : ''
            }`}
          >
            <Monitor className="h-5 w-5" />
          </ToggleGroupItem>
        </div>
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