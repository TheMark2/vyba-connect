
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MiniSearchBar from "@/components/search/MiniSearchBar";
import { useNavigate } from "react-router-dom";
import { MessageCircleDashed } from "lucide-react";

const Navbar1 = () => {
    const navigate = useNavigate();
    
    return (
        <nav>
        <div className="fixed top-0 left-0 w-full bg-white dark:bg-black z-50 px-4">
          <div className="max-w-[1800px] mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button onClick={() => navigate('/')} className="p-1">
                <img
                  src="/lovable-uploads/logovyba.png"
                  alt="Logo Vyba Artists"
                  className="h-10 w-auto"
                />
              </button>
            </div>
            <MiniSearchBar />
            <div className="flex items-center gap-4">
                <div className="flex items-center -space-x-1">
                    <Button variant="ghost" className="flex items-center gap-3" onClick={() => navigate('/auth')}>Hazte artista</Button>
                    <Button variant="ghost" className="flex items-center rounded-full p-4" onClick={() => navigate('/auth')}>
                        <MessageCircleDashed className="w-5 h-5" />
                    </Button>
                </div>
                <Button onClick={() => navigate('/auth')}>Entrar/Registrarse</Button>
            </div>
          </div>
        </div>
      </nav>
    );
};

export default Navbar1;
