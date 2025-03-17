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
  return <SheetContent side="bottom" className="h-[calc(100vh-96px)] bg-white pt-10 overflow-y-auto mt-24 border-t-0">
      <nav className="flex flex-col space-y-2 mb-6">
        <Link to="/" className="px-4 py-3 rounded-lg bg-[#F8F8F8] text-black font-medium">
          Inicio
        </Link>
        <Link to="/artistas" className="px-4 py-3 rounded-lg hover:bg-[#F8F8F8] text-black font-medium">
          Artistas
        </Link>
        <Link to="/todos-generos" className="px-4 py-3 rounded-lg hover:bg-[#F8F8F8] text-black font-medium">
          Todos los géneros
        </Link>
        <Link to="/todos-artistas" className="px-4 py-3 rounded-lg hover:bg-[#F8F8F8] text-black font-medium">
          Todos los artistas
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
            <Sun className="h-5 w-5" />
          </button>
          
          <button onClick={() => setTheme("dark")} className="w-14 h-16 flex items-center justify-center z-10 relative">
            <Moon className="h-5 w-5" />
          </button>
          
          <button onClick={() => setTheme("system")} className="rounded-r-full w-14 h-16 flex items-center justify-center z-10 relative">
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
    </SheetContent>;
};
export default MobileMenu;