import React from 'react';
import { motion } from 'framer-motion';
import { Play, Download, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUserData } from '@/hooks/useUserData';
import { toast } from '@/components/ui/use-toast';

const LibraryPage = () => {
  const { userGames, loading, updateGameProgress } = useUserData();

  const handlePlayGame = (game) => {
    if (game.status !== 'locked') {
      const newProgress = Math.min(game.progress + 10, 100);
      updateGameProgress(game.id, newProgress);
      
      toast({
        title: `Playing ${game.title}! 🎮`,
        description: `Progress updated to ${newProgress}%`,
      });
    } else {
      toast({
        title: "Game Locked",
        description: "Purchase this game from the Indie Market to play!",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'playing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'unlocked':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'playing':
        return 'Playing';
      case 'completed':
        return 'Completed';
      case 'unlocked':
        return 'Ready to Play';
      default:
        return 'Locked';
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const ownedGames = userGames.filter(game => game.status !== 'locked');

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="font-orbitron text-4xl font-bold text-white">Game Library</h1>
        <p className="text-gray-400 text-lg">Your collection of Web3 games</p>
        
        <div className="flex flex-wrap gap-4">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            {userGames.filter(g => g.status === 'playing').length} Playing
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            {userGames.filter(g => g.status === 'completed').length} Completed
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {userGames.filter(g => g.status === 'unlocked').length} Ready to Play
          </Badge>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {ownedGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="game-card glass border-gray-800 overflow-hidden group">
              <div className="relative">
                <img  
                  src={game.image} 
                  alt={`${game.title} game cover`}
                  className="w-full h-48 object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <Button
                      onClick={() => handlePlayGame(game)}
                      disabled={game.status === 'locked'}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {game.status === 'locked' ? 'Locked' : 'Play'}
                    </Button>
                    
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(game.status)} text-white border-0`}>
                    {getStatusText(game.status)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-orbitron text-xl font-semibold text-white mb-2">
                    {game.title}
                  </h3>
                  
                  {game.status !== 'locked' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{game.progress}%</span>
                      </div>
                      <Progress value={game.progress} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-400 hover:text-white hover:bg-white/10"
                      onClick={() => {}}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Install
                    </Button>
                  </div>
                  
                  {game.developer && (
                    <span className="text-gray-400 text-sm">
                      by {game.developer}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {ownedGames.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-12 h-12 text-white" />
          </div>
          <h3 className="font-orbitron text-2xl font-semibold text-white mb-2">
            No Games Yet
          </h3>
          <p className="text-gray-400 mb-6">
            Visit the Indie Market to discover and purchase amazing Web3 games!
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            Browse Games
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default LibraryPage;