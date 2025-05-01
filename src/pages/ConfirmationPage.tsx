
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationScreen from '@/components/onboarding/ConfirmationScreen';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useState<any>(null);

  useEffect(() => {
    // Verificar si el onboarding está completo
    const storedData = localStorage.getItem('onboardingData');
    if (!storedData) {
      // Si no hay datos de onboarding, redirigir al inicio del proceso
      navigate('/artist-onboarding');
      return;
    }
    
    try {
      const parsedData = JSON.parse(storedData);
      console.log("Onboarding data loaded:", parsedData);
      setOnboardingData(parsedData);
    } catch (error) {
      console.error("Error parsing onboarding data:", error);
      navigate('/artist-onboarding');
    }
  }, [navigate]);

  if (!onboardingData) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen">
      <ConfirmationScreen onboardingData={onboardingData} />
    </div>
  );
};

export default ConfirmationPage;
