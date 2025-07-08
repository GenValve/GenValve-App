import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Library, 
  Cloud, 
  ShoppingBag, 
  Trophy, 
  Wallet, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import LibraryPage from '@/components/pages/LibraryPage';
import CloudGamingPage from '@/components/pages/CloudGamingPage';
import IndieMarketPage from '@/components/pages/IndieMarketPage';
import AchievementsPage from '@/components/pages/AchievementsPage';
import WalletPage from '@/components/pages/WalletPage';
import SettingsPage from '@/components/pages/SettingsPage';

const Dashboard = () => {
  const { walletAddress } = useWallet();
  const [activeTab, setActiveTab] = useState('library');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'library', label: 'Library', icon: Library },
    { id: 'cloud', label: 'Cloud Gaming', icon: Cloud },
    { id: 'market', label: 'Indie Market', icon: ShoppingBag },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case 'library':
        return <LibraryPage />;
      case 'cloud':
        return <CloudGamingPage />;
      case 'market':
        return <IndieMarketPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LibraryPage />;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <>
      <Helmet>
        <title>GenValve Dashboard - Web3 Gaming Hub</title>
        <meta name="description" content="Access your Web3 gaming dashboard with game library, achievements, wallet, and more on GenValve." />
      </Helmet>

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 rgb-gradient-bg opacity-20"></div>
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ff4eb9eb-53a5-44d9-8986-5b9d8d2bd4a7/201c43da4b6a5b48605a288c366b9111.png" alt="GenValve Logo" className="w-10 h-10" />
              <span className="font-orbitron text-xl font-bold">GenValve</span>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            navItems={navItems} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            walletAddress={walletAddress}
          />
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-80 h-full glass-strong border-r border-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar 
                  navItems={navItems} 
                  activeTab={activeTab} 
                  setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  walletAddress={walletAddress}
                  isMobile={true}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="lg:ml-80 pt-20 lg:pt-0 pb-20 lg:pb-0 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="min-h-screen"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
          <MobileNav 
            navItems={navItems} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;