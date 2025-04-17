
import React from 'react';
import StepsNavbar from '@/components/onboarding/StepsNavbar';
import { PageTransition } from '@/components/ui/page-transition';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentGroup: number;
  totalGroups: number;
  currentStepInGroup: number;
  totalStepsInGroup: number;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  canGoNext: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentGroup,
  totalGroups,
  currentStepInGroup,
  totalStepsInGroup,
  onBack,
  onNext,
  onCancel,
  canGoNext = true
}) => {
  const isMobile = useIsMobile();
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
        <StepsNavbar 
          currentGroup={currentGroup} 
          totalGroups={totalGroups} 
          currentStepInGroup={currentStepInGroup} 
          totalStepsInGroup={totalStepsInGroup} 
          onBack={onBack} 
          onNext={onNext} 
          onCancel={onCancel} 
          canGoNext={canGoNext} 
        />
        
        <main className="flex-1 flex min-h-0 w-full px-4 sm:px-6 lg:px-8 py-8 mt-24">
          <motion.div 
            className="w-full flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
};

export { OnboardingLayout };
