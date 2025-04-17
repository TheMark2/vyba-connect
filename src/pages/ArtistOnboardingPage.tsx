
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileArtistOnboardingPage } from './MobileArtistOnboardingPage';
import { DesktopArtistOnboardingPage } from './DesktopArtistOnboardingPage';
import { PageTransition } from '@/components/ui/page-transition';

/**
 * Página de onboarding para artistas que decide qué versión mostrar según el dispositivo
 * Esta página actúa como un selector inteligente que carga la versión adecuada basada en el tamaño de pantalla
 * @returns Componente de React
 */
const ArtistOnboardingPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <PageTransition>
      {isMobile ? <MobileArtistOnboardingPage /> : <DesktopArtistOnboardingPage />}
    </PageTransition>
  );
};

export default ArtistOnboardingPage;
