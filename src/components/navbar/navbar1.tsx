
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MiniSearchBar from "@/components/search/MiniSearchBar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

const Navbar1 = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
      // Comprobar sesión actual
      const checkUser = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      };
      
      checkUser();
      
      // Escuchar cambios en la autenticación
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }, []);
    
    const handleAuth = () => {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    };
    
    return (
        <nav>
        <div className="fixed top-0 left-0 w-full bg-white/30 dark:bg-black z-50 backdrop-blur-xl px-6 md:px-6 lg:px-16">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
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
            <Button onClick={handleAuth}>
              {user ? 'Mi cuenta' : 'Iniciar sesión'}
            </Button>
          </div>
        </div>
      </nav>
    );
};

export default Navbar1;
