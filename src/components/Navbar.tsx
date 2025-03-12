
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return <nav className="bg-vyba-cream backdrop-blur-xl">
      <div className="container mx-auto px-30 md:px-40 lg:px-20 xl:px-2 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">VYBA</h1>
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="nav-link bg-secondary">Inicio</Link>
            <Link to="/artistas" className="nav-link">Artistas</Link>
            <div className="relative group">
              <button className="nav-link group-hover:bg-secondary transition-colors duration-200">Todos los artistas</button>
            </div>
            <div className="relative group">
              <button className="nav-link group-hover:bg-secondary transition-colors duration-200">Todos los géneros</button>
            </div>
          </div>
        </div>
        <Button className="btn-secondary">
          Entrar/Registrarse
        </Button>
      </div>
    </nav>;
};
export default Navbar;
