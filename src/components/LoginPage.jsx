import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Wallet, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const { connectWallet, isConnecting } = useWallet();
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "🚧 Email feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>GenValve - Connect Your Wallet | Web3 Gaming Hub</title>
        <meta name="description" content="Connect your Ethereum wallet to access GenValve, the ultimate Web3 gaming hub with exclusive games, achievements, and rewards." />
      </Helmet>
      
      <div className="min-h-screen rgb-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32 p-1 rounded-full rgb-gradient-bg shadow-lg">
                <div className="bg-black rounded-full w-full h-full flex items-center justify-center">
                  <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ff4eb9eb-53a5-44d9-8986-5b9d8d2bd4a7/201c43da4b6a5b48605a288c366b9111.png" alt="GenValve Logo" className="w-20 h-20" />
                </div>
              </div>
            </div>
            <h1 className="font-orbitron text-4xl font-bold text-white mb-2 tracking-wider">
              GenValve
            </h1>
            <p className="text-gray-300 text-lg">Web3 Gaming Hub</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-black rounded-2xl p-8 rgb-glow"
          >
            <div className="text-center mb-6">
              <h2 className="font-orbitron text-2xl font-semibold text-white mb-2">
                Connect Wallet
              </h2>
              <p className="text-gray-300">
                Access your gaming universe with Web3
              </p>
            </div>

            {/* Wallet Connect Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mb-6"
            >
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-xl rgb-glow-hover btn-glow transition-all duration-300"
              >
                <Wallet className="w-6 h-6 mr-3" />
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">or</span>
              </div>
            </div>

            {/* Email Option */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12 border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300"
              >
                Continue with Email
              </Button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-600">
              <p className="text-center text-gray-400 text-sm mb-4">
                What you'll get access to:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    🎮
                  </div>
                  <p className="text-gray-300">Game Library</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    🏆
                  </div>
                  <p className="text-gray-300">Achievements</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    💎
                  </div>
                  <p className="text-gray-300">$GV Tokens</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    ☁️
                  </div>
                  <p className="text-gray-300">Cloud Gaming</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-6"
          >
            <p className="text-gray-400 text-sm">
              Powered by Ethereum • Secured by Web3
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;