import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Check, Image as ImageIcon, Sparkles, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

export interface UserStatus {
  id: string;
  userType: 'business' | 'influencer';
  userName: string;
  userHandle?: string;
  userAvatar: string;
  imageUrl: string;
  caption?: string;
  timestamp: string;
  createdAt: number;
}

const INITIAL_STATUSES: UserStatus[] = [
  {
    id: 'status-1',
    userType: 'business',
    userName: 'Velocity Motors',
    userHandle: '@velocity_motors',
    userAvatar: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
    caption: 'New Desert Canyon Off-Road series kicking off this weekend! 🏎️💨',
    timestamp: '15m ago',
    createdAt: Date.now() - 15 * 60 * 1000
  },
  {
    id: 'status-2',
    userType: 'influencer',
    userName: 'Akash Sharma',
    userHandle: '@travelbug_akash',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800',
    caption: 'Supercar shoot in the valley. Full reel drops at 6 PM! 🔥',
    timestamp: '1h ago',
    createdAt: Date.now() - 60 * 60 * 1000
  },
  {
    id: 'status-3',
    userType: 'business',
    userName: 'Artisan Brews',
    userHandle: '@foodie_collective',
    userAvatar: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800',
    caption: 'Fresh roast drop: Single origin Ethiopian roast now live. ☕✨',
    timestamp: '2h ago',
    createdAt: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: 'status-4',
    userType: 'influencer',
    userName: 'Anjali Verma',
    userHandle: '@foodieanjali',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
    caption: 'Tried the new secret menu at Artisan Brews. Highly recommended! 🥐',
    timestamp: '3h ago',
    createdAt: Date.now() - 3 * 60 * 60 * 1000
  },
  {
    id: 'status-5',
    userType: 'business',
    userName: 'HyperGear Audio',
    userHandle: '@tech_hypergear',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
    caption: 'Behind the scenes at our creator studio microphone launch! 🎙️🎧',
    timestamp: '5h ago',
    createdAt: Date.now() - 5 * 60 * 60 * 1000
  },
  {
    id: 'status-6',
    userType: 'influencer',
    userName: 'Neha Fitness',
    userHandle: '@fitnessneha',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800',
    caption: 'Day 14 of the High-Intensity Creator Challenge. Keep grinding! 💪',
    timestamp: '6h ago',
    createdAt: Date.now() - 60 * 60 * 6000
  }
];

const PRESET_IMAGES = [
  { label: 'Off-Road SUV', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800' },
  { label: 'Studio Showcase', url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800' },
  { label: 'Supercar', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800' },
  { label: 'Cafe & Books', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800' },
  { label: 'Camera Studio', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800' },
  { label: 'Fitness & Style', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800' }
];

export const StatusSection: React.FC = () => {
  const [statuses, setStatuses] = useState<UserStatus[]>(() => {
    try {
      const saved = localStorage.getItem('business_dashboard_statuses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_STATUSES;
  });

  const [filterType, setFilterType] = useState<'all' | 'business' | 'influencer'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);

  // Add status form state
  const [newAuthorType, setNewAuthorType] = useState<'business' | 'influencer'>('business');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorHandle, setNewAuthorHandle] = useState('');
  const [newAuthorAvatar, setNewAuthorAvatar] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(PRESET_IMAGES[0].url);
  const [newCaption, setNewCaption] = useState('');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('business_dashboard_statuses', JSON.stringify(statuses));
    } catch (err) {
      console.error('Failed to save statuses to localStorage', err);
    }
  }, [statuses]);

  const filteredStatuses = statuses.filter(item => {
    if (filterType === 'all') return true;
    return item.userType === filterType;
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleAddStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName.trim()) {
      toast({
        title: 'Author Name Required',
        description: 'Please specify who is posting this status.',
        variant: 'destructive'
      });
      return;
    }

    const defaultAvatar = newAuthorType === 'business'
      ? 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=200'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';

    const newStatus: UserStatus = {
      id: `status-${Date.now()}`,
      userType: newAuthorType,
      userName: newAuthorName.trim(),
      userHandle: newAuthorHandle.trim() || `@${newAuthorName.trim().toLowerCase().replace(/\s+/g, '_')}`,
      userAvatar: newAuthorAvatar.trim() || defaultAvatar,
      imageUrl: newImageUrl.trim() || PRESET_IMAGES[0].url,
      caption: newCaption.trim(),
      timestamp: 'Just now',
      createdAt: Date.now()
    };

    setStatuses(prev => [newStatus, ...prev]);
    setIsAddOpen(false);
    // Reset inputs
    setNewAuthorName('');
    setNewAuthorHandle('');
    setNewAuthorAvatar('');
    setNewCaption('');
    setNewImageUrl(PRESET_IMAGES[0].url);

    toast({
      title: 'Status Published! 🎉',
      description: `Added status for ${newStatus.userName} (${newAuthorType === 'business' ? 'Business User' : 'Influencer'})`
    });
  };

  // Viewer controls
  const handlePrevStatus = () => {
    if (viewingIndex !== null && viewingIndex > 0) {
      setViewingIndex(viewingIndex - 1);
    }
  };

  const handleNextStatus = () => {
    if (viewingIndex !== null && viewingIndex < filteredStatuses.length - 1) {
      setViewingIndex(viewingIndex + 1);
    }
  };

  const currentViewingStatus = viewingIndex !== null ? filteredStatuses[viewingIndex] : null;

  return (
    <div className="mb-8 bg-card rounded-2xl p-5 border border-border shadow-xs">
      {/* Header with Title and Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            ✨
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Statuses & Stories</h2>
            <p className="text-xs text-muted-foreground">Recent square story updates from Business Users & Influencers</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="inline-flex items-center bg-muted/60 p-1 rounded-xl border border-border text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({statuses.length})
            </button>
            <button
              onClick={() => setFilterType('business')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'business'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Business Users ({statuses.filter(s => s.userType === 'business').length})
            </button>
            <button
              onClick={() => setFilterType('influencer')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'influencer'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Influencers ({statuses.filter(s => s.userType === 'influencer').length})
            </button>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleScroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleScroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Square Story Feed Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Square Button: + Add Status */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="group shrink-0 w-28 h-28 sm:w-32 sm:h-32 aspect-square rounded-2xl border-2 border-dashed border-primary/50 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-200 flex flex-col items-center justify-center p-3 text-center focus:outline-none focus:ring-2 focus:ring-primary/40 hover:scale-105 shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mb-2">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
            Add Status
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Biz & Influencer
          </span>
        </button>

        {/* Square Status Cards */}
        {filteredStatuses.map((status, index) => {
          const isBusiness = status.userType === 'business';
          return (
            <div
              key={status.id}
              onClick={() => setViewingIndex(index)}
              className="group relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-border/80 hover:border-primary"
            >
              {/* Background Status Media */}
              <img
                src={status.imageUrl}
                alt={status.userName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Gradient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

              {/* Top Row: User Avatar with colored active ring & User Type Badge */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <Avatar className={`w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-offset-1 ring-offset-black/50 ${
                  isBusiness ? 'ring-blue-500' : 'ring-purple-500'
                }`}>
                  <img src={status.userAvatar} alt={status.userName} className="w-full h-full object-cover" />
                </Avatar>

                <Badge
                  className={`text-[9px] px-1.5 py-0.5 font-semibold text-white shadow-xs border-0 ${
                    isBusiness ? 'bg-blue-600/90' : 'bg-purple-600/90'
                  }`}
                >
                  {isBusiness ? 'Business' : 'Influencer'}
                </Badge>
              </div>

              {/* Bottom Content: Name & Timestamp */}
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <p className="text-xs font-bold leading-tight truncate text-white drop-shadow-xs">
                  {status.userName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-white/80 mt-0.5">
                  <span className="truncate">{status.timestamp}</span>
                  {status.caption && (
                    <span className="text-[9px] opacity-80 shrink-0 ml-1">💬</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DIALOG 1: Add Status Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Add New Status
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Post a square-shaped status update visible to businesses and influencers.
            </p>
          </DialogHeader>

          <form onSubmit={handleAddStatus} className="space-y-4 mt-2">
            {/* Author Type Selector: Business User vs Influencer */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Post as User Type:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNewAuthorType('business');
                    if (!newAuthorName) setNewAuthorName('Velocity Motors');
                  }}
                  className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all text-left ${
                    newAuthorType === 'business'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'border-border hover:border-border/80 text-muted-foreground'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Business User</div>
                    <div className="text-[10px] opacity-80">Brand / Company</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewAuthorType('influencer');
                    if (!newAuthorName) setNewAuthorName('Akash Sharma');
                  }}
                  className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all text-left ${
                    newAuthorType === 'influencer'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 shadow-xs'
                      : 'border-border hover:border-border/80 text-muted-foreground'
                  }`}
                >
                  <User className="w-5 h-5 text-purple-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Influencer</div>
                    <div className="text-[10px] opacity-80">Creator / Talent</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Author / Brand Name:
              </label>
              <Input
                placeholder={newAuthorType === 'business' ? 'e.g. Velocity Auto Club' : 'e.g. Priya Sharma'}
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
                required
              />
            </div>

            {/* Caption / Text */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Status Caption:
              </label>
              <Textarea
                placeholder="What's happening? Share a sneak peek, launch, or campaign note..."
                rows={3}
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
              />
            </div>

            {/* Media Image Selection */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Select Square Media Image:
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => setNewImageUrl(preset.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      newImageUrl === preset.url
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    {newImageUrl === preset.url && (
                      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Or paste custom image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Post Status
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: View Status Dialog (Story Viewer) */}
      {currentViewingStatus && (
        <Dialog open={viewingIndex !== null} onOpenChange={(open) => !open && setViewingIndex(null)}>
          <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-black text-white border-0 shadow-2xl">
            <div className="relative aspect-square w-full bg-slate-950 flex flex-col justify-between">
              {/* Media image background */}
              <img
                src={currentViewingStatus.imageUrl}
                alt={currentViewingStatus.userName}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

              {/* Progress bars header */}
              <div className="relative z-10 p-4">
                <div className="w-full bg-white/30 h-1 rounded-full mb-3 overflow-hidden">
                  <div className="bg-white h-full w-full animate-pulse" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className={`w-9 h-9 ring-2 ${
                      currentViewingStatus.userType === 'business' ? 'ring-blue-500' : 'ring-purple-500'
                    }`}>
                      <img src={currentViewingStatus.userAvatar} alt={currentViewingStatus.userName} className="w-full h-full object-cover" />
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{currentViewingStatus.userName}</span>
                        <Badge
                          className={`text-[9px] px-1.5 py-0 font-semibold border-0 ${
                            currentViewingStatus.userType === 'business' ? 'bg-blue-600' : 'bg-purple-600'
                          }`}
                        >
                          {currentViewingStatus.userType === 'business' ? 'Business' : 'Influencer'}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-white/70">{currentViewingStatus.timestamp}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewingIndex(null)}
                    className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-white/90 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation overlays */}
              <button
                onClick={handlePrevStatus}
                disabled={viewingIndex === 0}
                className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all ${
                  viewingIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextStatus}
                disabled={viewingIndex === filteredStatuses.length - 1}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all ${
                  viewingIndex === filteredStatuses.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Caption Overlay */}
              <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                {currentViewingStatus.caption && (
                  <p className="text-sm font-medium text-white mb-2 leading-relaxed">
                    {currentViewingStatus.caption}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-white/70 pt-2 border-t border-white/20">
                  <span>{currentViewingStatus.userHandle}</span>
                  <span className="text-[11px]">Square Status Preview</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StatusSection;
