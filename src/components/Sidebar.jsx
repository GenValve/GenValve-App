import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';

const Sidebar = ({ navItems, activeTab, setActiveTab, walletAddress, isMobile = false }) => {
  const { disconnectWallet } = useWallet();

  return (
    <div className={`${isMobile ? 'h-full' : 'fixed left-0 top-0 h-screen'} w-80 glass-strong border-r border-gray-800 flex flex-col z-30`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ff4eb9eb-53a5-44d9-8986-5b9d8d2bd4a7/201c43da4b6a5b48605a288c366b9111.png" alt="GenValve Logo" className="w-12 h-12" />
          <div>
            <span className="font-orbitron text-2xl font-bold text-white">GenValve</span>
            <p className="text-gray-400 text-sm">Web3 Gaming Hub</p>
          </div>
        </div>
        
        {/* Wallet Info */}
        <div className="glass rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Connected Wallet</p>
          <p className="text-white font-mono text-sm">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'rgb-border text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Button
          onClick={disconnectWallet}
          variant="outline"
          className="w-full border-gray-600 text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;