import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor } from "lucide-react";

const MobileMenu = () => {
  const [theme, setTheme] = useState("light");
  const backgroundRef = useRef(null);
  const containerRef = useRef(null);

  // Actualizar la posición del fondo cuando cambia el tema
  useEffect(() => {
    if (!backgroundRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const buttons = container.querySelectorAll('button');
    
    // Encontrar el botón activo basado en el tema
    let activeButton;
    if (theme === "light") activeButton = buttons[0];
    else if (theme === "dark") activeButton = buttons[1];
    else if (theme === "system") activeButton = buttons[2];
    
    if (activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      // Calcular la posición relativa
      const left = buttonRect.left - containerRect.left;
      
      // Aplicar transformación
      backgroundRef.current.style.transform = `translateX(${left}px)`;
      backgroundRef.current.style.width = `${buttonRect.width}px`;
    }
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
            className="absolute top-1 bottom-1 left-1 bg-[#F8F8F8] rounded-full transition-all duration-300 ease-in-out"
            style={{ width: '56px', height: 'calc(100% - 8px)' }}
          />

          {/* Botones de cambio de tema */}
          <button
            onClick={() => setTheme("light")}
            className={`rounded-l-full w-14 h-10 flex items-center justify-center z-10 ${
              theme !== 'light' ? 'border border-[#F8F8F8]' : ''
            }`}
          >
            <Sun className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setTheme("dark")}
            className={`w-14 h-10 flex items-center justify-center z-10 ${
              theme !== 'dark' ? 'border border-[#F8F8F8]' : ''
            }`}
          >
            <Moon className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setTheme("system")}
            className={`rounded-r-full w-14 h-10 flex items-center justify-center z-10 ${
              theme !== 'system' ? 'border border-[#F8F8F8]' : ''
            }`}
          >
            <Monitor className="h-5 w-5" />
          </button>
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