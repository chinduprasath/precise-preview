
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Heart, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Influencer } from '@/types/location';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistInfluencers, setWishlistInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('influencerWishlist');
    if (savedWishlist) {
      setWishlistInfluencers(JSON.parse(savedWishlist));
    }
  }, []);

  const removeFromWishlist = (influencerId: string) => {
    const updatedWishlist = wishlistInfluencers.filter(inf => inf.id !== influencerId);
    setWishlistInfluencers(updatedWishlist);
    localStorage.setItem('influencerWishlist', JSON.stringify(updatedWishlist));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getSocialMediaPageName = (influencer: Influencer) => {
    if (influencer.followers_instagram && influencer.followers_instagram > 0) {
      return `@${influencer.name.toLowerCase().replace(/\s+/g, '_')}`;
    }
    if (influencer.followers_facebook && influencer.followers_facebook > 0) {
      return `${influencer.name.replace(/\s+/g, '_')} on Facebook`;
    }
    if (influencer.followers_youtube && influencer.followers_youtube > 0) {
      return `${influencer.name.replace(/\s+/g, '_')} YouTube`;
    }
    if (influencer.followers_twitter && influencer.followers_twitter > 0) {
      return `@${influencer.name.toLowerCase().replace(/\s+/g, '_')}`;
    }
    return `@${influencer.name.toLowerCase().replace(/\s+/g, '_')}`;
  };

  const getSocialMediaIcons = (influencer: Influencer) => {
    const socialMedia = [];
    
    if (influencer.followers_instagram && influencer.followers_instagram > 0) {
      socialMedia.push({
        icon: <Instagram className="h-3 w-3" />,
        count: influencer.followers_instagram,
        color: 'text-pink-500'
      });
    }
    
    if (influencer.followers_youtube && influencer.followers_youtube > 0) {
      socialMedia.push({
        icon: <Youtube className="h-3 w-3" />,
        count: influencer.followers_youtube,
        color: 'text-red-500'
      });
    }
    
    if (influencer.followers_facebook && influencer.followers_facebook > 0) {
      socialMedia.push({
        icon: <Facebook className="h-3 w-3" />,
        count: influencer.followers_facebook,
        color: 'text-blue-500'
      });
    }
    
    if (influencer.followers_twitter && influencer.followers_twitter > 0) {
      socialMedia.push({
        icon: <Twitter className="h-3 w-3" />,
        count: influencer.followers_twitter,
        color: 'text-blue-400'
      });
    }
    
    return socialMedia;
  };

  const handleInfluencerClick = (influencer: Influencer) => {
    navigate('/influencers', { state: { selectedInfluencer: influencer } });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistInfluencers.length} influencer{wishlistInfluencers.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {wishlistInfluencers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No Influencers in Wishlist</h3>
              <p className="text-muted-foreground mb-4">Start adding influencers to your wishlist to see them here</p>
              <Button onClick={() => navigate('/influencers')}>
                Browse Influencers
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {wishlistInfluencers.map((influencer) => (
                <div
                  key={influencer.id}
                  className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleInfluencerClick(influencer)}
                >
                  <div className="relative mb-3">
                    <Avatar className="h-16 w-16 mx-auto">
                      <img 
                        src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
                        alt={influencer.name} 
                        className={`h-full w-full object-cover ${influencer.is_blurred ? 'blur-sm' : ''}`}
                      />
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(influencer.id);
                      }}
                    >
                      <Heart className="h-3 w-3 fill-current" />
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-medium text-sm text-foreground mb-1 truncate">
                      {getSocialMediaPageName(influencer)}
                    </h3>
                    {influencer.niche && (
                      <p className="text-xs text-muted-foreground mb-3 truncate">
                        {influencer.niche.name}
                      </p>
                    )}
                    
                    <div className="flex flex-col gap-1">
                      {getSocialMediaIcons(influencer).map((social, index) => (
                        <div key={index} className="flex items-center justify-center gap-1">
                          <span className={social.color}>
                            {social.icon}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatNumber(social.count)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WishlistPage;
