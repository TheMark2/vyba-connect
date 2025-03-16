
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="bg-vyba-cream py-12 border-t border-gray-200/30">
      <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">VYBA</h2>
            <p className="text-black/60 text-sm mt-2">© 2023 Vyba. Todos los derechos reservados</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6">
            <div className="space-y-3">
              <Link to="/blog" className="block text-black/70 hover:text-black text-sm">Blog</Link>
              <Link to="/ayuda" className="block text-black/70 hover:text-black text-sm">Ayuda</Link>
            </div>
            <div className="space-y-3">
              <Link to="/precios" className="block text-black/70 hover:text-black text-sm">Precios</Link>
              <Link to="/buscar" className="block text-black/70 hover:text-black text-sm">Buscar</Link>
            </div>
            <div className="space-y-3 col-span-2 md:col-span-1">
              <Link to="/artistas" className="block text-black/70 hover:text-black text-sm">Ver artistas</Link>
              <Button className="text-xs px-4 py-2 h-auto mt-2" variant="secondary">
                <Globe className="w-4 h-4 mr-2" />
                Español
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
