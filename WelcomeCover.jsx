
import React from 'react';

const WelcomeCover = () => {
  return (
    <div className="relative w-full h-[65vh] md:h-[70vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-2 border-white/10 bg-white flex items-center justify-center">
      <img 
        src="https://horizons-cdn.hostinger.com/6f8622e0-c999-462d-9452-e6d8d488c812/9ba88460d325b1e8c25f35d9072bd686.png"
        alt="Biderja Welcome Cover"
        className="w-full h-full object-contain p-4"
      />
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-gray-800 font-bold text-lg">في انتظار اختيارك للمانجا...</p>
      </div>
    </div>
  );
};

export default WelcomeCover;
