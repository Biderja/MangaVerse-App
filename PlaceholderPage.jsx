
import React from 'react';
import { motion } from 'framer-motion';

const PlaceholderPage = ({ title, icon: Icon }) => {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center min-h-screen text-center px-4"
    >
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-full mb-6">
        <Icon className="w-16 h-16 text-coral" />
      </div>
      <h1 className="text-3xl font-display font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-400 max-w-sm">
        هذه الصفحة قيد الإنشاء حالياً. سيتم تفعيل هذه الميزة قريباً لتوفير أفضل تجربة لك!
      </p>
    </motion.div>
  );
};

export default PlaceholderPage;
