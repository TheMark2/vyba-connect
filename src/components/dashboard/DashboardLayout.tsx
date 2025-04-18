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
  Icon
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
  const [userName, setUserName] = useState<string>("Usuario"); // Aquí deberías obtener el nombre del usuario de tu estado global o API

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Al dia' },
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
      <div className="bg-white">
        <div className="flex items-center justify-between h-16 px-32">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/logovybaartists.png" alt="Logo" className="h-8" />
          </div>

          <nav className="flex-1 flex justify-center">
            <div className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <p className={cn("text-base font-regular text-vyba-tertiary hover:bg-vyba-gray hover:text-vyba-navy rounded-full px-4 py-2 transition-all duration-300 ease-in-out", isActive && "text-vyba-navy bg-vyba-gray font-medium transition-all duration-300 ease-in-out")}>{item.label}</p>
                  </Link>
                );
              })}
            </div>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="h-12 w-12 rounded-full cursor-pointer transition-colors duration-300 overflow-hidden">
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

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;