
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationScreen from '@/components/onboarding/ConfirmationScreen';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el onboarding está completo
    const onboardingData = localStorage.getItem('onboardingData');
    if (!onboardingData) {
      // Si no hay datos de onboarding, redirigir al inicio del proceso
      navigate('/artist-onboarding');
    }
  }, [navigate]);

  // Obtener los datos de onboarding desde localStorage
  const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');

  return (
    <div className="min-h-screen">
      <ConfirmationScreen onboardingData={onboardingData} />
    </div>
  );
};

export default ConfirmationPage; 
