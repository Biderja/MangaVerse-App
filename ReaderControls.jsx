
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ReaderControls = ({ onNext, onPrev, currentPage, totalPages }) => {
  if (totalPages === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      className="controls-overlay fixed bottom-[100px] left-1/2 -translate-x-1/2 z-[60]"
    >
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Button
          onClick={onPrev}
          disabled={currentPage === 0}
          className="control-btn bg-coral text-white rounded-full w-24 h-12 shadow-lg hover:bg-coral/80 disabled:opacity-50"
          style={{'--accent-coral': '#e85a4f'}}
        >
          <ArrowRight />
          <span className="mr-2">السابق</span>
        </Button>
        <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-md">
          {currentPage + 1} / {totalPages}
        </div>
        <Button
          onClick={onNext}
          disabled={currentPage >= totalPages - 1}
          className="control-btn bg-coral text-white rounded-full w-24 h-12 shadow-lg hover:bg-coral/80 disabled:opacity-50"
          style={{'--accent-coral': '#e85a4f'}}
        >
          <span className="ml-2">التالي</span>
          <ArrowLeft />
        </Button>
      </div>
    </motion.div>
  );
};

export default ReaderControls;
