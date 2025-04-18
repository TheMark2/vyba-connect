import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 px-6 md:px-24 lg:px-32 xl:px-40 2xl:px-64 min-h-screen">
      <div className="flex items-center justify-center py-12 md:py-0">
        <div className="md:text-left text-center md:items-start items-center">
          <img src="/lovable-uploads/logo.png" alt="VYBA" className="h-12 mb-8 mx-auto md:mx-0" />
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-semibold mb-2">
            <span className="text-[#525252]">404</span>: Página fuera de ritmo
          </h1>
          <p className="text-base md:text-xl lg:text-2xl font-light">Oops! Parece que nuestro beat se ha descompuesto.</p>
          <Button
            variant="terciary"
            className="px-10 mt-8"
            onClick={() => navigate("/")}
          >
            Regresar al flow
          </Button>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center">
        <img src="/lovable-uploads/vinil.png" alt="VYBA" className="max-w-xs md:max-w-md lg:max-w-lg mb-12" />
      </div>
    </div>

  );
};

export default NotFound;
