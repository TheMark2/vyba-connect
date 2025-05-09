import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Flag, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const ArtistPage = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(true);
  const [artist, setArtist] = React.useState<any>(null);

  // Simular carga de datos
  React.useEffect(() => {
    const fetchArtistData = async () => {
      try {
        // Aquí iría la llamada a la API
        // Por ahora usamos datos de ejemplo
        setTimeout(() => {
          setArtist({
            id: id,
            name: 'DJ Marcos',
            type: 'DJ',
            description: 'DJ con amplia experiencia en eventos y bodas',
            images: ['/images/dj1.webp', '/images/dj4.webp', '/images/dj5.webp'],
            rating: 4.8,
            priceRange: '300€',
            location: 'Madrid',
            genres: ['House', 'Techno', 'Disco'],
            experience: '10 años',
            events: ['Bodas', 'Fiestas privadas', 'Eventos corporativos']
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar datos del artista:', error);
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Artista no encontrado</h1>
          <p className="text-vyba-tertiary">El artista que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      {/* Banner principal */}
      <div className="relative aspect-[7/1] w-full overflow-hidden mb-8 mask-b-from-20% mask-b-to-80%">
        <img 
          src={artist.images[0]} 
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Botones de acción */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="secondary" 
            size="icon"
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50"
          >
            <Heart className="h-5 w-5 text-white" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon"
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50"
          >
            <Share2 className="h-5 w-5 text-white" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon"
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50"
          >
            <Flag className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Información del artista */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <Badge className="mb-4 bg-white/30 backdrop-blur-xl text-white">
            {artist.type}
          </Badge>
          <h1 className="text-4xl font-semibold text-white mb-2">{artist.name}</h1>
          <p className="text-white/90 text-lg">{artist.description}</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Información principal */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Sobre el artista</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-vyba-tertiary">Ubicación:</span>
                  <span>{artist.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-vyba-tertiary">Experiencia:</span>
                  <span>{artist.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-vyba-tertiary">Géneros:</span>
                  <div className="flex gap-2">
                    {artist.genres.map((genre: string) => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Tipos de eventos</h2>
              <div className="flex flex-wrap gap-2">
                {artist.events.map((event: string) => (
                  <Badge key={event} variant="secondary">{event}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Contacto y precio */}
        <div className="space-y-8">
          <Card className="border-none shadow-none">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-vyba-tertiary">Precio desde</span>
                  <span className="text-2xl font-semibold">{artist.priceRange}</span>
                </div>
                <Button className="w-full" size="lg">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contactar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage; 