import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Bell, Shield, User, LogOut, Palette, LifeBuoy, Globe, Twitter, Send, Github, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { walletAddress, disconnectWallet } = useWallet();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('cyberpunk');

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    toast({
      title: notifications ? "Notifications Disabled" : "Notifications Enabled",
      description: `Push notifications have been ${notifications ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleExportData = () => {};

  const handleDeleteAccount = () => {};

  const themes = [
    { id: 'cyberpunk', name: 'Cyberpunk', color: 'from-purple-500 to-pink-500' },
    { id: 'neon', name: 'Neon Blue', color: 'from-blue-500 to-cyan-500' },
    { id: 'matrix', name: 'Matrix Green', color: 'from-green-500 to-emerald-500' },
    { id: 'sunset', name: 'Sunset Orange', color: 'from-orange-500 to-red-500' }
  ];

  const supportLinks = [
    { name: 'Website', icon: Globe, href: 'https://genvalve.xyz' },
    { name: 'Twitter/X', icon: Twitter, href: 'https://x.com/GenValve_Hub' },
    { name: 'Discord', icon: MessageSquare, href: 'https://discord.gg/TFaT4gjr' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/GenValve' },
    { name: 'Telegram', icon: Send, href: null },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-4">
          <div className="rgb-border p-3 rounded-xl">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 text-lg">Customize your GenValve experience</p>
          </div>
        </div>
      </motion.div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-strong border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5" />
              <span>Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Wallet Address</h3>
                <p className="text-gray-400 font-mono text-sm">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Connected
              </Badge>
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
                onClick={handleExportData}
              >
                Export Data
              </Button>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="border-red-600 text-red-400 hover:text-white hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Palette className="w-5 h-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Dark Mode</h3>
                <p className="text-gray-400 text-sm">Toggle between light and dark themes</p>
              </div>
              <Button
                onClick={handleThemeToggle}
                variant="outline"
                className={`border-gray-600 ${darkMode ? 'bg-white/10 text-white' : 'text-gray-400'} hover:text-white hover:bg-white/10`}
              >
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>

            {/* Theme Selection */}
            <div>
              <h3 className="text-white font-medium mb-4">Color Theme</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => handleThemeChange(themeOption.id)}
                    className={`p-4 rounded-lg border transition-all ${
                      theme === themeOption.id 
                        ? 'border-white bg-white/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-full h-8 bg-gradient-to-r ${themeOption.color} rounded mb-2`}></div>
                    <span className="text-white text-sm">{themeOption.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Push Notifications</h3>
                <p className="text-gray-400 text-sm">Receive notifications about achievements, rewards, and updates</p>
              </div>
              <Button
                onClick={handleNotificationToggle}
                variant="outline"
                className={`border-gray-600 ${notifications ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'text-gray-400'} hover:text-white hover:bg-white/10`}
              >
                {notifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Game Updates', description: 'New games and updates in your library' },
                { label: 'Achievement Unlocks', description: 'When you unlock new achievements' },
                { label: 'Reward Claims', description: 'Available rewards and token claims' },
                { label: 'Market Deals', description: 'Special offers and discounts in the market' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-white text-sm font-medium">{item.label}</h4>
                    <p className="text-gray-400 text-xs">{item.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => {}}
                  >
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Security Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Shield className="w-5 h-5" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { label: 'Two-Factor Authentication', description: 'Add an extra layer of security', action: 'Enable' },
                { label: 'Data Privacy', description: 'Control how your data is used', action: 'Manage' },
                { label: 'Transaction History', description: 'Download your transaction records', action: 'Export' },
                { label: 'Account Deletion', description: 'Permanently delete your account', action: 'Delete', danger: true }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                  <div>
                    <h4 className="text-white font-medium">{item.label}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    className={`${item.danger 
                      ? 'border-red-600 text-red-400 hover:bg-red-500/10' 
                      : 'border-gray-600 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={item.danger ? handleDeleteAccount : () => {}}
                  >
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Support & Community Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <LifeBuoy className="w-5 h-5" />
              <span>Support & Community</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {supportLinks.map((link) => (
                <div key={link.name} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <link.icon className="w-5 h-5 text-gray-400" />
                    <h4 className="text-white font-medium">{link.name}</h4>
                  </div>
                  {link.href ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white hover:bg-white/10">
                        Join
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white hover:bg-white/10"
                      onClick={() => toast({ title: "Coming Soon!", description: "The Telegram link will be available soon." })}
                    >
                      Join
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="glass border-gray-800">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">GV</span>
              </div>
              <div>
                <h3 className="font-orbitron text-xl font-bold text-white">GenValve v1.0.0</h3>
                <p className="text-gray-400">The future of Web3 gaming</p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => {}}
                >
                  Terms of Service
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => {}}
                >
                  Privacy Policy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;