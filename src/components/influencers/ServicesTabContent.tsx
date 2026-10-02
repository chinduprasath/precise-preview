import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  Eye,
  MessageSquare,
  Share2,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  BarChart2,
  ExternalLink,
  Download,
  Copy,
  Maximize2,
  X,
  Sparkles,
  Calendar,
  Check
} from 'lucide-react';
import { useServiceContent } from '@/hooks/useServiceContent';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { ServiceContentItem } from './utils/serviceContentUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ServicesTabContentProps {
  influencerId?: string;
  influencerName?: string;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'instagram':
      return <Instagram key="instagram" className="h-4 w-4 text-social-instagram" />;
    case 'facebook':
      return <Facebook key="facebook" className="h-4 w-4 text-social-facebook" />;
    case 'youtube':
      return <Youtube key="youtube" className="h-4 w-4 text-social-youtube" />;
    case 'twitter':
      return <Twitter key="twitter" className="h-4 w-4 text-social-twitter" />;
    default:
      return null;
  }
};

const renderPlatformIcons = (platforms: string[]) => {
  if (!platforms || platforms.length === 0) return null;

  if (platforms.length === 1) {
    return (
      <div className="bg-white/90 backdrop-blur-xs rounded-full p-1 shadow-sm border border-slate-200/60">
        {getPlatformIcon(platforms[0])}
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-full px-2 py-1 shadow-sm border border-slate-200/60 flex items-center gap-1.5">
      {platforms.map((platform) => getPlatformIcon(platform))}
    </div>
  );
};

const ContentCard = ({
  item,
  onClick,
}: {
  item: ServiceContentItem;
  onClick: () => void;
}) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImg =
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop';

  const renderMedia = () => {
    if (item.media_type === 'video') {
      return (
        <div className="relative w-full h-40 bg-slate-900 flex items-center justify-center overflow-hidden">
          <img
            src={imgError ? fallbackImg : item.media_url}
            alt={item.title || 'Video Content'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <div className="absolute h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </div>
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/75 text-[10px] text-white font-medium">
            VIDEO
          </span>
        </div>
      );
    } else if (item.media_type === 'poll') {
      return (
        <div className="relative w-full h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center text-white p-4 overflow-hidden">
          <img
            src={imgError ? fallbackImg : item.media_url}
            alt={item.title || 'Poll Content'}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-300"
          />
          <BarChart2 className="h-8 w-8 text-white/90 mb-1 z-10" />
          <span className="z-10 font-bold text-xs text-center line-clamp-1">{item.title || 'Community Poll'}</span>
          <span className="z-10 text-[10px] text-white/80 mt-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
            Interactive Poll
          </span>
        </div>
      );
    } else {
      return (
        <div className="relative w-full h-40 overflow-hidden bg-slate-100">
          <img
            src={imgError ? fallbackImg : item.media_url}
            alt={item.title || 'Content'}
            onError={() => setImgError(true)}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      );
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group cursor-pointer rounded-lg overflow-hidden shadow-xs hover:shadow-md bg-white border border-slate-200/80 hover:border-primary/50 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-primary/40 flex flex-col"
    >
      <div className="relative overflow-hidden">
        {renderMedia()}

        {/* Hover preview indicator overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 text-white text-xs font-medium shadow-md backdrop-blur-xs transform group-hover:scale-105 transition-transform border border-white/20">
            <Eye className="w-3.5 h-3.5" />
            <span>Click to Preview</span>
          </span>
        </div>

        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          {renderPlatformIcons(item.platforms)}
        </div>
      </div>

      {item.title && (
        <div className="px-3 pt-2.5 pb-1 bg-white">
          <p className="text-xs font-semibold text-slate-800 truncate" title={item.title}>
            {item.title}
          </p>
        </div>
      )}

      <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-100 mt-auto flex flex-wrap justify-between items-center text-slate-600">
        <div className="flex items-center gap-1" title="Likes">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
          <span className="text-xs font-medium">{formatNumber(item.metrics?.likes || 0)}</span>
        </div>
        <div className="flex items-center gap-1" title="Views">
          <Eye className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-medium">{formatNumber(item.metrics?.views || 0)}</span>
        </div>
        <div className="flex items-center gap-1" title="Comments">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-medium">{formatNumber(item.metrics?.comments || 0)}</span>
        </div>
        <div className="flex items-center gap-1" title="Shares">
          <Share2 className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-xs font-medium">{formatNumber(item.metrics?.shares || 0)}</span>
        </div>
      </div>
    </div>
  );
};

const LoadingContentCard = () => {
  return (
    <div className="rounded-lg overflow-hidden shadow-xs border border-slate-200/80 bg-white">
      <Skeleton className="w-full h-40" />
      <div className="p-3 bg-white">
        <Skeleton className="h-4 w-3/4 mb-2" />
      </div>
      <div className="px-3 py-2.5 bg-slate-50 flex flex-wrap justify-between">
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-3.5 w-12" />
      </div>
    </div>
  );
};

const ServicesTabContent: React.FC<ServicesTabContentProps> = ({
  influencerId,
  influencerName,
}) => {
  const { contentItems, loading, error } = useServiceContent(influencerId);

  // Multi-select filter states
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  // Preview modal states
  const [previewItem, setPreviewItem] = useState<ServiceContentItem | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [pollVotedOption, setPollVotedOption] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const platformOptions = [
    { id: 'all', name: 'All Platforms' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'twitter', name: 'Twitter' },
  ];

  const serviceOptions = [
    { id: 'all', name: 'All Services' },
    { id: 'post', name: 'Post Image/Video' },
    { id: 'reels', name: 'Reels/Shorts' },
    { id: 'story', name: 'Story (Image/Video)' },
    { id: 'in-video', name: 'In-Video Promotion (<10 min)' },
    { id: 'promotions', name: 'Promotions (>10 min)' },
    { id: 'polls', name: 'Polls' },
    { id: 'visit-promote', name: 'Visit & Promote' },
  ];

  // Filter content items
  const filteredItems = useMemo(() => {
    return contentItems.filter((item) => {
      // Platform filter
      if (selectedPlatforms.length > 0 && !selectedPlatforms.includes('all')) {
        const matchesPlatform = item.platforms.some((p) => selectedPlatforms.includes(p));
        if (!matchesPlatform) return false;
      }

      // Service filter
      if (selectedServices.length > 0 && !selectedServices.includes('all')) {
        const matchesService = selectedServices.some((s) => {
          if (s === 'post' && (item.media_type === 'image' || item.media_type === 'video')) return true;
          if (s === 'reels' && item.media_type === 'video') return true;
          if (s === 'polls' && item.media_type === 'poll') return true;
          return true; // permissive fallback
        });
        if (!matchesService) return false;
      }

      return true;
    });
  }, [contentItems, selectedPlatforms, selectedServices]);

  // Current preview index for previous / next navigation
  const currentIndex = useMemo(() => {
    if (!previewItem) return -1;
    return filteredItems.findIndex((i) => i.id === previewItem.id);
  }, [previewItem, filteredItems]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredItems.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setPreviewItem(filteredItems[currentIndex - 1]);
      setIsPlayingVideo(false);
      setPollVotedOption(null);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setPreviewItem(filteredItems[currentIndex + 1]);
      setIsPlayingVideo(false);
      setPollVotedOption(null);
    }
  };

  // Keyboard navigation for preview modal
  useEffect(() => {
    if (!previewItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const curIdx = filteredItems.findIndex((i) => i.id === previewItem.id);
        if (curIdx > 0) {
          setPreviewItem(filteredItems[curIdx - 1]);
          setIsPlayingVideo(false);
          setPollVotedOption(null);
        }
      } else if (e.key === 'ArrowRight') {
        const curIdx = filteredItems.findIndex((i) => i.id === previewItem.id);
        if (curIdx >= 0 && curIdx < filteredItems.length - 1) {
          setPreviewItem(filteredItems[curIdx + 1]);
          setIsPlayingVideo(false);
          setPollVotedOption(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewItem, filteredItems]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    toast({
      title: 'Link Copied',
      description: 'Media preview link copied to clipboard.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error loading content: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Multi-select dropdown filters */}
      <div className="flex flex-wrap justify-end gap-3">
        {/* Platform Dropdown */}
        <div className="w-48">
          <Popover open={platformDropdownOpen} onOpenChange={setPlatformDropdownOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-9 text-xs sm:text-sm">
                <span className="truncate">
                  {selectedPlatforms.length > 0
                    ? `${selectedPlatforms.length} platform(s)`
                    : 'Select Platform'}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="end">
              <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                {platformOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 cursor-pointer text-xs"
                    onClick={() => {
                      if (option.id === 'all') {
                        setSelectedPlatforms(
                          selectedPlatforms.length === platformOptions.length - 1
                            ? []
                            : platformOptions.slice(1).map((p) => p.id)
                        );
                      } else {
                        if (selectedPlatforms.includes(option.id)) {
                          setSelectedPlatforms(selectedPlatforms.filter((p) => p !== option.id));
                        } else {
                          setSelectedPlatforms([...selectedPlatforms, option.id]);
                        }
                      }
                    }}
                  >
                    <Checkbox
                      checked={
                        option.id === 'all'
                          ? selectedPlatforms.length === platformOptions.length - 1
                          : selectedPlatforms.includes(option.id)
                      }
                      onCheckedChange={() => {}}
                    />
                    <span className="font-medium">{option.name}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Service Dropdown */}
        <div className="w-48">
          <Popover open={serviceDropdownOpen} onOpenChange={setServiceDropdownOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-9 text-xs sm:text-sm">
                <span className="truncate">
                  {selectedServices.length > 0
                    ? `${selectedServices.length} service(s)`
                    : 'Select Service'}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                {serviceOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 cursor-pointer text-xs"
                    onClick={() => {
                      if (option.id === 'all') {
                        setSelectedServices(
                          selectedServices.length === serviceOptions.length - 1
                            ? []
                            : serviceOptions.slice(1).map((s) => s.id)
                        );
                      } else {
                        if (selectedServices.includes(option.id)) {
                          setSelectedServices(selectedServices.filter((s) => s !== option.id));
                        } else {
                          setSelectedServices([...selectedServices, option.id]);
                        }
                      }
                    }}
                  >
                    <Checkbox
                      checked={
                        option.id === 'all'
                          ? selectedServices.length === serviceOptions.length - 1
                          : selectedServices.includes(option.id)
                      }
                      onCheckedChange={() => {}}
                    />
                    <span className="font-medium">{option.name}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          Array(9)
            .fill(0)
            .map((_, index) => <LoadingContentCard key={`loading-${index}`} />)
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center border rounded-xl bg-slate-50/50 p-6">
            <Eye className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-800">No content found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your filters to see more posts.</p>
            {(selectedPlatforms.length > 0 || selectedServices.length > 0) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => {
                  setSelectedPlatforms([]);
                  setSelectedServices([]);
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onClick={() => {
                setPreviewItem(item);
                setIsPlayingVideo(false);
                setPollVotedOption(null);
              }}
            />
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* Media Preview Modal Dialog (Lightbox) */}
      {/* ========================================================= */}
      <Dialog
        open={!!previewItem}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewItem(null);
            setIsPlayingVideo(false);
            setPollVotedOption(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-background border rounded-2xl shadow-2xl gap-0 max-h-[92vh] flex flex-col">
          <DialogTitle className="sr-only">
            {previewItem?.title || 'Post Preview'}
          </DialogTitle>

          {previewItem && (
            <>
              {/* Header */}
              <div className="py-3 px-4 sm:px-6 border-b flex items-center justify-between gap-3 bg-muted/20 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {(influencerName || 'I').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground truncate">
                        @{influencerName || 'influencer'}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px] py-0 px-1.5 font-semibold uppercase',
                          previewItem.media_type === 'video'
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200'
                            : previewItem.media_type === 'poll'
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200'
                            : 'bg-primary/10 text-primary border-primary/20'
                        )}
                      >
                        {previewItem.media_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {previewItem.title || 'Service Post Preview'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pr-8">
                  {/* Platforms */}
                  {renderPlatformIcons(previewItem.platforms)}

                  {/* Open / External button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Open media in new tab"
                    onClick={() => window.open(previewItem.media_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Theater Media Viewer */}
              <div className="relative bg-slate-950 flex items-center justify-center min-h-[300px] sm:min-h-[400px] max-h-[58vh] overflow-hidden select-none">
                {/* Previous Button */}
                {hasPrev && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous post"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-transform hover:scale-110 backdrop-blur-xs border border-white/20"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Next Button */}
                {hasNext && (
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next post"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-transform hover:scale-110 backdrop-blur-xs border border-white/20"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}

                {/* Media Presentation */}
                {previewItem.media_type === 'video' ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-5">
                    {isPlayingVideo ? (
                      <video
                        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                        poster={previewItem.media_url}
                        controls
                        autoPlay
                        className="max-h-[52vh] max-w-full rounded-lg object-contain shadow-2xl"
                      />
                    ) : (
                      <div className="relative group/video flex items-center justify-center max-h-[52vh] w-full">
                        <img
                          src={previewItem.media_url}
                          alt={previewItem.title || 'Video preview'}
                          className="max-h-[52vh] max-w-full rounded-lg object-contain opacity-95 shadow-2xl"
                        />
                        <button
                          type="button"
                          onClick={() => setIsPlayingVideo(true)}
                          className="absolute h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 border-2 border-white/30"
                          title="Play Video"
                        >
                          <Play className="h-8 w-8 fill-white ml-1" />
                        </button>
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white bg-black/75 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Youtube className="h-4 w-4 text-red-500" /> Click to play video preview
                          </span>
                          <span className="font-mono text-[11px] text-white/80">03:45 • HD</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : previewItem.media_type === 'poll' ? (
                  <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-2xl mx-4 my-6">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      <BarChart2 className="h-4 w-4" /> Community Poll
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                      {previewItem.title || 'Which content would you like to see next?'}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Option A: Full Review & In-depth Demo', pct: 64 },
                        { label: 'Option B: Quick Summary & Highlights', pct: 36 },
                      ].map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPollVotedOption(idx)}
                          className={cn(
                            'w-full text-left p-3.5 rounded-xl border relative overflow-hidden transition-all',
                            pollVotedOption === idx
                              ? 'border-primary bg-primary/20 ring-2 ring-primary/40'
                              : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                          )}
                        >
                          <div
                            className="absolute inset-y-0 left-0 bg-primary/30 transition-all duration-500"
                            style={{ width: `${opt.pct}%` }}
                          />
                          <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm font-medium">
                            <span className="flex items-center gap-2">
                              {pollVotedOption === idx && <Check className="h-3.5 w-3.5 text-primary" />}
                              {opt.label}
                            </span>
                            <span className="font-bold text-primary-foreground">{opt.pct}%</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-4 text-right">
                      Total votes: {formatNumber(previewItem.metrics.likes + 1200)}
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-3 sm:p-5">
                    <img
                      src={previewItem.media_url}
                      alt={previewItem.title || 'Post Preview'}
                      className="max-h-[52vh] max-w-full rounded-lg object-contain shadow-2xl"
                    />
                  </div>
                )}

                {/* Counter indicator pill */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white/90 text-[11px] font-medium border border-white/10">
                  {currentIndex + 1} of {filteredItems.length}
                </div>
              </div>

              {/* Details & Metrics Footer */}
              <div className="p-4 sm:p-5 bg-card space-y-4 shrink-0 overflow-y-auto max-h-[30vh]">
                {previewItem.description && (
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {previewItem.description}
                  </p>
                )}

                {/* Metrics 4-card strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl border bg-muted/20">
                    <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Likes</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        {formatNumber(previewItem.metrics?.likes || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl border bg-muted/20">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Views</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        {formatNumber(previewItem.metrics?.views || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl border bg-muted/20">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Comments</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        {formatNumber(previewItem.metrics?.comments || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl border bg-muted/20">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                      <Share2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Shares</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        {formatNumber(previewItem.metrics?.shares || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                  <div className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1.5">
                    <span>Tip: Use ← Left / Right → keys to navigate</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => handleCopyLink(previewItem.media_url)}
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => window.open(previewItem.media_url, '_blank')}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        setPreviewItem(null);
                        setIsPlayingVideo(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesTabContent;
