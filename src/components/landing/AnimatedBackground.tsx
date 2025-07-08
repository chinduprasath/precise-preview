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
  direction: 'up' | 'down' | 'left' | 'right';
}

const AnimatedBackground = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  const iconComponents = [
    Heart, MessageCircle, Share2, Eye, TrendingUp, 
    Instagram, Youtube, Twitter, Smartphone, Link2
  ];

  const directions = ['up', 'down', 'left', 'right'] as const;

  useEffect(() => {
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      
      for (let i = 0; i < 20; i++) {
        newIcons.push({
          id: i,
          Icon: iconComponents[Math.floor(Math.random() * iconComponents.length)],
          x: Math.random() * 90 + 5, // 5-95% to avoid edges
          y: Math.random() * 90 + 5, // 5-95% to avoid edges
          size: Math.random() * 12 + 20, // 20-32px
          duration: Math.random() * 15 + 20, // 20-35s
          delay: Math.random() * 5, // 0-5s delay
          opacity: Math.random() * 0.15 + 0.1, // 10-25% opacity
          direction: directions[Math.floor(Math.random() * directions.length)],
        });
      }
      
      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-background/5 dark:bg-background/10" />
      
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`absolute transition-all duration-1000 ease-in-out ${
            icon.direction === 'up' ? 'animate-float-up' :
            icon.direction === 'down' ? 'animate-float-down' :
            icon.direction === 'left' ? 'animate-float-left' :
            'animate-float-right'
          }`}
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDuration: `${icon.duration}s`,
            animationDelay: `${icon.delay}s`,
            opacity: icon.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="animate-pulse-subtle">
            <icon.Icon 
              size={icon.size} 
              className="text-primary/60 dark:text-primary/40 drop-shadow-sm" 
              style={{
                animationDuration: `${icon.duration * 0.7}s`,
                animationDelay: `${icon.delay * 0.3}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;