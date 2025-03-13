import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="mx-auto px-6 md:px-10 lg:px-14 xl:px-16 h-24 flex items-center justify-between">
      <div className="flex items-center space-x-12">
        <h1 className="text-3xl font-bold">VYBA</h1>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-black font-medium text-base">Inicio</Link>
          <Link to="/artistas" className="text-black font-medium text-base">Artistas</Link>
          <div className="relative">
            <button className="text-black font-medium text-base flex items-center">
              Todos los artistas
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <button className="text-black font-medium text-base flex items-center">
              Todos los géneros
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Button className="text-base">
        Entrar/Registrarse
      </Button>
    </div>
  );
};

export default Navbar;
