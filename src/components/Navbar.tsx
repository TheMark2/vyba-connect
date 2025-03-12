
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-vyba-cream backdrop-blur-xl">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">VYBA</h1>
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant={location.pathname === "/" ? "secondary" : "ghost"}
              asChild
            >
              <Link to="/">Inicio</Link>
            </Button>
            <Button
              variant={location.pathname === "/artistas" ? "secondary" : "ghost"}
              asChild
            >
              <Link to="/artistas">Artistas</Link>
            </Button>
            <Button variant="ghost">Todos los artistas</Button>
            <Button variant="ghost">Todos los géneros</Button>
          </div>
        </div>
        <Button className="btn-primary">
          Entrar/Registrarse
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
