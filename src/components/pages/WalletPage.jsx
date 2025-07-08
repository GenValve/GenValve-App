import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Send, Download, History, Plus, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { useUserData } from '@/hooks/useUserData';
import { toast } from '@/components/ui/use-toast';

const WalletPage = () => {
  const { walletAddress, ethBalance, isBalanceLoading, refreshBalance } = useWallet();
  const { gvBalance, transactions, updateGVBalance } = useUserData();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied! 📋",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleBuyGV = () => {};

  const handleClaimRewards = () => {
    const rewardAmount = 50;
    updateGVBalance(gvBalance + rewardAmount);
    toast({
      title: "Rewards Claimed! 🎉",
      description: `You received ${rewardAmount} $GVE tokens!`,
    });
  };

  const handleSendTokens = () => {};

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
        return '🛒';
      case 'reward':
        return '🎁';
      case 'send':
        return '📤';
      case 'receive':
        return '📥';
      case 'claim':
        return '💰';
      default:
        return '💰';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-4">
          <div className="rgb-border p-3 rounded-xl">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-white">Wallet</h1>
            <p className="text-gray-400 text-lg">Manage your digital assets and transactions</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-strong border-gray-800 rgb-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-orbitron text-xl font-semibold text-white mb-2">
                  Connected Wallet
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-gray-300">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white p-1"
                    onClick={() => window.open(`https://etherscan.io/address/${walletAddress}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GVE</span>
                </div>
                <span className="text-white">GenValve Token</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                $GVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">
                {gvBalance.toFixed(2)} $GVE
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleBuyGV}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buy $GVE
                </Button>
                <Button
                  onClick={handleSendTokens}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Ξ</span>
                </div>
                <span className="text-white">Ethereum</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={refreshBalance}
                  disabled={isBalanceLoading}
                  className="text-gray-400 hover:text-white h-6 w-6"
                >
                  <RefreshCw className={`w-4 h-4 ${isBalanceLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  ETH
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">
                {isBalanceLoading ? (
                  <span className="text-2xl">Loading...</span>
                ) : ethBalance !== null ? (
                  `${parseFloat(ethBalance).toFixed(4)} ETH`
                ) : (
                  'N/A'
                )}
              </div>
              <div className="text-gray-400 text-sm">
                {ethBalance !== null ? `≈ ${(parseFloat(ethBalance) * 2000).toFixed(2)} USD` : '...'}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Button
          onClick={handleClaimRewards}
          className="h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          <Download className="w-5 h-5 mr-2" />
          Claim Rewards
        </Button>
        
        <Button
          onClick={handleBuyGV}
          variant="outline"
          className="h-16 border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-5 h-5 mr-2" />
          Buy More $GVE
        </Button>
        
        <Button
          onClick={handleSendTokens}
          variant="outline"
          className="h-16 border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Send className="w-5 h-5 mr-2" />
          Send Tokens
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-orbitron text-2xl font-bold text-white">Transaction History</h2>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
            onClick={() => {}}
          >
            <History className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        <Card className="glass border-gray-800">
          <CardContent className="p-0">
            {transactions.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">
                            {transaction.description}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {transaction.timestamp}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} $GVE
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-green-500/20 text-green-300 border-green-500/30"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">No transactions yet</div>
                <p className="text-gray-500 text-sm">
                  Your transaction history will appear here once you start using GenValve.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WalletPage;