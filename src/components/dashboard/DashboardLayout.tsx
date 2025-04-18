import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Settings,
  BarChart,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Usuario");

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Al día' },
    { path: '/dashboard/profile', label: 'Perfil' },
    { path: '/dashboard/messages', label: 'Mensajes' },
    { path: '/dashboard/analytics', label: 'Analíticas' },
    { path: '/dashboard/settings', label: 'Configuración' },
  ];

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-white/30 dark:bg-black z-50 backdrop-blur-xl px-4">
        <div className="grid grid-cols-3 items-center py-4 px-8 md:px-32">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/logovybaartists.png" alt="Logo Artistas Vyba" className="h-10" />
          </div>

          {/* Navigation Links (centered) */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="link"
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray hover:no-underline",
                      isActive && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full"
                    )}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* User Avatar */}
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-12 w-12 rounded-full cursor-pointer overflow-hidden transition-colors duration-300">
                  {userImage ? (
                    <img 
                      src={userImage}
                      alt={userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-vyba-gray flex items-center justify-center">
                      <User className="h-4 w-4 text-vyba-navy" />
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
