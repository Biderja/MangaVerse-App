
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50" style={{ backgroundColor: 'rgba(232, 90, 79, 0.3)' }}>
      <motion.div 
        className="h-full" 
        style={{ backgroundColor: 'var(--accent-coral)' }}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default ProgressBar;
