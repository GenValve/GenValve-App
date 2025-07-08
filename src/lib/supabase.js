import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://umnwjzynsmporwuwijvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbndqenluc21wb3J3dXdpanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjI5NzEsImV4cCI6MjA2NjI5ODk3MX0.u9Jpoa8VhRUscVziT_r_QKqJM0a6eZt1ZJmFQIIz4TI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUserByWallet = async (walletAddress) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .maybeSingle();
  
  return { data, error };
};

export const createUser = async (walletAddress, email = null) => {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      wallet_address: walletAddress.toLowerCase(),
      email: email,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'wallet_address'
    })
    .select()
    .single();
  
  return { data, error };
};

export const getUserGames = async (userId) => {
  const { data, error } = await supabase
    .from('user_games')
    .select(`
      *,
      games (
        id,
        title,
        description,
        image_url,
        price,
        category,
        developer
      )
    `)
    .eq('user_id', userId);
  
  return { data: data || [], error };
};

export const getAllGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data: data || [], error };
};

export const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements (
        id,
        title,
        description,
        icon,
        rarity,
        reward_amount
      )
    `)
    .eq('user_id', userId);
  
  return { data: data || [], error };
};

export const getAllAchievements = async () => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('rarity', { ascending: false });
  
  return { data: data || [], error };
};

export const getUserBalance = async (userId) => {
  const { data, error } = await supabase
    .from('user_balances')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  return { data, error };
};

export const updateUserBalance = async (userId, gvBalance, ethBalance = null) => {
  const updateData = {
    gv_balance: gvBalance,
    updated_at: new Date().toISOString()
  };
  
  if (ethBalance !== null) {
    updateData.eth_balance = ethBalance;
  }
  
  const { data, error } = await supabase
    .from('user_balances')
    .upsert({
      user_id: userId,
      ...updateData
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single();
  
  return { data, error };
};

export const purchaseGame = async (userId, gameId, price) => {
  const { data: balance, error: balanceError } = await getUserBalance(userId);
  
  if (balanceError && balanceError.code !== 'PGRST116') {
    return { data: null, error: balanceError };
  }
  
  if (!balance || parseFloat(balance.gv_balance || 0) < parseFloat(price)) {
    return { data: null, error: { message: 'Insufficient balance' } };
  }
  
  const newBalance = parseFloat(balance.gv_balance) - parseFloat(price);
  
  const { data: updatedBalance, error: updateError } = await updateUserBalance(userId, newBalance);
  
  if (updateError) {
    return { data: null, error: updateError };
  }
  
  const { data: userGame, error: gameError } = await supabase
    .from('user_games')
    .upsert({
      user_id: userId,
      game_id: gameId,
      status: 'unlocked',
      purchased_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,game_id'
    })
    .select()
    .single();
  
  if (gameError) {
    return { data: null, error: gameError };
  }
  
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'purchase',
      amount: -parseFloat(price),
      description: 'Game purchase',
      game_id: gameId,
      status: 'completed'
    })
    .select()
    .single();
  
  return { data: { userGame, balance: updatedBalance, transaction }, error: null };
};

export const unlockAchievement = async (userId, achievementId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .upsert({
      user_id: userId,
      achievement_id: achievementId,
      unlocked_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,achievement_id'
    })
    .select(`
      *,
      achievements (
        id,
        title,
        description,
        icon,
        rarity,
        reward_amount
      )
    `)
    .single();
  
  return { data, error };
};

export const claimAchievementReward = async (userId, achievementId) => {
  const { data: userAchievement, error: achievementError } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements (
        reward_amount
      )
    `)
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .eq('claimed', false)
    .maybeSingle();
  
  if (achievementError && achievementError.code !== 'PGRST116') {
    return { data: null, error: achievementError };
  }
  
  if (!userAchievement) {
    return { data: null, error: { message: 'Achievement not found or already claimed' } };
  }
  
  const rewardAmount = parseFloat(userAchievement.achievements.reward_amount);
  
  const { data: balance, error: balanceError } = await getUserBalance(userId);
  
  if (balanceError && balanceError.code !== 'PGRST116') {
    return { data: null, error: balanceError };
  }
  
  const currentBalance = balance ? parseFloat(balance.gv_balance) : 0;
  const newBalance = currentBalance + rewardAmount;
  
  const { data: updatedBalance, error: updateError } = await updateUserBalance(userId, newBalance);
  
  if (updateError) {
    return { data: null, error: updateError };
  }
  
  const { data: claimedAchievement, error: claimError } = await supabase
    .from('user_achievements')
    .update({ claimed: true })
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .select()
    .single();
  
  if (claimError) {
    return { data: null, error: claimError };
  }
  
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'reward',
      amount: rewardAmount,
      description: 'Achievement reward claimed',
      achievement_id: achievementId,
      status: 'completed'
    })
    .select()
    .single();
  
  return { data: { achievement: claimedAchievement, balance: updatedBalance, transaction }, error: null };
};

export const getUserTransactions = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      games (title),
      achievements (title)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: data || [], error };
};

export const updateGameProgress = async (userId, gameId, progress) => {
  const { data, error } = await supabase
    .from('user_games')
    .update({
      progress: progress,
      status: progress === 100 ? 'completed' : 'playing',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('game_id', gameId)
    .select()
    .single();
  
  return { data, error };
};