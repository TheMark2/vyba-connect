
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">VYBA</h1>
            <div className="hidden md:flex items-center space-x-1">
              <a href="#" className="nav-link">Inicio</a>
              <a href="#" className="nav-link">Artistas</a>
              <div className="relative group">
                <button className="nav-link">Todos los artistas</button>
              </div>
              <div className="relative group">
                <button className="nav-link">Todos los géneros</button>
              </div>
            </div>
          </div>
          <Button className="btn-primary">
            Entrar/Registrarse
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w 3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Conecta con los mejores artistas musicales
          </h1>
          <p className="text-xl text-vyba-navy/80 max-w-2xl mx-auto">
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
      <footer className="border-t bg-white/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold">VYBA</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <a href="#" className="block text-vyba-navy/80 hover:text-vyba-navy">Blog</a>
                <a href="#" className="block text-vyba-navy/80 hover:text-vyba-navy">Ayuda</a>
              </div>
              <div className="space-y-4">
                <a href="#" className="block text-vyba-navy/80 hover:text-vyba-navy">Precios</a>
                <a href="#" className="block text-vyba-navy/80 hover:text-vyba-navy">Buscar</a>
              </div>
              <div className="space-y-4">
                <a href="#" className="block text-vyba-navy/80 hover:text-vyba-navy">Ver artistas</a>
              </div>
              <div className="space-y-4">
                <button className="btn-secondary text-sm">
                  Español
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
