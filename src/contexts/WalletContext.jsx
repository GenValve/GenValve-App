import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/components/ui/use-toast';
import { createUser, getUserByWallet } from '@/lib/supabase';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  const fetchBalance = useCallback(async (address, ethProvider) => {
    if (!ethProvider || !address) return;
    setIsBalanceLoading(true);
    try {
      const balance = await ethProvider.getBalance(address);
      setEthBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setEthBalance(null);
      toast({
        title: "Balance Error",
        description: "Could not fetch wallet balance.",
        variant: "destructive",
      });
    } finally {
      setIsBalanceLoading(false);
    }
  }, []);

  const handleUserLogin = useCallback(async (address, ethProvider) => {
    try {
      let { data: userData, error } = await getUserByWallet(address);
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user:', error);
        return;
      }
      
      if (!userData) {
        const { data: newUser, error: createError } = await createUser(address);
        if (createError) {
          console.error('Error creating user:', createError);
          return;
        }
        userData = newUser;
      }
      
      setUser(userData);
      await fetchBalance(address, ethProvider);
    } catch (error) {
      console.error('Error handling user login:', error);
    }
  }, [fetchBalance]);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const ethProvider = new ethers.BrowserProvider(window.ethereum);
            const ethSigner = await ethProvider.getSigner();
            setProvider(ethProvider);
            setSigner(ethSigner);
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            
            localStorage.setItem('walletAddress', accounts[0]);
            
            await handleUserLogin(accounts[0], ethProvider);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, [handleUserLogin]);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet!",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const ethSigner = await ethProvider.getSigner();
        
        setProvider(ethProvider);
        setSigner(ethSigner);
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        
        localStorage.setItem('walletAddress', accounts[0]);
        
        await handleUserLogin(accounts[0], ethProvider);
        
        toast({
          title: "Wallet Connected! 🎉",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setProvider(null);
    setSigner(null);
    setUser(null);
    setEthBalance(null);
    localStorage.removeItem('walletAddress');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && provider) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== walletAddress) {
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
          await handleUserLogin(accounts[0], provider);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [walletAddress, provider, handleUserLogin]);

  const value = {
    isConnected,
    walletAddress,
    provider,
    signer,
    isConnecting,
    user,
    ethBalance,
    isBalanceLoading,
    refreshBalance: () => fetchBalance(walletAddress, provider),
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};