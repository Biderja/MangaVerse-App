
import React from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ mangaTitle, chapter }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto bg-black bg-opacity-20 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-20 h-20 flex items-center justify-center">
            <img 
              src="https://horizons-cdn.hostinger.com/6f8622e0-c999-462d-9452-e6d8d488c812/582641c3b3f27e59f27df53c8fb31cfe.png" 
              alt="Biderja Logo" 
              className="h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-display text-white text-lg font-bold">{mangaTitle}</h1>
            <p className="text-gray-300 text-xs">{chapter}</p>
          </div>
        </div>
        <button 
          id="settingsBtn" 
          onClick={handleSettingsClick}
          className="p-2 rounded-lg bg-white bg-opacity-10 text-white hover:bg-opacity-20 transition-all focus:outline-none focus:ring-2 focus:ring-coral-500"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
