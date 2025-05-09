import React from 'react';
import { useParams } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { AudioLines, Earth, Image, Maximize, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// Importaciones de estilos Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ArtistPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = React.useState<'images' | 'videos'>('images');

  const ArtistReal = [
    {
      id: 1,
      name: 'Nombre del Artista',
      image: '/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png',
      description: 'Descripción del artista',
      instagram: '@nombre_artista',
      about: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'
    }
  ]

  // Datos de ejemplo para el carrusel
  const carouselItems = [
    {
      id: 1,
      title: 'Obra 1',
      image: '/lovable-uploads/girl1.png',
      description: 'Descripción de la obra 1'
    },
    {
      id: 2,
      title: 'Obra 2',
      image: '/lovable-uploads/girl2.png',
      description: 'Descripción de la obra 2'
    },
    {
      id: 3,
      title: 'Obra 3',
      image: '/lovable-uploads/image.png',
      description: 'Descripción de la obra 3'
    },
    {
      id: 4,
      title: 'Obra 4',
      image: '/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png',
      description: 'Descripción de la obra 4'
    },
    {
      id: 5,
      title: 'Obra 5',
      image: '/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png',
      description: 'Descripción de la obra 5'
    },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Banner superior */}
      <div className="relative w-full h-[300px]">
        {/* Imagen de fondo */}
        <img 
          src="/lovable-uploads/image2.png" 
          alt="Banner del artista"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradiente de difuminado */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex items-center gap-6 ">
            {/* Avatar del artista */}
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                <img 
                  src="/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png" 
                  alt="Avatar del artista" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-white flex flex-col items-start gap-2">
                <div className="bg-white/20 rounded-full py-2 px-4 backdrop-blur-sm ">
                    <p className="font-medium text-black text-xs md:text-sm font-figtree ">Tipo de artista</p>            
                </div>
              <h1 className="text-3xl font-bold font-figtree">Nombre del Artista</h1>
              <p className="text-sm opacity-90">Instagram: @nombre_artista</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Carrusel */}
      <div className="w-full mt-8">
        <div className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-start gap-2">
            <button
              onClick={() => setActiveTab('images')}
              className={cn(
                "p-2 rounded-full hover:bg-accent transition-colors",
                activeTab === 'images' ? "bg-vyba-gray" : "bg-transparent"
              )}
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={cn(
                "p-2 rounded-full hover:bg-accent transition-colors",
                activeTab === 'videos' ? "bg-vyba-gray" : "bg-transparent"
              )}
            >
              <Video className="w-5 h-5" />
            </button>
          </div>
            
          <Swiper
            modules={[]}
            spaceBetween={10}
            slidesPerView={1}
            navigation={false}
            autoplay={false}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="w-full px-32"
          >
            {carouselItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-card rounded-2xl overflow-hidden cursor-pointer">
                  <div className="aspect-[5/4] w-full relative group">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent flex items-start justify-end p-10 flex-col gap-1">
                      <p className="text-white text-center text-3xl font-semibold truncate">
                        Fiesta privada en Miami
                      </p>
                      <p className="text-white text-center text-sm font-figtree truncate">Sant Feliu de Codines</p>
                    </div>
                    <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30">
                        <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sobre mi */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold font-figtree">Sobre mí</h2>
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
                <Badge variant="default" className="bg-vyba-gray text-black rounded-md flex items-center gap-2 w-fit">
                    <Earth className="w-5 h-5" />
                <p className="text-base font-medium text-black font-figtree">España</p>
                </Badge>
                <Badge variant="default" className="bg-vyba-gray text-black rounded-md flex items-center gap-2 w-fit">
                    <AudioLines className="w-5 h-5" />
                <p className="text-base font-medium text-black font-figtree">Reggaeton</p>
                </Badge>
                <Badge variant="default" className="bg-vyba-gray text-black rounded-md flex items-center gap-2 w-fit">
                    <AudioLines className="w-5 h-5" />
                <p className="text-base font-medium text-black font-figtree">Rock</p>
                </Badge>
                <Badge variant="default" className="bg-vyba-gray text-black rounded-md flex items-center gap-2 w-fit">
                    <AudioLines className="w-5 h-5" />
                <p className="text-base font-medium text-black font-figtree">Urbano</p>
                </Badge>
            </div>
          </div>
          <p className="text-base font-figtree">
            {ArtistReal[0].about}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
