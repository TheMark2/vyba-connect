
import React from 'react';

const EmailDivider: React.FC = () => {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      <span className="flex-shrink mx-4 text-gray-500 text-sm uppercase">o</span>
      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
    </div>
  );
};

export default EmailDivider;
