
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w 3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-black">
            Conecta con los mejores artistas musicales
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Encuentra el artista perfecto para tu evento o promociona tus servicios musicales
            de manera profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-primary">
              Buscar Artistas
            </Button>
            <Button className="btn-secondary">
              Registrarse como Artista
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
