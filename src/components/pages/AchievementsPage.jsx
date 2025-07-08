import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Zap, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserData } from '@/hooks/useUserData';
import { toast } from '@/components/ui/use-toast';

const AchievementsPage = () => {
  const { achievements, unlockAchievement, claimReward } = useUserData();
  const [filter, setFilter] = useState('all');

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-500 to-gray-600';
      case 'rare':
        return 'from-blue-500 to-blue-600';
      case 'epic':
        return 'from-purple-500 to-purple-600';
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'common':
        return Star;
      case 'rare':
        return Zap;
      case 'epic':
        return Crown;
      case 'legendary':
        return Trophy;
      default:
        return Star;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const handleClaimReward = async (achievement) => {
    if (achievement.unlocked && !achievement.claimed) {
      const success = await claimReward(achievement.id);
      if (success) {
        toast({
          title: "Reward Claimed! 🎉",
          description: `You received ${achievement.reward_amount} $GV tokens!`,
        });
      } else {
        toast({
          title: "Claim Failed",
          description: "Unable to claim reward. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleUnlockDemo = async (achievement) => {
    if (!achievement.unlocked) {
      await unlockAchievement(achievement.id);
      toast({
        title: "Achievement Unlocked! 🏆",
        description: `You unlocked "${achievement.title}"!`,
      });
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-4">
          <div className="rgb-border p-3 rounded-xl">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-white">Achievements</h1>
            <p className="text-gray-400 text-lg">Track your gaming milestones and earn rewards</p>
          </div>
        </div>

        <Card className="glass-strong border-gray-800 rgb-glow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{unlockedCount}</div>
                <div className="text-gray-400">Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{totalCount}</div>
                <div className="text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{completionPercentage}%</div>
                <div className="text-gray-400">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          {['all', 'unlocked', 'locked'].map((filterType) => (
            <Button
              key={filterType}
              onClick={() => setFilter(filterType)}
              variant={filter === filterType ? 'default' : 'outline'}
              className={filter === filterType 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'border-gray-600 text-gray-400 hover:text-white hover:bg-white/10'
              }
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAchievements.map((achievement, index) => {
          const RarityIcon = getRarityIcon(achievement.rarity);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass border-gray-800 overflow-hidden transition-all duration-300 ${
                achievement.unlocked 
                  ? 'achievement-glow hover:scale-105' 
                  : 'opacity-60 hover:opacity-80'
              }`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full flex items-center justify-center text-3xl relative`}>
                      {achievement.unlocked ? (
                        <span>{achievement.icon}</span>
                      ) : (
                        <Lock className="w-8 h-8 text-white" />
                      )}
                      
                      {achievement.unlocked && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RarityIcon className="w-5 h-5 text-gray-400" />
                      <Badge 
                        variant="secondary" 
                        className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white border-0`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-orbitron text-xl font-semibold text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {achievement.description}
                    </p>
                    {achievement.reward_amount > 0 && (
                      <p className="text-yellow-400 text-sm font-semibold">
                        Reward: {achievement.reward_amount} $GV
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    {achievement.unlocked ? (
                      achievement.claimed ? (
                        <div className="w-full p-3 rounded-lg bg-green-800/20 text-center">
                          <span className="text-green-400 text-sm">Reward Claimed</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleClaimReward(achievement)}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        >
                          Claim {achievement.reward_amount} $GV
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleUnlockDemo(achievement)}
                        variant="outline"
                        className="w-full border-gray-600 text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        Unlock (Demo)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        <h2 className="font-orbitron text-2xl font-bold text-white">Achievement Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Combat', icon: '⚔️', count: achievements.filter(a => a.title.includes('Victory') || a.title.includes('Combat')).length, unlocked: achievements.filter(a => (a.title.includes('Victory') || a.title.includes('Combat')) && a.unlocked).length },
            { name: 'Exploration', icon: '🗺️', count: achievements.filter(a => a.title.includes('Explorer')).length, unlocked: achievements.filter(a => a.title.includes('Explorer') && a.unlocked).length },
            { name: 'Collection', icon: '💎', count: achievements.filter(a => a.title.includes('Collector') || a.title.includes('Perfect')).length, unlocked: achievements.filter(a => (a.title.includes('Collector') || a.title.includes('Perfect')) && a.unlocked).length },
            { name: 'Social', icon: '👥', count: achievements.filter(a => a.title.includes('Social')).length, unlocked: achievements.filter(a => a.title.includes('Social') && a.unlocked).length }
          ].map((category, index) => (
            <Card key={index} className="glass border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                <p className="text-gray-400 text-sm">
                  {category.unlocked}/{category.count} unlocked
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-strong border-gray-800">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">
              Global Leaderboards
            </h3>
            <p className="text-gray-400 mb-6">
              Compete with players worldwide and climb the achievement rankings!
            </p>
            <Button
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
              onClick={() => {}}
            >
              View Leaderboards
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AchievementsPage;