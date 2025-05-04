import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import FilterDialog from "@/components/filters/FilterDialog";
import Navbar2 from "@/components/navbar/navbar2";

// Define los datos de ejemplo para la página de DJs
const djsData = [
  {
    id: "1",
    name: "DJ Marcos",
    type: "DJ",
    description: "DJ especializado en bodas y eventos corporativos",
    images: [
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
    ],
    rating: 4.8,
    priceRange: "450-550€",
    isFavorite: false,
  },
  {
    id: "2",
    name: "DJ Laura",
    type: "DJ",
    description: "DJ especializada en música electrónica y house",
    images: [
      "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
      "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png",
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
    ],
    rating: 4.9,
    priceRange: "500-600€",
    isFavorite: false,
  },
  {
    id: "3",
    name: "DJ Carlos",
    type: "DJ",
    description: "DJ con experiencia en eventos corporativos",
    images: [
      "/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png",
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
    ],
    rating: 4.7,
    priceRange: "400-500€",
    isFavorite: false,
  },
  {
    id: "4",
    name: "DJ Ana",
    type: "DJ",
    description: "DJ versátil con repertorio internacional",
    images: [
      "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
      "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
      "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
    ],
    rating: 4.9,
    priceRange: "450-550€",
    isFavorite: false,
  },
  {
    id: "5",
    name: "DJ Miguel",
    type: "DJ",
    description: "DJ especializado en música latina y crossover",
    images: [
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
      "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
      "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
    ],
    rating: 4.6,
    priceRange: "350-450€",
    isFavorite: false,
  },
  {
    id: "6",
    name: "DJ Silvia",
    type: "DJ",
    description: "DJ especializada en eventos sociales y bodas",
    images: [
      "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png",
      "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
      "/lovable-uploads/b1d87308-8791-4bd4-bd43-e4f7cf7d9042.png",
    ],
    rating: 4.8,
    priceRange: "450-550€",
    isFavorite: false,
  },
];

const DJsPage = () => {
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [sortOption, setSortOption] = useState("recommended");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Ordenar DJs según la opción seleccionada
  const sortedDjs = [...djsData].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        const aMin = parseInt(a.priceRange.split("-")[0]);
        const bMin = parseInt(b.priceRange.split("-")[0]);
        return aMin - bMin;
      case "price-high-low":
        const aMax = parseInt(a.priceRange.split("-")[1]);
        const bMax = parseInt(b.priceRange.split("-")[1]);
        return bMax - aMax;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0; // recommended (default order)
    }
  });

  // Filtrar por término de búsqueda si existe
  const filteredDjs = sortedDjs.filter(
    (dj) =>
      dj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dj.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejadores de eventos
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleArtistClick = (artistId: string) => {
    navigate(`/artista/${artistId}`);
  };

  const handleFavoriteToggle = (artistId: string) => {
    console.log(`Toggled favorite for artist: ${artistId}`);
    // Aquí iría la lógica para manejar favoritos
  };

  const handleApplyFilters = (filters: any) => {
    console.log("Filtros aplicados:", filters);
    // Aquí iría la lógica para aplicar filtros
  };

  return (
    <>
      <Navbar2 />
      <div className="px-6 md:px-6 lg:px-16 mx-auto my-6 mt-32">
        {/* Cabecera y filtros */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">DJs</h1>
            <p className="text-gray-600">
              Encuentra los mejores DJs para tu evento
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar DJs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setOpenFilterDialog(true)}
              >
                <ListFilter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>

              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <span>
                    {sortOption === "recommended"
                      ? "Recomendados"
                      : sortOption === "price-low-high"
                      ? "Precio: menor a mayor"
                      : sortOption === "price-high-low"
                      ? "Precio: mayor a menor"
                      : "Valoración"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10 hidden">
                  <div className="py-1">
                    <button
                      className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                      onClick={() => handleSortChange("recommended")}
                    >
                      Recomendados
                    </button>
                    <button
                      className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                      onClick={() => handleSortChange("price-low-high")}
                    >
                      Precio: menor a mayor
                    </button>
                    <button
                      className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                      onClick={() => handleSortChange("price-high-low")}
                    >
                      Precio: mayor a menor
                    </button>
                    <button
                      className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                      onClick={() => handleSortChange("rating")}
                    >
                      Valoración
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDjs.map((dj) => (
            <ArtistProfileCard
              key={dj.id}
              id={dj.id}
              name={dj.name}
              type={dj.type}
              description={dj.description}
              images={dj.images}
              rating={dj.rating}
              priceRange={dj.priceRange}
              isFavorite={dj.isFavorite}
              onClick={() => handleArtistClick(dj.id)}
              onFavoriteToggle={() => handleFavoriteToggle(dj.id)}
            />
          ))}

          {/* DJs Premium featured */}
          <div className="col-span-full mt-12 mb-6">
            <h2 className="text-xl font-bold mb-6">DJs Premium Destacados</h2>
          </div>

          {/* DJs Premium Grid */}
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {djsData.slice(0, 4).map((dj) => (
              <ArtistProfileCard
                key={dj.id}
                id={dj.id}
                name={dj.name}
                type={dj.type}
                description={dj.description}
                images={dj.images}
                rating={dj.rating}
                priceRange={dj.priceRange}
                isFavorite={dj.isFavorite}
                onClick={() => handleArtistClick(dj.id)}
                onFavoriteToggle={() => handleFavoriteToggle(dj.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <FilterDialog
        open={openFilterDialog}
        onOpenChange={setOpenFilterDialog}
        onApplyFilters={handleApplyFilters}
      />

      <Footer />
    </>
  );
};

export default DJsPage;
