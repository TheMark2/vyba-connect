
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor, Home, Users, Music, Palette, X } from "lucide-react";

const MobileMenu = () => {
  const [theme, setTheme] = useState("light");
  const backgroundRef = useRef(null);
  const containerRef = useRef(null);
  const location = useLocation();

  // Función para verificar si un enlace está activo
  const isActive = (path: string) => location.pathname === path;

  // Función para sincronizar la posición y forma del fondo
  const updateBackgroundPosition = newTheme => {
    if (!backgroundRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const buttons = container.querySelectorAll('button');
    let activeIndex;
    if (newTheme === "light") activeIndex = 0;else if (newTheme === "dark") activeIndex = 1;else if (newTheme === "system") activeIndex = 2;
    const activeButton = buttons[activeIndex];
    if (activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Calcular la posición exacta
      const left = buttonRect.left - containerRect.left;

      // Eliminar cualquier transición anterior para asegurar una actualización inmediata
      backgroundRef.current.style.transition = 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';

      // Actualizar todo en un solo paso para que la animación sea fluida
      requestAnimationFrame(() => {
        backgroundRef.current.style.transform = `translateX(${left}px)`;
        backgroundRef.current.style.width = `${buttonRect.width}px`;

        // Actualizar el border-radius según el índice
        if (activeIndex === 0) {
          backgroundRef.current.style.borderRadius = '9999px 0 0 9999px';
        } else if (activeIndex === 1) {
          backgroundRef.current.style.borderRadius = '0';
        } else if (activeIndex === 2) {
          backgroundRef.current.style.borderRadius = '0 9999px 9999px 0';
        }
      });
    }
  };

  // Ejecutar cuando cambia el tema
  useEffect(() => {
    updateBackgroundPosition(theme);
  }, [theme]);

  // Ejecutar después del montaje para la posición inicial
  useEffect(() => {
    // Pequeño retraso para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
      updateBackgroundPosition(theme);
    }, 100);
  }, []);

  return (
    <SheetContent side="right" className="h-[100dvh] w-full p-0 border-0 bg-white z-[999]">
      {/* Botón de cierre en la esquina superior derecha */}
      <div className="flex justify-end p-6">
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <X className="h-6 w-6" />
          </Button>
        </SheetClose>
      </div>
      
      {/* Contenido del menú, con padding adicional en la parte superior */}
      <div className="px-6 pb-10 h-full flex flex-col">
        <nav className="flex flex-col space-y-2 mb-6">
          <Link to="/" className={`px-4 py-3 rounded-lg ${isActive('/') ? 'bg-[#F8F8F8]' : 'hover:bg-[#F8F8F8]'} text-black font-medium transition-all duration-200`}>
            <div className="flex items-center space-x-3">
              <Home 
                className={`h-5 w-5 transition-all duration-200 ${isActive('/') ? 'text-gray-800' : 'hover:text-gray-800'}`} 
                strokeWidth={isActive('/') ? 2 : 1.5}
              />
              <span>Inicio</span>
            </div>
          </Link>
          <Link to="/artistas" className={`px-4 py-3 rounded-lg ${isActive('/artistas') ? 'bg-[#F8F8F8]' : 'hover:bg-[#F8F8F8]'} text-black font-medium transition-all duration-200`}>
            <div className="flex items-center space-x-3">
              <Users 
                className={`h-5 w-5 transition-all duration-200 ${isActive('/artistas') ? 'text-gray-800' : 'hover:text-gray-800'}`} 
                strokeWidth={isActive('/artistas') ? 2 : 1.5}
              />
              <span>Artistas</span>
            </div>
          </Link>
          <Link to="/todos-generos" className={`px-4 py-3 rounded-lg ${isActive('/todos-generos') ? 'bg-[#F8F8F8]' : 'hover:bg-[#F8F8F8]'} text-black font-medium transition-all duration-200`}>
            <div className="flex items-center space-x-3">
              <Palette 
                className={`h-5 w-5 transition-all duration-200 ${isActive('/todos-generos') ? 'text-gray-800' : 'hover:text-gray-800'}`} 
                strokeWidth={isActive('/todos-generos') ? 2 : 1.5}
              />
              <span>Todos los géneros</span>
            </div>
          </Link>
          <Link to="/todos-artistas" className={`px-4 py-3 rounded-lg ${isActive('/todos-artistas') ? 'bg-[#F8F8F8]' : 'hover:bg-[#F8F8F8]'} text-black font-medium transition-all duration-200`}>
            <div className="flex items-center space-x-3">
              <Music 
                className={`h-5 w-5 transition-all duration-200 ${isActive('/todos-artistas') ? 'text-gray-800' : 'hover:text-gray-800'}`} 
                strokeWidth={isActive('/todos-artistas') ? 2 : 1.5}
              />
              <span>Todos los artistas</span>
            </div>
          </Link>
        </nav>
        <Separator className="my-6" />
        <div className="flex justify-center my-6">
          <div ref={containerRef} className="border border-[#F8F8F8] rounded-full flex relative overflow-hidden p-0">
            {/* Fondo animado */}
            <div ref={backgroundRef} className="absolute bg-[#F8F8F8]" style={{
            left: '1px',
            top: '4px',
            bottom: '4px',
            width: '56px',
            height: 'calc(100% - 8px)',
            willChange: 'transform, border-radius, width'
          }} />

            {/* Botones de cambio de tema */}
            <button onClick={() => setTheme("light")} className="rounded-l-full w-14 h-16 flex items-center justify-center z-10 relative">
              <Sun className={`h-5 w-5 transition-all duration-200 ${theme === 'light' ? 'text-gray-800' : ''}`} />
            </button>
            
            <button onClick={() => setTheme("dark")} className="w-14 h-16 flex items-center justify-center z-10 relative">
              <Moon className={`h-5 w-5 transition-all duration-200 ${theme === 'dark' ? 'text-gray-800' : ''}`} />
            </button>
            
            <button onClick={() => setTheme("system")} className="rounded-r-full w-14 h-16 flex items-center justify-center z-10 relative">
              <Monitor className={`h-5 w-5 transition-all duration-200 ${theme === 'system' ? 'text-gray-800' : ''}`} />
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-3 mt-auto mb-10">
          <Button className="w-full rounded-full bg-[#D4DDFF] text-[#222845] hover:bg-[#C4D1FF]">
            Iniciar sesión/Registrarse
          </Button>
          <Button className="w-full rounded-full bg-[#E7D3D3] text-black hover:bg-[#DDCACA]">
            Promocionarse como artista
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};
export default MobileMenu;
