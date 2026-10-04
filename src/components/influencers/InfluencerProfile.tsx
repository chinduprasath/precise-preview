
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Copy, 
  Share2, 
  Pencil, 
  ChevronDown, 
  MapPin, 
  Sparkles, 
  Bookmark, 
  Globe, 
  ExternalLink, 
  Languages, 
  Briefcase, 
  Video, 
  CheckCircle2, 
  User, 
  FileText 
} from 'lucide-react';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { formatCurrency } from '@/components/reach/utils/formatUtils';
import PricesTabContent from '@/components/influencers/PricesTabContent';
import DataTabContent from '@/components/influencers/DataTabContent';
import ServicesTabContent from '@/components/influencers/ServicesTabContent';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InfluencerProfileProps {
  influencer?: any | null;
}

const InfluencerProfile: React.FC<InfluencerProfileProps> = ({ influencer }) => {
  const { toast } = useToast();

  const handleCopyEmail = () => {
    if (influencer?.email) {
      navigator.clipboard.writeText(influencer.email);
      toast({
        title: "Email Copied",
        description: "Email address copied to clipboard",
      });
    }
  };

  if (!influencer) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-muted-foreground mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-muted-foreground mb-1">No Profile Selected</h3>
        <p className="text-muted-foreground">Please select an influencer profile to display their data</p>
      </div>
    );
  }
  
  // Format Location: (City, State, Country)
  const locationString = [
    influencer?.city?.name || influencer?.city || 'Mumbai',
    influencer?.state?.name || influencer?.state || 'Maharashtra',
    influencer?.country?.name || influencer?.country || 'India'
  ].filter(Boolean).join(', ');

  const niche = influencer?.niche?.name || influencer?.niche || 'Fashion & Lifestyle';
  const category = influencer?.category || 'XYZ Products';
  const website = influencer?.website || 'www.xyz.com';
  const websiteDisplay = website.replace(/^https?:\/\//, '');
  const websiteUrl = website.startsWith('http') ? website : `https://${website}`;
  const addressString = influencer?.address || (
    influencer?.city && influencer?.state
      ? `12-A, MG Road, ${influencer.city}, ${influencer.state}, ${influencer.country || 'India'}`
      : '12-A, MG Road, Hyderabad, Telangana, 500001'
  );
  const languages: string[] = influencer?.languages || ['English', 'Hindi', 'Marathi'];
  const collaborationType = influencer?.collaborationType || 'Reels, Posts & Store Visits';
  const primaryPlatform = influencer?.primaryPlatform || 'Instagram & YouTube';

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section (Left Column) */}
        <div className="bg-gray-50 rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <img 
                src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
                alt={influencer.name} 
                className="h-full w-full object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                {influencer.username || '@' + influencer.name.toLowerCase().replace(/\s+/g, '')}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {influencer.email}
                <button onClick={handleCopyEmail} className="text-gray-500 hover:text-gray-700">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 mt-1">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Social Media Followers */}
          <div className="flex justify-between mb-6">
            {influencer.followers_instagram > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white mb-1">
                  <Instagram size={20} />
                </div>
                <span className="text-sm font-medium">{formatNumber(influencer.followers_instagram)}</span>
              </div>
            )}
            {influencer.followers_facebook > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-1">
                  <Facebook size={20} />
                </div>
                <span className="text-sm font-medium">{formatNumber(influencer.followers_facebook)}</span>
              </div>
            )}
            {influencer.followers_youtube > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mb-1">
                  <Youtube size={20} />
                </div>
                <span className="text-sm font-medium">{formatNumber(influencer.followers_youtube)}</span>
              </div>
            )}
            {influencer.followers_twitter > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white mb-1">
                  <Twitter size={20} />
                </div>
                <span className="text-sm font-medium">{formatNumber(influencer.followers_twitter)}</span>
              </div>
            )}
          </div>

          {/* Influencer Info Card (Matching Design Format) */}
          <Card className="bg-white dark:bg-card border border-border/80 shadow-xs rounded-2xl overflow-hidden mt-4">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-foreground">Influencer Info</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toast({ title: "Edit", description: "Edit profile details enabled" })}
                  className="h-8 px-2 text-foreground hover:bg-muted font-medium flex items-center gap-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Influencer Name</p>
                  <p className="font-semibold text-foreground text-sm">
                    {influencer?.name || 'Demo Influencer'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Category</p>
                  <p className="font-semibold text-foreground text-sm">
                    {category}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Niche</p>
                  <p className="font-semibold text-foreground text-sm">
                    {niche}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Location (City, State, Country)</p>
                  <p className="font-semibold text-foreground text-sm">
                    {locationString}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Website Link</p>
                  <a 
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-foreground text-sm hover:text-primary hover:underline transition-colors block"
                  >
                    {websiteDisplay}
                  </a>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Primary Platform</p>
                  <p className="font-semibold text-foreground text-sm">
                    {primaryPlatform}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Languages Known</p>
                  <p className="font-semibold text-foreground text-sm">
                    {languages.join(', ')}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Collaboration Types</p>
                  <p className="font-semibold text-foreground text-sm">
                    {collaborationType}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Price Range</p>
                  <p className="font-semibold text-foreground text-sm">₹5,000 - ₹50,000</p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Creator Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p className="font-semibold text-foreground text-sm">Active (Verified Creator)</p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-muted-foreground text-sm mb-1 font-normal">Bio / About</p>
                  <p className="font-medium text-foreground text-sm leading-relaxed">
                    {influencer?.bio || 'Content Creator & Digital Influencer passionate about lifestyle, tech, and fashion storytelling.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section (Right Column) */}
        <div className="md:col-span-2">
          <Tabs defaultValue="services">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
              <TabsTrigger value="prices" className="flex-1">Prices</TabsTrigger>
              <TabsTrigger value="data" className="flex-1">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <ServicesTabContent influencerId={influencer.id} influencerName={influencer.name} />
            </TabsContent>

            <TabsContent value="prices">
              <PricesTabContent influencerId={influencer.id} influencerName={influencer.name} />
            </TabsContent>

            <TabsContent value="data">
              <DataTabContent influencerId={influencer.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
