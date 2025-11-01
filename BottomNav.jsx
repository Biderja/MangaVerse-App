
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Library, Heart, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'القارئ' },
  { to: '/library', icon: Library, label: 'المكتبة' },
  { to: '/favorites', icon: Heart, label: 'المفضلة' },
  { to: '/settings', icon: Settings, label: 'الإعدادات' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-30 backdrop-blur-xl border-t border-white/10 z-[100]">
      <div className="nav-grid grid grid-cols-4 gap-2 max-w-md mx-auto px-5 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-item flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 text-gray-400 hover:bg-coral/10 hover:text-coral ${
                isActive ? 'text-coral bg-coral/20' : ''
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
