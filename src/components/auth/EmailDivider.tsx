
import React from 'react';
import { motion } from "framer-motion";
import { itemVariants } from './animation-variants';

const EmailDivider: React.FC = () => {
  return (
    <motion.div variants={itemVariants} className="relative flex items-center">
      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase font-medium">O CONTINÚA CON EMAIL</span>
      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
    </motion.div>
  );
};

export default EmailDivider;
