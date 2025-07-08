import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Eye, TrendingUp, Instagram, Youtube, Twitter, Smartphone, Link2 } from 'lucide-react';

interface FloatingIcon {
  id: number;
  Icon: React.ComponentType<any>;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const AnimatedBackground = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  const iconComponents = [
    Heart, MessageCircle, Share2, Eye, TrendingUp, 
    Instagram, Youtube, Twitter, Smartphone, Link2
  ];

  useEffect(() => {
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      
      for (let i = 0; i < 15; i++) {
        newIcons.push({
          id: i,
          Icon: iconComponents[Math.floor(Math.random() * iconComponents.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 16 + 16, // 16-32px
          duration: Math.random() * 20 + 15, // 15-35s
          delay: Math.random() * 10, // 0-10s delay
          opacity: Math.random() * 0.1 + 0.05, // 5-15% opacity
        });
      }
      
      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-background/10 dark:bg-background/20" />
      
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute animate-float-random"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDuration: `${icon.duration}s`,
            animationDelay: `${icon.delay}s`,
            opacity: icon.opacity,
          }}
        >
          <icon.Icon 
            size={icon.size} 
            className="text-primary drop-shadow-sm animate-pulse-slow" 
            style={{
              animationDuration: `${icon.duration * 0.5}s`,
              animationDelay: `${icon.delay * 0.5}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;