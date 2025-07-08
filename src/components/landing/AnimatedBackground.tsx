import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Eye, Link2, Camera, Video, BarChart3, Smartphone, User } from 'lucide-react';

interface FloatingIcon {
  id: number;
  Icon: React.ComponentType<any>;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  layer: 'front' | 'middle' | 'back';
  direction: number; // angle in degrees
  distance: number; // how far it moves
  color: string;
}

const AnimatedBackground = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  const iconComponents = [
    Heart, MessageCircle, Share2, Eye, Link2, 
    Camera, Video, BarChart3, Smartphone, User
  ];

  const colorPalette = [
    'hsl(var(--primary))',
    'hsl(235, 45%, 65%)', // soft purple
    'hsl(220, 40%, 70%)', // soft blue
    'hsl(210, 15%, 60%)', // soft grey
    'hsl(250, 35%, 68%)', // lavender
  ];

  // Grid-based positioning to ensure even distribution
  const createGridPositions = (count: number) => {
    const positions: { x: number; y: number }[] = [];
    const cols = Math.ceil(Math.sqrt(count * 1.5));
    const rows = Math.ceil(count / cols);
    
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      // Add randomness within grid cells to avoid rigid patterns
      const cellWidth = 100 / cols;
      const cellHeight = 100 / rows;
      
      const x = (col * cellWidth) + (Math.random() * cellWidth * 0.6) + (cellWidth * 0.2);
      const y = (row * cellHeight) + (Math.random() * cellHeight * 0.6) + (cellHeight * 0.2);
      
      positions.push({ 
        x: Math.max(5, Math.min(95, x)), 
        y: Math.max(5, Math.min(95, y)) 
      });
    }
    
    return positions;
  };

  useEffect(() => {
    const generateIcons = () => {
      const iconCount = 25;
      const positions = createGridPositions(iconCount);
      const newIcons: FloatingIcon[] = [];
      
      positions.forEach((pos, i) => {
        const layer = i < 8 ? 'back' : i < 16 ? 'middle' : 'front';
        
        newIcons.push({
          id: i,
          Icon: iconComponents[Math.floor(Math.random() * iconComponents.length)],
          x: pos.x,
          y: pos.y,
          size: Math.random() * 16 + 20, // 20-36px
          duration: Math.random() * 40 + 20, // 20-60s
          delay: Math.random() * 10, // 0-10s delay
          opacity: Math.random() * 0.1 + 0.1, // 10-20% opacity
          layer,
          direction: Math.random() * 360, // random direction in degrees
          distance: Math.random() * 30 + 15, // 15-45px movement distance
          color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        });
      });
      
      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  const getLayerSpeed = (layer: string) => {
    switch (layer) {
      case 'front': return 1;
      case 'middle': return 0.7;
      case 'back': return 0.4;
      default: return 1;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layered icons for depth effect */}
      {['back', 'middle', 'front'].map(layer => (
        <div key={layer} className="absolute inset-0" style={{ zIndex: layer === 'back' ? 1 : layer === 'middle' ? 2 : 3 }}>
          {icons
            .filter(icon => icon.layer === layer)
            .map((icon) => (
              <div
                key={`${layer}-${icon.id}`}
                className="absolute animate-float-organic"
                style={{
                  left: `${icon.x}%`,
                  top: `${icon.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDuration: `${icon.duration * getLayerSpeed(icon.layer)}s`,
                  animationDelay: `${icon.delay}s`,
                  '--float-distance': `${icon.distance}px`,
                  '--float-angle': `${icon.direction}deg`,
                } as React.CSSProperties}
              >
                <div 
                  className="animate-fade-pulse"
                  style={{
                    opacity: icon.opacity,
                    animationDuration: `${icon.duration * 0.3}s`,
                    animationDelay: `${icon.delay * 0.5}s`,
                  }}
                >
                  <icon.Icon 
                    size={icon.size} 
                    className="drop-shadow-sm transition-all duration-1000"
                    style={{ 
                      color: icon.color,
                      filter: `blur(${layer === 'back' ? '0.5px' : '0px'})`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;