import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MiniSearchBar from "@/components/search/MiniSearchBar";
import { ListFilter } from "lucide-react";
import FilterDialog from "@/components/filters/FilterDialog";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar2 = () => {
    const navigate = useNavigate();
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const userAvatarUrl = user?.user_metadata?.avatar_url || null;
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "Usuario";
    
    const handleOpenFilterDialog = () => {
        setOpenFilterDialog(true);
    };
    
    const handleAuth = () => {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    };
    
    const handleLogout = async () => {
      await supabase.auth.signOut();
      navigate('/');
    };
    
    const getUserInitial = () => {
      if (userName) {
        return userName.charAt(0).toUpperCase();
      }
      return "U";
    };
    
    return (
        <nav className="relative">
            <div className="fixed top-0 left-0 px-6 md:px-6 lg:px-16 w-full bg-white dark:bg-black z-50">
                <div className="max-w-[1800px] mx-auto py-5 flex items-center justify-between relative">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link to='/' className="p-1">
                            <img
                                src="/lovable-uploads/logovyba.png"
                                alt="Logo Vyba Artists"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>

                    {/* MiniSearchBar Centrally Positioned */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <MiniSearchBar />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center -space-x-1">
                            <Link to='/auth' className="text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray hover:no-underline">
                                Hazte artista
                            </Link>
                            <Button 
                                variant="ghost" 
                                className="flex items-center rounded-full p-4" 
                                onClick={handleOpenFilterDialog}
                            >
                                <ListFilter className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        {isAuthenticated ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="focus:outline-none">
                                <Avatar className="h-10 w-10 cursor-pointer">
                                  <AvatarImage src={userAvatarUrl || ""} />
                                  <AvatarFallback className="bg-black text-white">
                                    {getUserInitial()}
                                  </AvatarFallback>
                                </Avatar>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
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
