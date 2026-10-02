import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Download,
  Eye,
  ShieldCheck,
  MapPin,
  Gift,
  Utensils,
  Plane,
  Building2,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  BarChart,
  Tag,
  CreditCard,
  Compass,
  FileSpreadsheet,
  FileImage,
  File
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getStoredOrderById, updateStoredOrder } from '@/data/orders';
import { Order, OrderStatus } from '@/types/order';
import InfluencerProfileCard from '@/components/orders/place/InfluencerProfileCard';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [liveUrlInput, setLiveUrlInput] = useState('');
  const [selectedPlatformForUrl, setSelectedPlatformForUrl] = useState<'instagram' | 'facebook' | 'youtube' | 'twitter'>('instagram');

  // Load order data from store
  const order = id ? getStoredOrderById(id) : undefined;
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(order);

  if (!currentOrder) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't locate order with ID <span className="font-mono text-foreground">{id}</span>. It might have been removed or never created.
          </p>
          <Button onClick={() => navigate('/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const copyToClipboard = (text: string, type: 'id' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
      toast({
        title: 'Order ID Copied',
        description: 'Order reference copied to clipboard.',
      });
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast({
        title: 'Link Copied',
        description: 'Affiliate URL copied to clipboard.',
      });
    }
  };

  const handleSaveLiveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveUrlInput.trim()) return;

    try {
      new URL(liveUrlInput);
    } catch {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid social media URL (e.g., https://instagram.com/p/...)',
        variant: 'destructive',
      });
      return;
    }

    const updatedLinks = {
      ...(currentOrder.socialMediaLinks || {}),
      [selectedPlatformForUrl]: liveUrlInput.trim(),
    };

    const updatedOrder: Order = {
      ...currentOrder,
      socialMediaLinks: updatedLinks,
    };

    updateStoredOrder(updatedOrder);
    setCurrentOrder(updatedOrder);
    setLiveUrlInput('');
    toast({
      title: 'Post URL Saved',
      description: `Live ${selectedPlatformForUrl} post link recorded successfully.`,
    });
  };

  // Status configuration
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-300">Completed</Badge>;
      case 'pending_checkout':
        return <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-300">Pending Checkout</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/20 border-blue-300">In Review</Badge>;
      case 'rejected':
        return <Badge className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/20 border-rose-300">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Platform icon helper
  const getPlatformIcon = (platformName?: string) => {
    const p = (platformName || 'instagram').toLowerCase();
    if (p.includes('insta')) return <Instagram className="w-5 h-5 text-pink-600" />;
    if (p.includes('face')) return <Facebook className="w-5 h-5 text-blue-600" />;
    if (p.includes('you') || p.includes('yt')) return <Youtube className="w-5 h-5 text-red-600" />;
    if (p.includes('twit') || p.includes('x')) return <Twitter className="w-5 h-5 text-sky-500" />;
    if (p.includes('link')) return <Linkedin className="w-5 h-5 text-blue-700" />;
    return <Sparkles className="w-5 h-5 text-primary" />;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext || '')) {
      return <FileImage className="w-5 h-5 text-blue-500" />;
    }
    if (['pdf'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    }
    return <File className="w-5 h-5 text-muted-foreground" />;
  };

  // Check content type
  const isPollOrder =
    currentOrder.contentTypeName?.toLowerCase().includes('poll') ||
    currentOrder.content?.type === 'polls' ||
    currentOrder.productService?.toLowerCase().includes('poll') ||
    (currentOrder.content?.polls && currentOrder.content.polls.length > 0);

  const isVisitPromoteOrder =
    currentOrder.contentTypeName?.toLowerCase().includes('visit') ||
    currentOrder.content?.type === 'visit_promote' ||
    currentOrder.productService?.toLowerCase().includes('visit') ||
    Boolean(currentOrder.content?.visitDetails);

  // Default mock influencer if not in order
  const influencerProfile = currentOrder.influencer || {
    name: currentOrder.username || 'Gary Vaynerchuk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    category: currentOrder.category || 'Digital Marketing',
    location: 'New York, USA',
    verified: true,
    followers: [
      { platform: 'Instagram', value: '2.3M' },
      { platform: 'Facebook', value: '834K' },
      { platform: 'YouTube', value: '569K' },
      { platform: 'Twitter', value: '3.4M' },
    ],
  };

  const formattedInfluencerForCard = {
    avatar: influencerProfile.avatar,
    name: influencerProfile.name,
    category: influencerProfile.category,
    location: influencerProfile.location,
    followers: (influencerProfile.followers || [
      { platform: 'Instagram', value: '2.3M' },
      { platform: 'Facebook', value: '834K' },
      { platform: 'YouTube', value: '569K' },
      { platform: 'Twitter', value: '3.4M' },
    ]).map((f) => ({
      platform: f.platform,
      value: f.value,
      icon: getPlatformIcon(f.platform),
    })),
  };

  const pricing = currentOrder.pricing || {
    basePrice: currentOrder.amount ? Math.round(currentOrder.amount * 0.75) : 800,
    platformFee: 99,
    couponCode: 'WELCOME10',
    couponDiscount: 80,
    gst: currentOrder.amount ? Math.round(currentOrder.amount * 0.18) : 162,
    total: currentOrder.amount || 1061,
  };

  return (
    <Layout>
      <div className="flex-1 bg-muted/30 min-h-full pb-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
          {/* Breadcrumb & Navigation Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 bg-background shadow-sm hover:bg-muted"
                onClick={() => navigate('/orders')}
                aria-label="Back to orders"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Order Details</span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-foreground">
                    #{currentOrder.orderNumber}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentOrder.orderNumber, 'id')}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {getStatusBadge(currentOrder.status)}
                </div>
                <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
                  {currentOrder.productService || currentOrder.contentTypeName || 'Order Overview'}
                </h1>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/chats')}
                className="gap-2 bg-background shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Chat Influencer</span>
              </Button>

              {currentOrder.status === 'pending_checkout' && (
                <Button
                  size="sm"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  onClick={() => navigate('/checkout', { state: { order: currentOrder } })}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Checkout {formatCurrency(pricing.total)}</span>
                </Button>
              )}
            </div>
          </div>

          {/* Main Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Influencer Profile Card */}
              <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm bg-card">
                <InfluencerProfileCard influencer={formattedInfluencerForCard} />
              </div>

              {/* Selected Order Specifications */}
              <Card className="shadow-sm border-border/60">
                <CardHeader className="py-4 px-5 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div>
                      <CardTitle className="text-base font-semibold">Selected Order Specifications</CardTitle>
                      <p className="text-xs text-muted-foreground">Order classification, format, channel and publishing schedule</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Order Type */}
                    <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
                      <span className="text-xs font-medium text-muted-foreground block mb-1">Order Type</span>
                      <span className="text-sm font-semibold text-foreground">
                        {currentOrder.orderType || 'Platform Based'}
                      </span>
                    </div>

                    {/* Content Format */}
                    <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
                      <span className="text-xs font-medium text-muted-foreground block mb-1">Content Format</span>
                      <span className="text-sm font-semibold text-foreground">
                        {currentOrder.contentTypeName || currentOrder.productService || 'Post Image/Video'}
                      </span>
                    </div>

                    {/* Target Platform */}
                    <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
                      <span className="text-xs font-medium text-muted-foreground block mb-1">Platform</span>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(currentOrder.platform)}
                        <span className="text-sm font-semibold capitalize text-foreground">
                          {currentOrder.platform || 'Instagram'}
                        </span>
                      </div>
                    </div>

                    {/* Schedule Date & Time */}
                    <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
                      <span className="text-xs font-medium text-muted-foreground block mb-1">Scheduled Schedule</span>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span>
                          {currentOrder.scheduledDate
                            ? `${currentOrder.scheduledDate} ${currentOrder.scheduledTime || ''}`
                            : 'Immediate / ASAP'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Affiliate Link Row (if available) */}
                  {currentOrder.affiliateLink && (
                    <div className="p-4 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          Affiliate / Tracking Link
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100/60"
                            onClick={() => copyToClipboard(currentOrder.affiliateLink || '', 'link')}
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                            {copiedLink ? 'Copied' : 'Copy Link'}
                          </Button>
                          <a
                            href={currentOrder.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center h-7 px-2 text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100/60 rounded"
                          >
                            Visit <ExternalLink className="w-3.5 h-3.5 ml-1" />
                          </a>
                        </div>
                      </div>
                      <p className="text-xs font-mono break-all text-blue-900 dark:text-blue-200">
                        {currentOrder.affiliateLink}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dynamic Content: POLLS */}
              {isPollOrder && (
                <Card className="shadow-sm border-border/60">
                  <CardHeader className="py-4 px-5 border-b border-border/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-muted/40 dark:to-muted/20">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <BarChart className="w-5 h-5" />
                      </span>
                      <div>
                        <CardTitle className="text-base font-semibold">Poll Questions & Options</CardTitle>
                        <p className="text-xs text-muted-foreground">The community engagement poll configured for this campaign</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-6">
                    {(currentOrder.content?.polls && currentOrder.content.polls.length > 0
                      ? currentOrder.content.polls
                      : [
                          {
                            id: 'p1',
                            question: "Which product feature would you love to see released next?",
                            options: [
                              'Automated Influencer Analytics',
                              'Multi-Platform Cross Posting',
                              'Instant Escrow Payouts',
                              'AI Caption & Reel Generator',
                            ],
                          },
                        ]
                    ).map((poll, idx) => (
                      <div key={poll.id || idx} className="rounded-xl border border-border/70 p-4 bg-background shadow-xs space-y-3">
                        <div className="flex items-start gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground">
                              {poll.question || 'Untitled Question'}
                            </h4>
                          </div>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                          {poll.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                            >
                              <div className="w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </div>
                              <span className="text-xs font-medium text-foreground">{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Dynamic Content: VISIT & PROMOTE */}
              {isVisitPromoteOrder && (
                <Card className="shadow-sm border-border/60">
                  <CardHeader className="py-4 px-5 border-b border-border/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 dark:from-muted/40 dark:to-muted/20">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <MapPin className="w-5 h-5" />
                      </span>
                      <div>
                        <CardTitle className="text-base font-semibold">Visit & Promote Campaign Specifications</CardTitle>
                        <p className="text-xs text-muted-foreground">Comprehensive venue, schedule, and on-site hospitality arrangements</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-6">
                    {/* Section 1: Basic Visit Details */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        1. Visit Schedule & Timing
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                        <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                          <span className="text-xs text-muted-foreground block mb-1">Preferred Dates</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {(currentOrder.content?.visitDetails?.preferredDates && currentOrder.content.visitDetails.preferredDates.length > 0
                              ? currentOrder.content.visitDetails.preferredDates
                              : ['2026-10-15', '2026-10-16', '2026-10-17']
                            ).map((d, i) => (
                              <Badge key={i} variant="outline" className="bg-background text-xs font-normal">
                                <Calendar className="w-3 h-3 mr-1 text-primary" />
                                {d}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                          <span className="text-xs text-muted-foreground block mb-1">Preferred Time Window</span>
                          <span className="text-sm font-semibold text-foreground">
                            {currentOrder.content?.visitDetails?.timeSlot || '11:00 AM - 03:00 PM (Flexible)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 2: Venue & Location */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        2. Venue & Location Details
                      </h4>
                      <div className="p-4 rounded-lg border border-border/60 bg-muted/20 ml-6 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-sm font-semibold text-foreground block">
                              {currentOrder.content?.visitDetails?.venueName || 'Flagship Experience Store'}
                            </span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {currentOrder.content?.visitDetails?.fullAddress ||
                                'Plot 142, Linking Road, Khar West, Mumbai, Maharashtra 400052'}
                            </p>
                            {currentOrder.content?.visitDetails?.landmarkInfo && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium text-foreground">Landmark:</span> {currentOrder.content.visitDetails.landmarkInfo}
                              </p>
                            )}
                          </div>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(
                              currentOrder.content?.visitDetails?.fullAddress || 'Mumbai, Maharashtra'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-background border border-border/70 rounded-md hover:bg-muted shadow-xs transition-colors shrink-0"
                          >
                            <Compass className="w-3.5 h-3.5 text-primary" />
                            Open Map
                          </a>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 3: Hospitality & Perks */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Gift className="w-4 h-4 text-primary" />
                        3. Hospitality & Creator Perks
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-6">
                        {/* Food */}
                        <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-start gap-2.5">
                          <Utensils className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold block text-foreground">Food & Refreshments</span>
                            <span className="text-xs text-muted-foreground">
                              {currentOrder.content?.visitDetails?.foodProvided || currentOrder.content?.visitDetails?.offers?.food
                                ? currentOrder.content?.visitDetails?.foodDetails || 'Complimentary VIP catering & refreshments'
                                : 'Not Included'}
                            </span>
                          </div>
                        </div>

                        {/* Travel */}
                        <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-start gap-2.5">
                          <Plane className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold block text-foreground">Travel Allowance</span>
                            <span className="text-xs text-muted-foreground">
                              {currentOrder.content?.visitDetails?.travelReimbursement || currentOrder.content?.visitDetails?.offers?.travel
                                ? currentOrder.content?.visitDetails?.travelAmount
                                  ? `Reimbursed up to ${currentOrder.content.visitDetails.travelAmount}`
                                  : 'Arranged & reimbursed by brand'
                                : 'Not Included'}
                            </span>
                          </div>
                        </div>

                        {/* Stay */}
                        <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-start gap-2.5">
                          <Building2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold block text-foreground">Hotel / Stay</span>
                            <span className="text-xs text-muted-foreground">
                              {currentOrder.content?.visitDetails?.stayProvided || currentOrder.content?.visitDetails?.offers?.stay
                                ? currentOrder.content?.visitDetails?.stayDetails || '4-star hotel stay accommodated'
                                : 'Not Required / Local'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Other perks / gifts */}
                      {(currentOrder.content?.visitDetails?.giftsVouchers || currentOrder.content?.visitDetails?.otherPerks) && (
                        <div className="p-3 rounded-lg border border-border/60 bg-muted/20 ml-6 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground mr-1">Special Goodies & Vouchers:</span>
                          {currentOrder.content.visitDetails.giftsVouchers || currentOrder.content.visitDetails.otherPerks}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Section 4: Content Expectations */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        4. Deliverables & Promotion Guidelines
                      </h4>
                      <div className="p-4 rounded-lg border border-border/60 bg-muted/20 ml-6 space-y-3 text-xs">
                        {currentOrder.content?.visitDetails?.contentDescription && (
                          <div>
                            <span className="font-semibold text-foreground block mb-0.5">Expectations:</span>
                            <p className="text-muted-foreground leading-relaxed">
                              {currentOrder.content.visitDetails.contentDescription}
                            </p>
                          </div>
                        )}
                        {currentOrder.content?.visitDetails?.hashtags && (
                          <div>
                            <span className="font-semibold text-foreground block mb-0.5">Required Hashtags:</span>
                            <p className="text-primary font-mono">{currentOrder.content.visitDetails.hashtags}</p>
                          </div>
                        )}
                        {currentOrder.content?.visitDetails?.handlesToTag && (
                          <div>
                            <span className="font-semibold text-foreground block mb-0.5">Accounts to Tag:</span>
                            <p className="text-foreground font-mono">{currentOrder.content.visitDetails.handlesToTag}</p>
                          </div>
                        )}
                        {currentOrder.content?.visitDetails?.specialGuidelines && (
                          <div>
                            <span className="font-semibold text-foreground block mb-0.5">Special Guidelines:</span>
                            <p className="text-muted-foreground">{currentOrder.content.visitDetails.specialGuidelines}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Standard Content Details: Brief, Files, Notes */}
              <Card className="shadow-sm border-border/60">
                <CardHeader className="py-4 px-5 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div>
                      <CardTitle className="text-base font-semibold">Content Brief & Requirements</CardTitle>
                      <p className="text-xs text-muted-foreground">Creative guidelines, campaign assets, and creator notes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-6">
                  {/* Description / Creative Brief */}
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                      Campaign Description & Instructions
                    </Label>
                    <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-sm leading-relaxed text-foreground whitespace-pre-line">
                      {currentOrder.content?.description ||
                        'Create engaging content showcasing our new product launch. Emphasize organic aesthetics, natural lighting, and customer testimonial value. End with a strong call-to-action inviting followers to click the profile link.'}
                    </div>
                  </div>

                  {/* Attached Reference Files */}
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                      Attached Media & Reference Files
                    </Label>
                    {currentOrder.content?.files && currentOrder.content.files.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentOrder.content.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-background hover:bg-muted/40 transition-colors shadow-xs"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="p-2 rounded-md bg-muted shrink-0">
                                {getFileIcon(file.name)}
                              </span>
                              <div className="truncate">
                                <span className="text-xs font-medium text-foreground block truncate" title={file.name}>
                                  {file.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {file.size} • {file.type || 'Document'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              {file.url && file.url !== '#' && (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
                                  title="View file"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              )}
                              <a
                                href={file.url || '#'}
                                download={file.name}
                                className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
                                title="Download file"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground">
                        No reference files uploaded for this order request.
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  {currentOrder.notes && (
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                        Creator Notes & Considerations
                      </Label>
                      <div className="p-3.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200">
                        {currentOrder.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Lifecycle Timeline */}
              <Card className="shadow-sm border-border/60">
                <CardHeader className="py-4 px-5 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock className="w-5 h-5" />
                    </span>
                    <div>
                      <CardTitle className="text-base font-semibold">Order Fulfillment Progress</CardTitle>
                      <p className="text-xs text-muted-foreground">Real-time status updates throughout the production cycle</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {(currentOrder.timeline && currentOrder.timeline.length > 0
                      ? currentOrder.timeline
                      : [
                          {
                            step: 'Order Submitted',
                            timestamp: 'Just now',
                            status: 'completed',
                            description: 'Order details and requirements submitted to influencer.',
                          },
                          {
                            step: 'Payment in Escrow',
                            timestamp: currentOrder.status === 'pending_checkout' ? 'Pending' : 'Completed',
                            status: currentOrder.status === 'pending_checkout' ? 'current' : 'completed',
                            description: 'Funds secured in platform escrow protection.',
                          },
                          {
                            step: 'Influencer Review & Approval',
                            timestamp: 'Upcoming',
                            status: 'upcoming',
                            description: 'Influencer reviews guidelines and accepts the campaign.',
                          },
                          {
                            step: 'Content Creation & Review',
                            timestamp: 'Upcoming',
                            status: 'upcoming',
                            description: 'Draft content created and submitted for brand approval.',
                          },
                          {
                            step: 'Published & Live Verification',
                            timestamp: 'Upcoming',
                            status: 'upcoming',
                            description: 'Post goes live on the influencer’s verified social channel.',
                          },
                          {
                            step: 'Completed & Escrow Released',
                            timestamp: 'Upcoming',
                            status: 'upcoming',
                            description: 'Final metrics verified and creator payment released.',
                          },
                        ]
                    ).map((item, idx) => {
                      const isCompleted = item.status === 'completed';
                      const isCurrent = item.status === 'current';
                      return (
                        <div key={idx} className="relative flex items-start gap-4">
                          <span
                            className={cn(
                              'absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-background',
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-primary text-primary-foreground animate-pulse'
                                : 'bg-muted text-muted-foreground border border-border'
                            )}
                          >
                            {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h5 className={cn('text-xs font-semibold', isCurrent ? 'text-primary' : 'text-foreground')}>
                                {item.step}
                              </h5>
                              {item.timestamp && (
                                <span className="text-[11px] text-muted-foreground">{item.timestamp}</span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column (4 Columns): Summary, Escrow, Live Links */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pricing & Order Summary Card */}
              <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm bg-card">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                  <h3 className="text-sm font-semibold tracking-tight">Order Financial Summary</h3>
                  <p className="text-xs text-white/80">Breakdown of pricing, fees and escrow deposit</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Package Base Price</span>
                      <span className="font-medium text-foreground">{formatCurrency(pricing.basePrice)}</span>
                    </div>

                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Platform Service Fee</span>
                      <span className="font-medium text-foreground">{formatCurrency(pricing.platformFee)}</span>
                    </div>

                    {pricing.couponDiscount > 0 && (
                      <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Coupon Discount {pricing.couponCode && `(${pricing.couponCode})`}
                        </span>
                        <span className="font-semibold">-{formatCurrency(pricing.couponDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>GST (18%)</span>
                      <span className="font-medium text-foreground">{formatCurrency(pricing.gst)}</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-sm font-semibold text-foreground">Total Amount</span>
                      <span className="text-xl font-bold text-foreground">
                        {formatCurrency(pricing.total)}
                      </span>
                    </div>
                  </div>

                  {currentOrder.status === 'pending_checkout' ? (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
                      onClick={() => navigate('/checkout', { state: { order: currentOrder } })}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-center">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Payment Verified & Secured
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 100% Escrow Protection Guarantee */}
              <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/10 p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                      100% Escrow Protection
                    </h4>
                    <p className="text-xs text-emerald-800/85 dark:text-emerald-300/80 mt-1 leading-relaxed">
                      Your funds are held securely by InfluexKonnect Escrow and will only be released to the creator once the content is published and verified according to your guidelines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Social Media Post Submission & Links */}
              <Card className="shadow-sm border-border/60">
                <CardHeader className="py-4 px-5 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Share2 className="w-5 h-5" />
                    </span>
                    <div>
                      <CardTitle className="text-base font-semibold">Live Social Media Post</CardTitle>
                      <p className="text-xs text-muted-foreground">Tracking links to the live published content</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {/* Current Active Links */}
                  <div className="space-y-2">
                    {Object.entries(currentOrder.socialMediaLinks || {}).filter(([_, url]) => Boolean(url)).length > 0 ? (
                      Object.entries(currentOrder.socialMediaLinks || {})
                        .filter(([_, url]) => Boolean(url))
                        .map(([plat, url]) => (
                          <div
                            key={plat}
                            className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              {getPlatformIcon(plat)}
                              <span className="text-xs font-medium capitalize text-foreground">{plat}</span>
                            </div>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              View Post <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        No published live post URLs recorded yet.
                      </p>
                    )}
                  </div>

                  {/* Add / Update Live URL Form */}
                  <Separator />
                  <form onSubmit={handleSaveLiveUrl} className="space-y-3 pt-1">
                    <Label className="text-xs font-semibold text-foreground">Record Live Post URL</Label>
                    <div className="flex gap-2">
                      <select
                        aria-label="Social platform"
                        className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        value={selectedPlatformForUrl}
                        onChange={(e) => setSelectedPlatformForUrl(e.target.value as any)}
                      >
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="youtube">YouTube</option>
                        <option value="twitter">Twitter</option>
                      </select>
                      <Input
                        type="url"
                        placeholder="https://..."
                        className="text-xs h-8 flex-1"
                        value={liveUrlInput}
                        onChange={(e) => setLiveUrlInput(e.target.value)}
                      />
                    </div>
                    <Button type="submit" variant="secondary" size="sm" className="w-full text-xs h-8">
                      Save Live Post Link
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Support & Assistance Card */}
              <div className="p-4 rounded-xl border border-border/60 bg-card shadow-xs text-center space-y-2">
                <HelpCircle className="w-6 h-6 text-muted-foreground mx-auto" />
                <h5 className="text-xs font-semibold text-foreground">Need help with this order?</h5>
                <p className="text-[11px] text-muted-foreground">
                  Our 24/7 Concierge Support is ready to assist with creator communications, revisions, or refunds.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8 mt-1"
                  onClick={() => navigate('/support')}
                >
                  Open Support Ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
