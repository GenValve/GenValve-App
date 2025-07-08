import React from 'react';
import { motion } from 'framer-motion';

const MobileNav = ({ navItems, activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-gray-800">
      <div className="flex items-center justify-around p-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                  : 'text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;