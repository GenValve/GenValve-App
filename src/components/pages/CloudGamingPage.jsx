import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Zap, Clock, Wifi, Monitor, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const CloudGamingPage = () => {
  const [credits] = useState(150);

  const cloudFeatures = [
    {
      icon: Zap,
      title: "Instant Play",
      description: "No downloads, no installations. Play instantly in your browser.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Monitor,
      title: "4K Streaming",
      description: "Experience games in stunning 4K resolution with 60fps.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Wifi,
      title: "Low Latency",
      description: "Sub-20ms latency for responsive gaming experience.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Gamepad2,
      title: "Any Device",
      description: "Play on any device - PC, mobile, tablet, or smart TV.",
      color: "from-pink-500 to-red-500"
    }
  ];

  const handleStartStreaming = () => {};

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center mb-6">
          <div className="rgb-border p-4 rounded-2xl">
            <Cloud className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 className="font-orbitron text-4xl font-bold text-white">Cloud Gaming</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Stream high-end games instantly without downloads. Experience the future of gaming with our cloud infrastructure.
        </p>
        
        <div className="flex justify-center">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 text-lg">
            {credits} Credits Available
          </Badge>
        </div>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden"
      >
        <Card className="glass-strong border-gray-800 rgb-glow">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="font-orbitron text-3xl font-bold text-white mb-4">
                  Coming Soon
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  We're building the most advanced cloud gaming platform for Web3. 
                  Get ready for instant access to AAA games without any hardware limitations.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleStartStreaming}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                >
                  Join Waitlist
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10 px-8 py-3 text-lg"
                  onClick={handleStartStreaming}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {cloudFeatures.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="glass border-gray-800 hover:border-gray-700 transition-all duration-300 h-full">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white font-orbitron text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="glass border-gray-800 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-white mb-2">20ms</div>
            <div className="text-gray-400">Average Latency</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-gray-800 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-white mb-2">4K 60fps</div>
            <div className="text-gray-400">Max Resolution</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-gray-800 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Availability</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Beta Access */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-strong border-gray-800">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="font-orbitron text-2xl font-bold text-white mb-2">
                  Get Early Access
                </h3>
                <p className="text-gray-400">
                  Be among the first to experience next-generation cloud gaming. 
                  Beta testing starts soon!
                </p>
              </div>
              
              <Button
                onClick={handleStartStreaming}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 whitespace-nowrap"
              >
                Request Beta Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CloudGamingPage;