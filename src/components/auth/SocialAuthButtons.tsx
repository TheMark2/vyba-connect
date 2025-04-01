
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { itemVariants } from './animation-variants';
import { useIsMobile } from '@/hooks/use-mobile';

interface SocialAuthButtonsProps {
  onSocialLogin: (provider: string) => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ onSocialLogin }) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className={`${isMobile ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-2 gap-4'}`}>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin("Google")}
          className="bg-white dark:bg-black dark:border-gray-700 rounded-xl h-12 flex items-center gap-2 justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.3222 10.2272C19.3222 9.51773 19.2622 8.83636 19.1511 8.17273H10.2V11.8727H15.3133C15.0789 13.0909 14.3897 14.1409 13.3567 14.8364V17.2364H16.3833C18.1956 15.5409 19.3222 13.1272 19.3222 10.2272Z" fill="#4285F4"/>
            <path d="M10.2 19.9999C12.7 19.9999 14.7889 19.0999 16.3833 17.2363L13.3567 14.8363C12.4944 15.4272 11.4033 15.7726 10.2 15.7726C7.663 15.7726 5.52967 14.0772 4.75556 11.7726H1.63889V14.2499C3.22222 17.5954 6.47778 19.9999 10.2 19.9999Z" fill="#34A853"/>
            <path d="M4.75556 11.7727C4.55556 11.1818 4.44444 10.5499 4.44444 9.90001C4.44444 9.25001 4.55556 8.61817 4.75556 8.02726V5.54999H1.63889C0.979444 6.85908 0.6 8.33636 0.6 9.90001C0.6 11.4636 0.979444 12.9409 1.63889 14.25L4.75556 11.7727Z" fill="#FBBC05"/>
            <path d="M10.2 4.0272C11.6022 4.0272 12.8567 4.52726 13.8333 5.45908L16.5111 2.78181C14.7889 1.17272 12.7 0.0999908 10.2 0.0999908C6.47778 0.0999908 3.22222 2.50454 1.63889 5.84999L4.75556 8.32726C5.52967 6.02272 7.663 4.0272 10.2 4.0272Z" fill="#EA4335"/>
          </svg>
          <span>Continuar con Google</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin("Apple")}
          className="bg-white dark:bg-black dark:border-gray-700 rounded-xl h-12 flex items-center gap-2 justify-center"
        >
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.1626 10.4431C14.1506 8.86214 14.913 7.64908 16.4557 6.72961C15.6203 5.53617 14.3603 4.87791 12.7004 4.73889C11.133 4.60399 9.43619 5.6365 8.82124 5.6365C8.17548 5.6365 6.64374 4.78239 5.44121 4.78239C3.0587 4.82177 0.5 6.70004 0.5 10.5228C0.5 11.6779 0.703981 12.8726 1.11194 14.1051C1.65845 15.7385 3.57203 19.9577 5.57452 19.9015C6.59167 19.877 7.31706 19.1621 8.63586 19.1621C9.91964 19.1621 10.5911 19.9015 11.7357 19.9015C13.744 19.877 15.4684 16.031 15.9909 14.3935C13.3121 13.1809 14.1626 10.4955 14.1626 10.4431ZM11.6037 3.20571C12.9145 1.65517 12.7664 0.2 12.7244 0C11.5319 0.0630687 10.1372 0.871585 9.39787 1.86487C8.60329 2.90182 8.15255 4.13867 8.2426 5.32799C9.52227 5.42482 10.7014 4.76243 11.6037 3.20571Z" fill="#000000"/>
          </svg>
          <span>Continuar con Apple</span>
        </Button>
      </div>
      
      <div className={isMobile ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-2 gap-4'}>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin("Facebook")}
          className="bg-white dark:bg-black dark:border-gray-700 rounded-xl h-12 flex items-center gap-2 justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.33334 11.5625 8.12416V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z" fill="#1877F2"/>
            <path d="M13.8926 12.8906L14.3359 10H11.5625V8.12416C11.5625 7.33334 11.95 6.5625 13.1922 6.5625H14.4531V4.10156C14.4531 4.10156 13.3084 3.90625 12.2146 3.90625C9.93047 3.90625 8.4375 5.29063 8.4375 7.79688V10H5.89844V12.8906H8.4375V19.8785C9.47287 20.0405 10.5271 20.0405 11.5625 19.8785V12.8906H13.8926Z" fill="white"/>
          </svg>
          <span>Continuar con Facebook</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin("Twitter")}
          className="bg-white dark:bg-black dark:border-gray-700 rounded-xl h-12 flex items-center gap-2 justify-center"
        >
          <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.4 1.80084C21.6 2.20084 20.6 2.50084 19.7 2.60084C20.7 2.10084 21.4 1.30084 21.8 0.200838C20.8 0.800838 19.8 1.10084 18.7 1.30084C17.8 0.400838 16.6 -0.099162 15.3 -0.099162C12.7 -0.099162 10.7 1.90084 10.7 4.40084C10.7 4.80084 10.7 5.10084 10.8 5.40084C6.9 5.20084 3.4 3.40084 1.1 0.600838C0.7 1.30084 0.5 2.00084 0.5 2.80084C0.5 4.30084 1.3 5.60084 2.5 6.40084C1.8 6.40084 1.1 6.20084 0.5 5.90084V6.00084C0.5 8.20084 2 10.1008 4 10.5008C3.6 10.6008 3.2 10.7008 2.8 10.7008C2.5 10.7008 2.3 10.7008 2 10.6008C2.5 12.4008 4.2 13.7008 6.1 13.7008C4.6 14.9008 2.8 15.6008 0.7 15.6008C0.3 15.6008 0 15.6008 -0.3 15.5008C1.7 16.8008 4 17.5008 6.4 17.5008C15.3 17.5008 20.1 10.8008 20.1 5.00084C20.1 4.80084 20.1 4.60084 20.1 4.40084C21.1 3.80084 21.9 3.00084 22.5 2.00084L22.4 1.80084Z" fill="#1D9BF0"/>
          </svg>
          <span>Continuar con Twitter</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default SocialAuthButtons;
