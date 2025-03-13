
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-transparent">
      <div className="container mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:max-w-[1800px] h-24 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <h1 className="text-3xl font-bold">VYBA</h1>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-black font-medium text-sm">Inicio</Link>
            <Link to="/artistas" className="text-black font-medium text-sm">Artistas</Link>
            <div className="relative">
              <button className="text-black font-medium text-sm flex items-center">
                Todos los artistas
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <button className="text-black font-medium text-sm flex items-center">
                Todos los géneros
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <Button 
          className="bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-full text-sm font-medium px-6 py-2"
        >
          Entrar/Registrarse
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
