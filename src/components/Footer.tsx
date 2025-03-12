
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-vyba-cream">
      <div className="container mx-auto px-40 md:px-32 lg:px-24 xl:px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold">VYBA</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/blog" className="block text-black/80 hover:text-black">Blog</Link>
              <Link to="/ayuda" className="block text-black/80 hover:text-black">Ayuda</Link>
            </div>
            <div className="space-y-4">
              <Link to="/precios" className="block text-black/80 hover:text-black">Precios</Link>
              <Link to="/buscar" className="block text-black/80 hover:text-black">Buscar</Link>
            </div>
            <div className="space-y-4">
              <Link to="/artistas" className="block text-black/80 hover:text-black">Ver artistas</Link>
            </div>
            <div className="space-y-4">
              <Button className="btn-secondary text-sm">
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
