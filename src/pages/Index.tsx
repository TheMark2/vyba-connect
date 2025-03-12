
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 flex items-center gap-8">
          {/* Left column with text and search */}
          <div className="flex-1 space-y-8">
            <h1 className="text-7xl font-black leading-tight">
              El portal perfecto para encontrar tu dj
            </h1>
            
            {/* Search bar */}
            <div className="flex items-center max-w-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar artistas"
                  className="w-full px-6 py-4 bg-[#FAF8F6] rounded-full pr-12 text-lg"
                />
                <Button
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full size-10 p-0 bg-primary hover:bg-primary-hover"
                >
                  <Search className="size-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right column with image */}
          <div className="flex-1">
            <div className="rounded-3xl overflow-hidden">
              <img 
                src="/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png"
                alt="DJ performing at a concert"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
