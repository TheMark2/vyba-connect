
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-56 md:px-40 lg:px-8 xl:px-2 py-16 flex items-center gap-12">
          {/* Left column with text and search */}
          <div className="flex-1 space-y-8">
            <h1 className="text-7xl font-black leading-tight">
              El portal perfecto para encontrar tu dj
            </h1>
            
            {/* Search bar */}
            <div className="flex items-center max-w-xl">
              <Button variant="secondary" className="w-full relative flex items-center justify-start gap-3 px-6 py-7 text-lg font-normal hover:bg-secondary-hover">
                <Search className="size-5 text-black/60" />
                <span className="text-black font-bold">Buscar artistas</span>
              </Button>
            </div>
          </div>

          {/* Right column with image */}
          <div className="flex-1">
            <div className="rounded-3xl overflow-hidden">
              <img src="/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png" alt="DJ performing at a concert" className="w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Index;
