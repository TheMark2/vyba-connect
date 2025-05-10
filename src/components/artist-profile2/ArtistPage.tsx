import React from 'react';
import { useParams } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { AudioLines, BaggageClaim, Calendar, Hourglass, Earth, Image, Maximize, Video, LampDesk, Monitor, Speaker, LandPlot, AudioWaveform, File, Wine, FileDown, Truck, LocateFixed, Forklift, TestTube } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
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
      about: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
      experience: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'
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
          <h4 className="text-xl font-medium font-figtree mt-4">Tipos de eventos que suelo ofrecer</h4>
          <div className="flex flex-row gap-2">
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
          <h4 className="text-xl font-medium font-figtree mt-4">Experiencia</h4>
          <div className="flex flex-row gap-2">
            <Badge variant="default" className="bg-vyba-gray text-black rounded-md flex items-center gap-2 w-fit">
                <Calendar className="w-5 h-5" />
            <p className="text-base font-medium text-black font-figtree">2024</p>
            </Badge>
            <Badge variant="default" className="bg-vyba-gray text-black rounded-md flex items-center gap-2 w-fit">
                <Calendar className="w-5 h-5" />
            <p className="text-base font-medium text-black font-figtree">2024</p>
            </Badge>
          </div>
          <p className="text-base font-figtree">
            {ArtistReal[0].experience}
          </p>
        </div>
        <h2 className="text-3xl font-bold font-figtree mt-8 mb-4">Montaje y transporte</h2>
        <div className="flex flex-col">
            <div className="flex flex-row gap-2 py-4">
                <Badge variant="default" className="bg-vyba-gray text-black rounded-md flex items-center gap-2 w-fit pl-2 cursor-pointer group">
                    <div className="h-12 w-12 bg-white rounded-sm flex items-center justify-center">
                        <File className="w-5 h-5 group-hover:hidden" />
                        <FileDown className="w-5 h-5 hidden group-hover:block" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-base font-medium text-black font-figtree">Rider técnico</p>
                        <p className="text-xs text-black font-figtree">Archivo PDF</p>
                    </div>
                </Badge>
                <Badge variant="default" className="bg-vyba-gray text-black rounded-md flex items-center gap-2 w-fit pl-2 cursor-pointer group">
                    <div className="h-12 w-12 bg-white rounded-sm flex items-center justify-center">
                        <File className="w-5 h-5 group-hover:hidden" />
                        <FileDown className="w-5 h-5 hidden group-hover:block" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-base font-medium text-black font-figtree">Rider hospitalário</p>
                        <p className="text-xs text-black font-figtree">Archivo PDF</p>
                    </div>
                </Badge>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-vyba-gray rounded-2xl p-6">
                <h3 className="text-lg font-medium font-figtree">Montaje</h3>
                <p className="text-base font-figtree my-4">Cuento con:</p>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2">
                        <div className="flex flex-col">
                            <p className="text-base text-vyba-navy font-medium font-figtree">Equipo de sonido</p>
                            <p className="text-sm font-figtree">El artista ha indicado que dispone de equipo de iluminación propio</p>
                        </div>
                        <AudioWaveform className="w-7 h-7" />
                    </div>
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2">
                        <div className="flex flex-col">
                            <p className="text-base text-vyba-navy font-medium font-figtree">Equipo de iluminación</p>
                            <p className="text-sm font-figtree">El artista ha indicado que dispone de equipo de iluminación propio</p>
                        </div>
                        <LampDesk className="w-7 h-7" />
                    </div>
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2 gap-2">
                        <div className="flex flex-col">
                            <p className="text-base text-vyba-navy font-medium font-figtree">Visuales y pantallas</p>
                            <p className="text-sm font-figtree">El artista ha indicado que dispone de equipo de iluminación propio</p>
                        </div>
                        <Monitor className="w-7 h-7" />
                    </div>
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2 gap-2">
                        <div className="flex flex-col">
                            <p className="text-base text-vyba-navy font-medium font-figtree">Técnico de sonido</p>
                            <p className="text-sm font-figtree">El artista ha indicado que dispone de equipo de iluminación propio</p>
                        </div>
                        <Speaker className="w-7 h-7" />
                    </div>
                </div>
                <p className="font-figtree text-base mt-4 mb-4">Se requiere:</p>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2">
                        <div className="flex flex-col">
                            <p className="text-base text-vyba-navy font-medium font-figtree">Espacio mínimo en escenario</p>
                            <p className="text-sm font-figtree">El espacio mínimo en escenario se concretará directamente con el artista</p>
                        </div>
                        <LandPlot className="w-7 h-7" />
                    </div>
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2 gap-2">
                        <div className="flex flex-col">
                            <p className="text-base text-vyba-navy font-medium font-figtree">Lo especificado en el rider técnico</p>
                            <p className="text-sm font-figtree">La conexión eléctrica especial hace referencia a la corriente mayor a 220V</p>
                        </div>
                        <File className="w-7 h-7" />
                    </div>
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2 gap-2">
                        <div className="flex flex-col">
                            <p className="text-base text-vyba-navy font-medium font-figtree">Lo especificado en el rider hospitalário</p>
                            <p className="text-sm font-figtree">El artista ha indicado que dispone de equipo de iluminación propio</p>
                        </div>
                        <Wine className="w-7 h-7" />
                    </div>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <p className="font-figtree text-base my-4">Tiempos:</p>
                    <HoverCard openDelay={0} closeDelay={0}>
                        <HoverCardTrigger asChild>
                            <p className="text-xs text-vyba-navy font-medium font-figtree">Sobre los tiempos</p>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex flex-col gap-2">
                                <p className="text-base font-medium font-figtree text-white">Tiempos</p>
                                <p className="text-sm font-figtree text-white">El número de minutos indicado es una media entre las diferentes magnitudes de eventos que se suelen ofrecer por el artista. Este tiempo puede variar en función de las necesidades específicas del artista y del evento.</p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>
                <div className="grid grid-cols-2 gap-4">                    
                    <div className="flex flex-row bg-white rounded-2xl overflow-hidden items-center my-4">
                        <div className="flex flex-col p-4 space-y-2">
                            <Badge variant="default" className="bg-vyba-gray text-black flex items-center gap-2 w-fit">
                                <Hourglass className="w-5 h-5" />
                                <p className="text-xs text-vyba-navy font-medium font-figtree">Tiempo de montaje</p>
                            </Badge>
                            <p className="text-base font-figtree p-2 bg-white rounded-md">Menos de 30 minutos</p>
                        </div>
                    </div> 
                    <div className="flex flex-row bg-white rounded-2xl overflow-hidden items-center my-4">
                        <div className="flex flex-col p-4 space-y-2">
                            <Badge variant="default" className="bg-vyba-gray text-black flex items-center gap-2 w-fit">
                                <TestTube className="w-5 h-5" />
                                <p className="text-xs text-vyba-navy font-medium font-figtree">Prueba de sonido</p>
                            </Badge>
                            <p className="text-base font-figtree p-2 bg-white rounded-md">Menos de 30 minutos</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="bg-vyba-gray rounded-2xl p-6">
                <h3 className="text-lg font-medium font-figtree">Transporte</h3>
                <div className="grid grid-cols-5 bg-white rounded-2xl overflow-hidden items-center my-4">
                    <div className="col-span-2 relative h-44">
                        <img src="/lovable-uploads/scaled.png" alt="Transporte" className="w-full h-full object-cover" />
                        <div className="bg-gradient-to-l from-white to-transparent w-full h-full absolute top-0 left-0"></div>
                    </div>
                    <div className="col-span-3 flex flex-col p-6 space-y-2">
                        <Badge variant="default" className="bg-vyba-gray text-black flex items-center gap-2 w-fit">
                            <LocateFixed className="w-5 h-5" />
                            <p className="text-xs text-vyba-navy font-medium font-figtree">Rango de transporte</p>
                        </Badge>
                        <p className="text-base font-figtree">El artista ha indicado se desplaza a un máximo de 100km de distancia</p>
                        <HoverCard openDelay={0} closeDelay={0}>
                            <HoverCardTrigger asChild>
                                <p className="text-xs text-vyba-navy font-medium font-figtree">Ver más sobre el rango de transporte</p>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="flex flex-col gap-2">
                                    <p className="text-base font-medium font-figtree text-white">Rango de transporte</p>
                                    <p className="text-sm font-figtree text-white">El rango de transporte es una aproximación de la distancia que el artista está dispuesto a desplazarse para realizar el evento. Este rango puede variar en función de las necesidades específicas del artista y del evento.</p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
                <p className="font-figtree text-base mt-4 mb-4">Se requiere:</p>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2">
                        <p className="text-base text-vyba-navy font-medium font-figtree">Espacio de carga y descarga</p>
                        <Truck className="w-7 h-7" />
                    </div>
                    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-2">
                        <div className="flex flex-col space-y-2">
                            <p className="text-base text-vyba-navy font-medium font-figtree">Accesos especiales</p>
                            <div className="flex flex-row gap-2">
                                <Badge variant="default" className="bg-white text-black w-fit">
                                    <p className="text-xs text-vyba-navy font-medium font-figtree">Rampa</p>
                                </Badge>
                                <Badge variant="default" className="bg-white text-black w-fit">
                                    <p className="text-xs text-vyba-navy font-medium font-figtree">Montacargas</p>
                                </Badge>
                                <Badge variant="default" className="bg-white text-black w-fit">
                                    <p className="text-xs text-vyba-navy font-medium font-figtree">Cercanía al escenario</p>
                                </Badge>
                            </div>
                        </div>
                        <Forklift className="w-7 h-7" />
                    </div>
                </div>
            </div>
        </div>
        <h2 className="text-3xl font-bold font-figtree mt-8 mb-4">Formación e integrantes</h2>
      </div>
    </div>
  );
};

export default ArtistPage;
