
import React from 'react';
import { motion } from "framer-motion";
import { itemVariants } from './animation-variants';
import { useIsMobile } from "@/hooks/use-mobile";

const EmailDivider: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <motion.div variants={itemVariants} className="relative flex items-center">
      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      <span className={`flex-shrink mx-4 text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} uppercase font-medium`}>
        Email
      </span>
      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
    </motion.div>
  );
};

export default EmailDivider;
