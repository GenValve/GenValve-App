import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Download, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserData } from '@/hooks/useUserData';
import { toast } from '@/components/ui/use-toast';

const IndieMarketPage = () => {
  const { allGames, gvBalance, purchaseGame } = useUserData();

  const handlePurchase = async (game) => {
    if (gvBalance >= game.price) {
      const success = await purchaseGame(game.id);
      if (success) {
        toast({
          title: "Game Purchased! 🎉",
          description: `${game.title} has been added to your library!`,
        });
      } else {
        toast({
          title: "Purchase Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough $GV tokens to purchase this game.",
        variant: "destructive"
      });
    }
  };

  const handleWishlist = (game) => {};

  const getRandomRating = () => (4.0 + Math.random() * 1.0).toFixed(1);
  const getRandomDownloads = () => Math.floor(Math.random() * 50000) + 10000;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-4">
          <div className="rgb-border p-3 rounded-xl">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-white">Indie Market</h1>
            <p className="text-gray-400 text-lg">Discover amazing indie games and support developers</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              New Releases
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              Trending
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              On Sale
            </Badge>
          </div>
          
          <div className="glass rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">Your Balance: </span>
            <span className="text-white font-semibold">{gvBalance.toFixed(2)} $GV</span>
          </div>
        </div>
      </motion.div>

      {allGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-strong border-gray-800 overflow-hidden rgb-glow">
            <div className="relative h-64 md:h-80">
              <img  
                src={allGames[0].image}
                alt="Featured game banner"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-8 left-8 space-y-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    Featured
                  </Badge>
                  <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white">
                    {allGames[0].title}
                  </h2>
                  <p className="text-gray-300 max-w-md">
                    {allGames[0].description || "Immerse yourself in a neon-lit cyberpunk world where every choice matters. Experience cutting-edge gameplay with blockchain integration."}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => handlePurchase(allGames[0])}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
                    >
                      Buy for {allGames[0].price} $GV
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleWishlist(allGames[0])}
                      className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <h2 className="font-orbitron text-2xl font-bold text-white">All Games</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="game-card glass border-gray-800 overflow-hidden group">
                <div className="relative">
                  <img  
                    src={game.image} 
                    alt={`${game.title} game cover`}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Button
                        onClick={() => handlePurchase(game)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        Buy for {game.price} $GV
                      </Button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleWishlist(game)}
                    className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-orbitron text-xl font-semibold text-white mb-2">
                      {game.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{getRandomRating()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{getRandomDownloads().toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {game.developer && (
                      <p className="text-gray-400 text-sm mb-2">by {game.developer}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {game.category || 'Indie'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Web3
                      </Badge>
                    </div>
                    
                    <span className="text-white font-bold text-lg">
                      {game.price} $GV
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-strong border-gray-800">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="font-orbitron text-2xl font-bold text-white">
                Support Indie Developers
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Every purchase directly supports independent game developers. 
                Join our community and help shape the future of Web3 gaming.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
                  onClick={() => {}}
                >
                  Become a Developer
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
                  onClick={() => {}}
                >
                  Join Community
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default IndieMarketPage;