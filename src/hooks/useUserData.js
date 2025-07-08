import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import {
  getUserGames,
  getAllGames,
  getUserAchievements,
  getAllAchievements,
  getUserBalance,
  updateUserBalance,
  purchaseGame as supabasePurchaseGame,
  unlockAchievement as supabaseUnlockAchievement,
  claimAchievementReward,
  getUserTransactions,
  updateGameProgress as supabaseUpdateGameProgress
} from '@/lib/supabase';

export const useUserData = () => {
  const { user, isConnected } = useWallet();
  const [userGames, setUserGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [gvBalance, setGvBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && user) {
      loadUserData();
    }
  }, [isConnected, user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const [
        gamesResult,
        allGamesResult,
        achievementsResult,
        allAchievementsResult,
        balanceResult,
        transactionsResult
      ] = await Promise.all([
        getUserGames(user.id),
        getAllGames(),
        getUserAchievements(user.id),
        getAllAchievements(),
        getUserBalance(user.id),
        getUserTransactions(user.id, 10)
      ]);

      if (gamesResult.data && gamesResult.data.length > 0) {
        const formattedGames = gamesResult.data.map(userGame => ({
          id: userGame.games.id,
          title: userGame.games.title,
          description: userGame.games.description,
          image: userGame.games.image_url,
          price: parseFloat(userGame.games.price),
          progress: userGame.progress,
          status: userGame.status,
          category: userGame.games.category,
          developer: userGame.games.developer
        }));
        setUserGames(formattedGames);
      } else {
        setUserGames([]);
      }

      if (allGamesResult.data && allGamesResult.data.length > 0) {
        const formattedAllGames = allGamesResult.data.map(game => ({
          id: game.id,
          title: game.title,
          description: game.description,
          image: game.image_url,
          price: parseFloat(game.price),
          category: game.category,
          developer: game.developer,
          status: 'locked',
          progress: 0
        }));
        setAllGames(formattedAllGames);
      } else {
        setAllGames([]);
      }

      if (achievementsResult.data && allAchievementsResult.data) {
        const userAchievementIds = new Set(achievementsResult.data.map(ua => ua.achievement_id));
        
        const formattedAchievements = allAchievementsResult.data.map(achievement => {
          const userAchievement = achievementsResult.data.find(ua => ua.achievement_id === achievement.id);
          return {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            rarity: achievement.rarity,
            reward_amount: parseFloat(achievement.reward_amount),
            unlocked: userAchievementIds.has(achievement.id),
            claimed: userAchievement?.claimed || false
          };
        });
        setUserAchievements(formattedAchievements);
      } else {
        setUserAchievements([]);
      }

      if (balanceResult.data) {
        const currentBalance = parseFloat(balanceResult.data.gv_balance || 0);
        if (currentBalance === 1250.75) {
          await updateUserBalance(user.id, 0);
          setGvBalance(0);
        } else {
          setGvBalance(currentBalance);
        }
      } else {
        await updateUserBalance(user.id, 0);
        setGvBalance(0);
      }

      if (transactionsResult.data && transactionsResult.data.length > 0) {
        const formattedTransactions = transactionsResult.data.map(transaction => ({
          id: transaction.id,
          type: transaction.type,
          description: transaction.description || getTransactionDescription(transaction),
          amount: parseFloat(transaction.amount),
          timestamp: new Date(transaction.created_at).toLocaleString(),
          status: transaction.status
        }));
        setTransactions(formattedTransactions);
      } else {
        setTransactions([]);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionDescription = (transaction) => {
    if (transaction.games?.title) {
      return `Purchased ${transaction.games.title}`;
    }
    if (transaction.achievements?.title) {
      return `${transaction.achievements.title} reward`;
    }
    return transaction.description || 'Transaction';
  };

  const updateGameProgress = async (gameId, progress) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabaseUpdateGameProgress(user.id, gameId, progress);
      if (!error) {
        setUserGames(prev => prev.map(game => 
          game.id === gameId ? { ...game, progress, status: progress === 100 ? 'completed' : 'playing' } : game
        ));
      }
    } catch (error) {
      console.error('Error updating game progress:', error);
    }
  };

  const unlockAchievement = async (achievementId) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabaseUnlockAchievement(user.id, achievementId);
      if (!error) {
        setUserAchievements(prev => prev.map(achievement =>
          achievement.id === achievementId ? { ...achievement, unlocked: true } : achievement
        ));
        await loadUserData();
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const claimReward = async (achievementId) => {
    if (!user) return false;
    
    try {
      const { data, error } = await claimAchievementReward(user.id, achievementId);
      if (!error && data) {
        setGvBalance(parseFloat(data.balance.gv_balance));
        setUserAchievements(prev => prev.map(achievement =>
          achievement.id === achievementId ? { ...achievement, claimed: true } : achievement
        ));
        await loadUserData();
        return true;
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
    return false;
  };

  const updateGVBalance = async (newBalance) => {
    if (!user) return;
    
    try {
      const { data, error } = await updateUserBalance(user.id, newBalance);
      if (!error) {
        setGvBalance(newBalance);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const purchaseGame = async (gameId) => {
    if (!user) return false;
    
    const game = allGames.find(g => g.id === gameId);
    if (!game || gvBalance < game.price) {
      return false;
    }
    
    try {
      const { data, error } = await supabasePurchaseGame(user.id, gameId, game.price);
      if (!error && data) {
        setGvBalance(parseFloat(data.balance.gv_balance));
        await loadUserData();
        return true;
      }
    } catch (error) {
      console.error('Error purchasing game:', error);
    }
    return false;
  };

  const mockGames = allGames.length > 0 ? allGames : [
    {
      id: 1,
      title: "Cyber Legends",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
      progress: 0,
      status: "locked",
      price: 50
    },
    {
      id: 2,
      title: "Neon Warriors",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
      progress: 0,
      status: "locked",
      price: 30
    },
    {
      id: 3,
      title: "Space Odyssey",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400",
      progress: 0,
      status: "locked",
      price: 75
    },
    {
      id: 4,
      title: "Digital Realm",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400",
      progress: 0,
      status: "locked",
      price: 40
    }
  ];

  return {
    userGames: userGames.length > 0 ? userGames : mockGames,
    allGames: allGames.length > 0 ? allGames : mockGames,
    achievements: userAchievements,
    gvBalance,
    transactions,
    loading,
    updateGameProgress,
    unlockAchievement,
    claimReward,
    updateGVBalance,
    purchaseGame,
    mockGames,
    refreshData: loadUserData
  };
};