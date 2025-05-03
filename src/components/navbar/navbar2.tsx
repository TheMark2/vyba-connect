import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MiniSearchBar from "@/components/search/MiniSearchBar";
import { ListFilter } from "lucide-react";
import FilterDialog from "@/components/filters/FilterDialog";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

const Navbar2 = () => {
    const navigate = useNavigate();
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const { 
      user, 
      isAuthenticated, 
      userRole, 
      avatarUrl, 
      userDisplayName, 
      signOut,
      isLoading 
    } = useAuth();
    
    const handleOpenFilterDialog = () => {
        setOpenFilterDialog(true);
    };
    
    const handleAuth = () => {
      if (isAuthenticated) {
        // Dirigir según el rol del usuario
        if (userRole === 'artist') {
          navigate('/dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        navigate('/auth');
      }
    };
    
    const handleLogout = async () => {
      await signOut();
      navigate('/');
    };
    
    const getUserInitial = () => {
      if (userDisplayName) {
        return userDisplayName.charAt(0).toUpperCase();
      }
      return "U";
    };
    
    return (
        <nav className="relative">
            <div className="fixed top-0 left-0 px-6 md:px-6 lg:px-16 w-full bg-white dark:bg-black z-50">
                <div className="max-w-[1800px] mx-auto py-5 flex items-center justify-between relative">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <button onClick={() => navigate('/')} className="p-1">
                            <img
                                src="/lovable-uploads/logovyba.png"
                                alt="Logo Vyba Artists"
                                className="h-10 w-auto"
                            />
                        </button>
                    </div>

                    {/* MiniSearchBar Centrally Positioned */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <MiniSearchBar />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center -space-x-1">
                            <Button variant="ghost" className="flex items-center gap-3" onClick={() => navigate('/auth')}>Hazte artista</Button>
                            <Button 
                                variant="ghost" 
                                className="flex items-center rounded-full p-4" 
                                onClick={handleOpenFilterDialog}
                            >
                                <ListFilter className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        {isLoading ? (
                          <Skeleton className="h-10 w-10 rounded-full" />
                        ) : isAuthenticated ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="focus:outline-none">
                                <Avatar className="h-10 w-10 cursor-pointer">
                                  <AvatarImage src={avatarUrl || undefined} />
                                  <AvatarFallback className="bg-black text-white">
                                    {getUserInitial()}
                                  </AvatarFallback>
                                </Avatar>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(userRole === 'artist' ? '/dashboard' : '/user-dashboard')}>
                                Mi cuenta
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={handleLogout}>
                                Cerrar sesión
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button onClick={handleAuth}>Entrar/Registrarse</Button>
                        )}
                    </div>
                </div>
            </div>
            <FilterDialog open={openFilterDialog} onOpenChange={setOpenFilterDialog} onApplyFilters={() => {}} />
        </nav>
    );
};

export default Navbar2;
