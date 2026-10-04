import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  MoreVertical,
  Edit,
  X,
  Copy,
  Check,
  FileText,
  Upload,
  Download,
  Eye,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  BarChart,
  Tag,
  Compass,
  Gift,
  Utensils,
  Plane,
  Building2,
  Users,
  CalendarDays,
  FileImage,
  FileSpreadsheet,
  File,
  CheckCircle2,
  Trash2,
  Plus,
  ChevronDown,
  Briefcase,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getStoredOrderById, updateStoredOrder } from '@/data/orders';
import { Order, OrderStatus, SocialMediaLinks, SocialMediaUsernames, PollQuestion, VisitDetails } from '@/types/order';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load order data from store
  const initialOrder = id ? getStoredOrderById(id) : undefined;
  const [order, setOrder] = useState<Order | undefined>(initialOrder);

  // Modify mode states
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [modifyAmount, setModifyAmount] = useState<string>(
    initialOrder?.amount ? String(initialOrder.amount) : '0'
  );
  const [modifyDate, setModifyDate] = useState<string>(initialOrder?.scheduledDate || '');
  const [modifyTime, setModifyTime] = useState<string>(initialOrder?.scheduledTime || '');

  // Polls state (for editable/viewable polls)
  const initialPolls: PollQuestion[] =
    initialOrder?.content?.polls && initialOrder.content.polls.length > 0
      ? initialOrder.content.polls
      : [
          {
            id: '1',
            question: 'Which style should lead our upcoming winter collection drop?',
            options: ['Oversized Trench Coat', 'Cropped Puffer Jacket', 'Wool Blend Knitwear', 'Layered Streetwear Look'],
          },
        ];
  const [polls, setPolls] = useState<PollQuestion[]>(initialPolls);
  const [expandedPolls, setExpandedPolls] = useState<Record<string, boolean>>({
    '1': true,
    'p1': true,
    'p2': true,
  });

  // Visit details state
  const initialVisit: VisitDetails = initialOrder?.content?.visitDetails || {
    preferredDates: ['2026-10-22', '2026-10-23'],
    timeSlot: 'Flexible',
    venueName: 'Flagship Retail Experience Center',
    fullAddress: 'Shop 12-16, Phoenix Palladium, High Street Phoenix, Lower Parel, Mumbai 400013',
    landmarkInfo: 'Grand Atrium, Level 1 next to Apple Store',
    travelReimbursement: true,
    travelAmount: '₹2,000',
    foodProvided: true,
    foodDetails: 'Complimentary lunch & refreshments at Palladium Cafe',
    stayProvided: false,
    stayDetails: '',
    contentDescription: '1 Store Tour Reel (60s) showing walkthrough and top 3 must-buy products. 3 Instagram Stories with countdown and store location sticker.',
    hashtags: '#StoreLaunch #MumbaiShopping #ExperienceStore #GrandOpening',
    handlesToTag: '@retailhub_official @phoenixpalladium',
    specialGuidelines: 'Highlight the custom personalization station where shoppers can customize their initials.',
  };
  const [visitData, setVisitData] = useState<VisitDetails>(initialVisit);
  const [expandedVisitSections, setExpandedVisitSections] = useState({
    basicInfo: true,
    location: true,
    offers: true,
    content: true,
    notes: true,
  });

  // Social media usernames and links state
  const defaultHandle = (initialOrder?.username || 'sarahjohnson').toLowerCase().replace(/\s+/g, '');
  const [socialUsernames, setSocialUsernames] = useState<SocialMediaUsernames>(
    initialOrder?.socialMediaUsernames || {
      instagram: `@${defaultHandle}`,
      facebook: `${defaultHandle}.official`,
      youtube: `@${defaultHandle}`,
      twitter: `@${defaultHandle}`,
    }
  );
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinks>(
    initialOrder?.socialMediaLinks || {}
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSavingLinks, setIsSavingLinks] = useState(false);

  if (!order) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't locate order with ID <span className="font-mono text-foreground">{id}</span>.
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

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy, HH:mm');
    } catch {
      return dateStr;
    }
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    toast({
      title: 'Order ID Copied',
      description: 'Order reference copied to clipboard.',
    });
  };

  const copyAffiliateLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    toast({
      title: 'Link Copied',
      description: 'Affiliate URL copied to clipboard.',
    });
  };

  const isValidUrl = (url?: string): boolean => {
    if (!url || !url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const copyToClipboard = (text: string, label: string, key: string) => {
    if (!text || !text.trim()) {
      toast({
        title: 'Nothing to Copy',
        description: `Please enter a ${label.toLowerCase()} first.`,
        variant: 'destructive',
      });
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast({
      title: `${label} Copied`,
      description: `${text} copied to clipboard.`,
    });
  };

  const handleUsernameChange = (platform: keyof SocialMediaUsernames, value: string) => {
    setSocialUsernames((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleSocialMediaChange = (platform: keyof SocialMediaLinks, value: string) => {
    setSocialMediaLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleSaveSocialLinks = () => {
    setIsSavingLinks(true);
    const updatedOrder: Order = {
      ...order,
      socialMediaLinks,
      socialMediaUsernames: socialUsernames,
      updatedAt: new Date().toISOString(),
    };
    updateStoredOrder(updatedOrder);
    setOrder(updatedOrder);
    setTimeout(() => {
      setIsSavingLinks(false);
      toast({
        title: 'Social Media Saved',
        description: 'Usernames and post links updated successfully.',
      });
    }, 400);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { order } });
  };

  const handleModifyClick = () => {
    setModifyAmount(order.amount ? String(order.amount) : '0');
    setModifyDate(order.scheduledDate || '');
    setModifyTime(order.scheduledTime || '');
    setIsModifyMode(true);
  };

  const handleCancelModify = () => {
    setIsModifyMode(false);
    setModifyAmount(order.amount ? String(order.amount) : '0');
    setModifyDate(order.scheduledDate || '');
    setModifyTime(order.scheduledTime || '');
  };

  const handleSaveModify = () => {
    const updatedOrder: Order = {
      ...order,
      amount: parseFloat(modifyAmount) || order.amount,
      scheduledDate: modifyDate || order.scheduledDate,
      scheduledTime: modifyTime || order.scheduledTime,
      content: {
        ...(order.content || { type: 'provided_content' }),
        polls: isPollOrder ? polls : order.content?.polls,
        visitDetails: isVisitPromoteOrder ? visitData : order.content?.visitDetails,
      },
      updatedAt: new Date().toISOString(),
    };
    updateStoredOrder(updatedOrder);
    setOrder(updatedOrder);
    setIsModifyMode(false);
    toast({
      title: 'Order Modified',
      description: 'Order details updated successfully.',
    });
  };

  const handleRejectClick = () => {
    const updatedOrder: Order = {
      ...order,
      status: 'rejected' as OrderStatus,
      updatedAt: new Date().toISOString(),
    };
    updateStoredOrder(updatedOrder);
    setOrder(updatedOrder);
    toast({
      title: 'Order Rejected',
      description: `Order #${order.orderNumber} has been rejected.`,
      variant: 'destructive',
    });
  };

  // Poll management helpers
  const togglePollExpansion = (pollId: string) => {
    setExpandedPolls((prev) => ({
      ...prev,
      [pollId]: !prev[pollId],
    }));
  };

  const updatePollQuestion = (pollId: string, question: string) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, question } : p))
    );
  };

  const updatePollOption = (pollId: string, optionIndex: number, value: string) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p;
        const newOptions = [...p.options];
        newOptions[optionIndex] = value;
        return { ...p, options: newOptions };
      })
    );
  };

  const addPollQuestion = () => {
    if (polls.length >= 3) return;
    const newId = Date.now().toString();
    const newPoll: PollQuestion = {
      id: newId,
      question: '',
      options: ['', '', '', ''],
    };
    setPolls((prev) => [...prev, newPoll]);
    setExpandedPolls((prev) => ({ ...prev, [newId]: true }));
  };

  const removePollQuestion = (pollId: string) => {
    if (polls.length <= 1) return;
    setPolls((prev) => prev.filter((p) => p.id !== pollId));
  };

  // Visit details helpers
  const toggleVisitSection = (section: keyof typeof expandedVisitSections) => {
    setExpandedVisitSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleVisitChange = (field: keyof VisitDetails, value: any) => {
    setVisitData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-[#E7F7ED] text-[#15803D] hover:bg-[#E7F7ED] border-0 rounded-full px-3 py-0.5 text-xs font-normal">
            Completed
          </Badge>
        );
      case 'pending_checkout':
        return (
          <Badge className="bg-[#FFF4ED] text-[#D97706] hover:bg-[#FFF4ED] border-0 rounded-full px-3 py-0.5 text-xs font-normal">
            Processing
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] border-0 rounded-full px-3 py-0.5 text-xs font-normal">
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEF2F2] border-0 rounded-full px-3 py-0.5 text-xs font-normal">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-[#FFF4ED] text-[#D97706] hover:bg-[#FFF4ED] border-0 rounded-full px-3 py-0.5 text-xs font-normal capitalize">
            {status}
          </Badge>
        );
    }
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

  const getPlatformIcon = (platformName?: string) => {
    const p = (platformName || 'instagram').toLowerCase();
    if (p.includes('insta')) return <Instagram className="w-4 h-4 text-pink-500" />;
    if (p.includes('face')) return <Facebook className="w-4 h-4 text-blue-600" />;
    if (p.includes('you') || p.includes('yt')) return <Youtube className="w-4 h-4 text-red-600" />;
    if (p.includes('twit') || p.includes('x')) return <Twitter className="w-4 h-4 text-sky-500" />;
    return <FileText className="w-4 h-4 text-primary" />;
  };

  const influencer = order.influencer || {
    name: order.username || 'Rohan Mehra',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    category: order.category || 'Retail & Hospitality',
    location: 'Mumbai, India',
    followers: [
      { platform: 'Instagram', value: '890K' },
      { platform: 'Facebook', value: '180K' },
      { platform: 'YouTube', value: '420K' },
      { platform: 'Twitter', value: '110K' },
    ],
  };

  const influencerFollowers =
    influencer.followers && influencer.followers.length > 0
      ? influencer.followers.map((f) => ({
          platform: f.platform,
          value: f.value,
          icon: getPlatformIcon(f.platform),
        }))
      : [
          { platform: 'Instagram', value: '890K', icon: <Instagram className="w-4 h-4 text-pink-500" /> },
          { platform: 'Facebook', value: '180K', icon: <Facebook className="w-4 h-4 text-blue-600" /> },
          { platform: 'YouTube', value: '420K', icon: <Youtube className="w-4 h-4 text-red-600" /> },
          { platform: 'Twitter', value: '110K', icon: <Twitter className="w-4 h-4 text-sky-500" /> },
        ];

  const pricing = order.pricing || {
    basePrice: order.amount ? Math.round((order.amount - 99) / 1.18) : 800,
    platformFee: 99,
    collaborateFee: order.collaborateFee || 0,
    couponDiscount: 0,
    gst: order.amount ? Math.round(((order.amount - 99) / 1.18) * 0.18) : 162,
    total: order.amount || 1061,
  };

  // Content type checks
  const isPollOrder =
    order.contentTypeName?.toLowerCase().includes('poll') ||
    order.content?.type === 'polls' ||
    order.productService?.toLowerCase().includes('poll') ||
    Boolean(order.content?.polls && order.content.polls.length > 0);

  const isVisitPromoteOrder =
    order.contentTypeName?.toLowerCase().includes('visit') ||
    order.content?.type === 'visit_promote' ||
    order.productService?.toLowerCase().includes('visit') ||
    Boolean(order.content?.visitDetails);

  const isServiceOrder =
    order.orderType === 'Service' ||
    order.orderType === 'Service Order' ||
    order.orderType === 'service' ||
    order.contentTypeName === 'Service' ||
    order.contentTypeName === 'Service Request' ||
    order.content?.type === 'service_request' ||
    Boolean(order.serviceDetails);

  return (
    <Layout>
      <div className="flex-1 bg-background min-h-full pb-16">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
          {/* Header Row matching Image 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:bg-muted"
                onClick={() => navigate('/orders')}
                aria-label="Back to orders"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Order Details</h1>
            </div>

            <div className="flex items-center gap-2">
              {order.status === 'pending_checkout' && (
                <Button
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center gap-2 font-medium px-4 shadow-xs"
                  onClick={handleCheckout}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Checkout
                </Button>
              )}

              {/* Three dots dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-border/80 shadow-xs"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={handleModifyClick} className="cursor-pointer">
                    <Edit className="w-4 h-4 mr-2" />
                    Modify
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleRejectClick}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Modification Bar (when Modify is clicked) */}
          {isModifyMode && (
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Edit className="w-4 h-4 text-primary" />
                <span className="font-medium">Modify Order Mode:</span>
                <span className="text-muted-foreground text-xs">
                  Update price, schedule, or content requirements, then click Save Changes.
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button variant="outline" size="sm" onClick={handleCancelModify}>
                  <X className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveModify} className="bg-primary text-primary-foreground">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Top 2 Cards Grid: Order Information & (Influencer Details + Price Breakdown) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 items-start">
            {/* Card 1: Order Information (Slightly increased height & comfortable spacing) */}
            <Card className="shadow-xs border-border/70 rounded-xl">
              <CardHeader className="pb-3 pt-5 px-6">
                <CardTitle className="text-base font-semibold text-foreground">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-5 space-y-3.5 text-sm">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground font-normal">Order ID:</span>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <span className="font-mono">ORD-{order.orderNumber}</span>
                    <button
                      type="button"
                      onClick={copyOrderNumber}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy Order ID"
                    >
                      {copiedId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground font-normal">Status:</span>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground font-normal">Order Type:</span>
                  <span className="font-medium text-foreground">
                    {order.orderType || 'Platform Based'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground font-normal">
                    {isServiceOrder ? 'Service Requested:' : 'Content Type:'}
                  </span>
                  <span className="font-medium text-foreground">
                    {order.serviceDetails?.serviceName || order.contentTypeName || order.productService || 'Post Image/Video'}
                  </span>
                </div>

                {isServiceOrder ? (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground font-normal">Category:</span>
                    <span className="font-medium text-foreground">
                      {order.serviceDetails?.category || order.category || 'Design Services'}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground font-normal">Platforms:</span>
                    <div className="flex items-center gap-1.5 font-medium text-foreground capitalize">
                      {getPlatformIcon(order.platform)}
                      <span>{order.platform || 'Instagram'}</span>
                    </div>
                  </div>
                )}

                {isServiceOrder && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground font-normal">Support Review:</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-0 rounded-full px-2.5 py-0.5 text-xs font-normal">
                      {order.serviceDetails?.supportStatusDisplay || order.supportStatus || 'Quote Ready'}
                    </Badge>
                  </div>
                )}

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground font-normal">Order Date & Time:</span>
                  <span className="font-medium text-foreground">{formatDateTime(order.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground font-normal">
                    {isServiceOrder ? 'Estimated Delivery:' : 'Scheduled Date & Time:'}
                  </span>
                  {isModifyMode ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        className="w-32 h-8 text-xs"
                        value={modifyDate}
                        onChange={(e) => setModifyDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        className="w-24 h-8 text-xs"
                        value={modifyTime}
                        onChange={(e) => setModifyTime(e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className="font-medium text-foreground">
                      {order.serviceDetails?.estimatedDeliveryDate || order.scheduledDate
                        ? `${order.serviceDetails?.estimatedDeliveryDate || order.scheduledDate} ${order.scheduledTime || ''}`
                        : 'Within 1 week'}
                    </span>
                  )}
                </div>

                {order.includeCollaborate && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground font-normal">Collaborate:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Included (+{formatCurrency(order.collaborateFee || pricing.collaborateFee)})
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Side: Influencer or Support Desk Details & Price Breakdown */}
            <div className="flex flex-col gap-3">
              {/* Card 2: Influencer or Support Desk Details */}
              <Card className="shadow-xs border-border/70 rounded-xl">
                <CardHeader className="pb-1.5 pt-3.5 px-5">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {isServiceOrder ? 'Assigned Support Specialist' : 'Influencer Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-3 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={isServiceOrder ? (order.serviceDetails?.assignedSpecialist?.avatar || influencer.avatar) : influencer.avatar}
                      alt={isServiceOrder ? (order.serviceDetails?.assignedSpecialist?.name || 'Support Specialist') : influencer.name}
                      className="w-9 h-9 rounded-full object-cover border border-border/70 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs text-foreground truncate">
                        {isServiceOrder ? (order.serviceDetails?.assignedSpecialist?.name || 'Alex Johnson') : influencer.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {isServiceOrder
                          ? (order.serviceDetails?.assignedSpecialist?.role || 'Senior Creative Lead • Support Desk')
                          : `${influencer.category} • ${influencer.location}`}
                      </p>
                    </div>
                  </div>

                  {/* Profile / Specialist Metrics */}
                  <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                    {isServiceOrder ? (
                      <>
                        <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-muted/30 border border-border/60 text-center">
                          <span className="text-[10px] text-muted-foreground">Projects</span>
                          <span className="text-[11px] font-bold text-foreground">450+</span>
                        </div>
                        <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-muted/30 border border-border/60 text-center">
                          <span className="text-[10px] text-muted-foreground">Rating</span>
                          <span className="text-[11px] font-bold text-emerald-600">4.9 ★</span>
                        </div>
                        <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-muted/30 border border-border/60 text-center">
                          <span className="text-[10px] text-muted-foreground">Turnaround</span>
                          <span className="text-[11px] font-bold text-foreground">3 Days</span>
                        </div>
                        <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-muted/30 border border-border/60 text-center">
                          <span className="text-[10px] text-muted-foreground">Status</span>
                          <span className="text-[11px] font-bold text-primary">Active</span>
                        </div>
                      </>
                    ) : (
                      influencerFollowers.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-lg bg-muted/30 border border-border/60 hover:bg-muted/50 transition-colors text-center"
                          title={item.platform}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <span className="text-[11px] font-bold text-foreground">{item.value}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Price Breakdown (Reduced height & compact spacing) */}
              <Card className="shadow-xs border-border/70 rounded-xl">
                <CardHeader className="pb-1.5 pt-3.5 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-foreground">Price Details</CardTitle>
                    {isServiceOrder && (
                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-0 text-[10px] font-medium">
                        Fixed by Support
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-3 space-y-2 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="font-normal text-xs">{isServiceOrder ? 'Service Fee (Fixed by Support)' : 'Base Price'}</span>
                    <span className="font-medium text-foreground text-xs">{formatCurrency(pricing.basePrice)}</span>
                  </div>

                  {(order.includeCollaborate || (pricing.collaborateFee && pricing.collaborateFee > 0)) && (
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="font-normal text-xs">Collaborate Fee</span>
                      <span className="font-medium text-primary text-xs">+{formatCurrency(pricing.collaborateFee || order.collaborateFee)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="font-normal text-xs">Platform Fee</span>
                    <span className="font-medium text-foreground text-xs">{formatCurrency(pricing.platformFee)}</span>
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="font-normal text-xs">Coupon Discount</span>
                    <span className="font-medium text-foreground text-xs">
                      {pricing.couponDiscount > 0 ? `-₹${pricing.couponDiscount}` : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="font-normal text-xs">GST (18%)</span>
                    <span className="font-medium text-foreground text-xs">{formatCurrency(pricing.gst)}</span>
                  </div>

                  {/* Highlighted Total Box (Compact) */}
                  <div className="bg-[#F8F9FE] dark:bg-muted/40 border border-indigo-100/90 dark:border-border/60 rounded-xl px-3 py-2 flex justify-between items-center mt-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                        Total (incl. of taxes)
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        100% held in escrow until delivery
                      </div>
                    </div>
                    <div className="text-lg font-bold text-[#4F46E5] dark:text-indigo-400">
                      {formatCurrency(pricing.total)}
                    </div>
                  </div>

                  {isServiceOrder && order.status === 'pending_checkout' && (
                    <Button
                      className="w-full mt-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center gap-2 text-xs font-medium py-2 shadow-xs"
                      onClick={handleCheckout}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Proceed to Checkout ({formatCurrency(pricing.total)})
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* DYNAMIC CONTENT SECTION: POLLS, VISIT & PROMOTE, OR PROVIDED CONTENT */}

          {/* CASE 1: POLLS ORDER DETAILS (Matches Image 1) */}
          {isPollOrder && (
            <Card className="shadow-xs border-border/70 rounded-xl">
              <CardHeader className="pb-3 pt-5 px-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">Poll Details</CardTitle>
                    <p className="text-xs text-muted-foreground">Set up your poll questions and options</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-5">
                {/* Purple Banner */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50/70 to-purple-50/70 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <h3 className="text-base font-semibold text-foreground mb-1 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Poll Content for {order.platform ? order.platform.toUpperCase() : 'Twitter'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Create up to 3 poll questions with up to 4 options each
                  </p>
                </div>

                {/* Poll List (Up to 3 polls) */}
                <div className="space-y-4">
                  {polls.slice(0, 3).map((poll, pollIdx) => {
                    const isExpanded = expandedPolls[poll.id] ?? true;
                    return (
                      <Collapsible
                        key={poll.id}
                        open={isExpanded}
                        onOpenChange={() => togglePollExpansion(poll.id)}
                        className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs"
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm text-foreground">Poll {pollIdx + 1}</span>
                            {poll.question && (
                              <span className="text-xs text-muted-foreground truncate max-w-sm hidden sm:inline">
                                "{poll.question}"
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {isModifyMode && polls.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePollQuestion(poll.id);
                                }}
                                className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Remove
                              </Button>
                            )}
                            <ChevronDown
                              className={cn(
                                'w-4 h-4 text-muted-foreground transition-transform',
                                isExpanded && 'rotate-180'
                              )}
                            />
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="p-4 space-y-4 border-t border-border/60 bg-background">
                          {/* Poll Question */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <Label className="text-xs font-semibold text-foreground">Poll Question</Label>
                              <span className="text-xs text-muted-foreground font-mono">
                                {(poll.question || '').length}/150
                              </span>
                            </div>
                            <Input
                              placeholder="Enter your poll question"
                              value={poll.question}
                              readOnly={!isModifyMode}
                              onChange={(e) => updatePollQuestion(poll.id, e.target.value)}
                              maxLength={150}
                              className={cn(
                                'text-sm',
                                !isModifyMode && 'bg-muted/20 border-border/60 cursor-default'
                              )}
                            />
                          </div>

                          {/* Poll Options */}
                          <div className="space-y-2.5">
                            <Label className="text-xs font-semibold text-foreground">Poll Options</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {poll.options.map((option, optIdx) => (
                                <div key={optIdx} className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Option {optIdx + 1}
                                    {optIdx >= 2 && <span className="text-muted-foreground/70 ml-1">(Optional)</span>}
                                  </Label>
                                  <Input
                                    placeholder={`Option ${optIdx + 1}`}
                                    value={option}
                                    readOnly={!isModifyMode}
                                    onChange={(e) => updatePollOption(poll.id, optIdx, e.target.value)}
                                    className={cn(
                                      'text-sm',
                                      !isModifyMode && 'bg-muted/20 border-border/60 cursor-default'
                                    )}
                                  />
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">
                              💡 Options 3 and 4 are optional. Twitter polls can have 2-4 options.
                            </p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}

                  {/* Add Another Question Button in Modify mode */}
                  {isModifyMode && polls.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPollQuestion}
                      className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5 text-xs py-5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Question ({polls.length}/3)
                    </Button>
                  )}
                </div>

                {/* Affiliate Link if present */}
                {order.affiliateLink && (
                  <div className="p-3 bg-muted/20 rounded-lg border border-border/60 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-foreground mr-1">Affiliate Link:</span>
                      <span className="text-primary font-mono">{order.affiliateLink}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => copyAffiliateLink(order.affiliateLink || '')}
                    >
                      {copiedLink ? <Check className="w-3 h-3 mr-1 text-emerald-600" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copiedLink ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* CASE 2: VISIT & PROMOTE ORDER DETAILS (Matches Images 2, 3, 4) */}
          {isVisitPromoteOrder && (
            <Card className="shadow-xs border-border/70 rounded-xl">
              <CardHeader className="pb-3 pt-5 px-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">Visit & Promote Details</CardTitle>
                    <p className="text-xs text-muted-foreground">Provide the visit details for this campaign</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                {/* Purple Banner */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50/70 to-purple-50/70 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <h3 className="text-base font-semibold text-foreground mb-1">Visit & Promote Content Details</h3>
                  <p className="text-xs text-muted-foreground">
                    Complete the details below for your visit and promotion requirements
                  </p>
                </div>

                {/* 1. Basic Info Section (Image 2) */}
                <Collapsible
                  open={expandedVisitSections.basicInfo}
                  onOpenChange={() => toggleVisitSection('basicInfo')}
                  className="rounded-xl border border-border/70 overflow-hidden"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm text-foreground">1. Basic Info</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform',
                        expandedVisitSections.basicInfo && 'rotate-180'
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-t border-border/60 bg-background space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                          Preferred Visit Dates
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {(visitData.preferredDates || ['2026-10-22']).map((d, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs py-1.5 px-3 bg-muted/20 border-border/70">
                              <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-primary" />
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                          Preferred Time Slot
                        </Label>
                        {isModifyMode ? (
                          <select
                            className="w-full p-2 text-sm border border-input rounded-md bg-background"
                            value={visitData.timeSlot}
                            onChange={(e) => handleVisitChange('timeSlot', e.target.value)}
                          >
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                        ) : (
                          <Input
                            readOnly
                            value={visitData.timeSlot || 'Flexible'}
                            className="text-sm bg-muted/20 border-border/60"
                          />
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* 2. Visit Location Section (Images 2 & 3) */}
                <Collapsible
                  open={expandedVisitSections.location}
                  onOpenChange={() => toggleVisitSection('location')}
                  className="rounded-xl border border-border/70 overflow-hidden"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm text-foreground">2. Visit Location</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform',
                        expandedVisitSections.location && 'rotate-180'
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-t border-border/60 bg-background space-y-4">
                    <div>
                      <Label className="text-xs font-semibold text-foreground mb-1.5 block">Venue Name</Label>
                      <Input
                        placeholder="e.g., Trendy Fashion Boutique"
                        value={visitData.venueName || ''}
                        readOnly={!isModifyMode}
                        onChange={(e) => handleVisitChange('venueName', e.target.value)}
                        className={cn('text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-foreground mb-1.5 block">Full Address</Label>
                      <Textarea
                        placeholder="Complete address with pincode"
                        value={visitData.fullAddress || ''}
                        readOnly={!isModifyMode}
                        onChange={(e) => handleVisitChange('fullAddress', e.target.value)}
                        className={cn('min-h-[70px] text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                        Landmark & Nearby Transit Info (Optional)
                      </Label>
                      <Input
                        placeholder="e.g., Near Central Mall, Metro Station 5 min walk"
                        value={visitData.landmarkInfo || ''}
                        readOnly={!isModifyMode}
                        onChange={(e) => handleVisitChange('landmarkInfo', e.target.value)}
                        className={cn('text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                      />
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200/50 dark:border-blue-900/40">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        💡 Tip: Ensure address is accurate and include COVID safety protocols or ID verification requirements if applicable
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* 3. Offers & Facilities for Influencer (Image 3) */}
                <Collapsible
                  open={expandedVisitSections.offers}
                  onOpenChange={() => toggleVisitSection('offers')}
                  className="rounded-xl border border-border/70 overflow-hidden"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Gift className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm text-foreground">3. Offers & Facilities for Influencer</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform',
                        expandedVisitSections.offers && 'rotate-180'
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-t border-border/60 bg-background space-y-4">
                    {/* Travel Reimbursement */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">Travel Reimbursement</Label>
                        <Switch
                          checked={Boolean(visitData.travelReimbursement)}
                          disabled={!isModifyMode}
                          onCheckedChange={(checked) => handleVisitChange('travelReimbursement', checked)}
                        />
                      </div>
                      {visitData.travelReimbursement && (
                        <Input
                          placeholder="Amount or notes (e.g., ₹500 or Cab fare both ways)"
                          value={visitData.travelAmount || ''}
                          readOnly={!isModifyMode}
                          onChange={(e) => handleVisitChange('travelAmount', e.target.value)}
                          className={cn('text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                        />
                      )}
                    </div>

                    {/* Food/Refreshments */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">Food/Refreshments Provided</Label>
                        <Switch
                          checked={Boolean(visitData.foodProvided)}
                          disabled={!isModifyMode}
                          onCheckedChange={(checked) => handleVisitChange('foodProvided', checked)}
                        />
                      </div>
                      {visitData.foodProvided && (
                        <Input
                          placeholder="Details (e.g., Lunch, Snacks, Beverages)"
                          value={visitData.foodDetails || ''}
                          readOnly={!isModifyMode}
                          onChange={(e) => handleVisitChange('foodDetails', e.target.value)}
                          className={cn('text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                        />
                      )}
                    </div>

                    {/* Stay Provided */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">Stay Provided (if outstation)</Label>
                        <Switch
                          checked={Boolean(visitData.stayProvided)}
                          disabled={!isModifyMode}
                          onCheckedChange={(checked) => handleVisitChange('stayProvided', checked)}
                        />
                      </div>
                      {visitData.stayProvided && (
                        <Input
                          placeholder="Stay details (e.g., 4-star hotel stay)"
                          value={visitData.stayDetails || ''}
                          readOnly={!isModifyMode}
                          onChange={(e) => handleVisitChange('stayDetails', e.target.value)}
                          className={cn('text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                        />
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* 4. Content Expectations (Image 4) */}
                <Collapsible
                  open={expandedVisitSections.content}
                  onOpenChange={() => toggleVisitSection('content')}
                  className="rounded-xl border border-border/70 overflow-hidden"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm text-foreground">4. Content Expectations</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform',
                        expandedVisitSections.content && 'rotate-180'
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-t border-border/60 bg-background space-y-4">
                    <div>
                      <Label className="text-xs font-semibold text-foreground mb-1.5 block">Brief Description</Label>
                      <Textarea
                        placeholder="e.g., Shoot product demo inside the store, post 2 stories tagging us"
                        value={visitData.contentDescription || ''}
                        readOnly={!isModifyMode}
                        onChange={(e) => handleVisitChange('contentDescription', e.target.value)}
                        className={cn('min-h-[80px] text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-foreground mb-1.5 block">Hashtags to Use</Label>
                      <Input
                        placeholder="e.g., #BrandName #Fashion #NewCollection"
                        value={visitData.hashtags || ''}
                        readOnly={!isModifyMode}
                        onChange={(e) => handleVisitChange('hashtags', e.target.value)}
                        className={cn('text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-foreground mb-1.5 block">Handles to Tag</Label>
                      <Input
                        placeholder="e.g., @brandname @storename"
                        value={visitData.handlesToTag || ''}
                        readOnly={!isModifyMode}
                        onChange={(e) => handleVisitChange('handlesToTag', e.target.value)}
                        className={cn('text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* 5. Notes & Instructions (Image 4) */}
                <Collapsible
                  open={expandedVisitSections.notes}
                  onOpenChange={() => toggleVisitSection('notes')}
                  className="rounded-xl border border-border/70 overflow-hidden"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm text-foreground">5. Notes & Instructions</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform',
                        expandedVisitSections.notes && 'rotate-180'
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-t border-border/60 bg-background space-y-4">
                    <div>
                      <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                        Special Guidelines, Dress Code, Dos & Don'ts
                      </Label>
                      <Textarea
                        placeholder="Any specific instructions, dress code, or guidelines for the visit"
                        value={visitData.specialGuidelines || order.notes || ''}
                        readOnly={!isModifyMode}
                        onChange={(e) => handleVisitChange('specialGuidelines', e.target.value)}
                        className={cn('min-h-[80px] text-sm', !isModifyMode && 'bg-muted/20 border-border/60')}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          )}

          {/* CASE 3: STANDARD / REGULAR CONTENT (Posts, Reels, Short Video, etc.) */}
          {!isPollOrder && !isVisitPromoteOrder && !isServiceOrder && (
            <Card className="shadow-xs border-border/70 rounded-xl">
              <CardHeader className="pb-3 pt-5 px-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base font-semibold text-foreground">Provided Content</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-5">
                {/* Content Brief (Matches Image 2) */}
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-2">Content Brief:</span>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/60 text-sm leading-relaxed text-foreground">
                    {order.content?.description ||
                      'Create a 60-second travel adventure Reel with booking link.'}
                  </div>
                </div>

                {/* Uploaded Reference Files (if available) */}
                {order.content?.files && order.content.files.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block mb-2">
                      Attached Files ({order.content.files.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.content.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="p-2 rounded-md bg-background border border-border/50 shrink-0">
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
                  </div>
                )}

                {/* Affiliate Link (if available) */}
                {order.affiliateLink && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block mb-2">
                      Affiliate / Tracking Link:
                    </span>
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
                      <span className="text-xs font-mono break-all text-primary">{order.affiliateLink}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => copyAffiliateLink(order.affiliateLink || '')}
                        >
                          {copiedLink ? <Check className="w-3 h-3 mr-1 text-emerald-600" /> : <Copy className="w-3 h-3 mr-1" />}
                          {copiedLink ? 'Copied' : 'Copy'}
                        </Button>
                        <a
                          href={order.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center h-7 px-2 text-xs font-medium text-primary hover:underline"
                        >
                          Visit <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Creator Notes (if available) */}
                {order.notes && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block mb-2">
                      Additional Instructions / Notes:
                    </span>
                    <div className="p-3 bg-muted/20 rounded-lg border border-border/60 text-xs text-foreground leading-relaxed">
                      {order.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* CASE 4: SERVICE ORDER DETAILS (Requested from Services page, reviewed by support team) */}
          {isServiceOrder && (
            <Card className="shadow-xs border-border/70 rounded-xl">
              <CardHeader className="pb-3 pt-5 px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </span>
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        Service Order: {order.serviceDetails?.serviceName || order.productService || 'Custom Service'}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Category: {order.serviceDetails?.category || order.category || 'Design Services'} • Review & Specifications
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-0 px-3 py-1 text-xs font-medium w-fit">
                    {order.serviceDetails?.supportStatusDisplay || order.supportStatus || 'Quote Ready for Checkout'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-5">
                {/* Support Team Assessment Banner */}
                <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <h4 className="text-sm font-semibold text-foreground">Support Team Review & Scope Confirmation</h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 w-fit">
                      Pricing Fixed by Support
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed sm:pl-7">
                    {order.serviceDetails?.supportReviewNotes ||
                      'Our specialist has reviewed your project brief, verified the requirements, and set the fixed price. Once checkout is completed, production starts immediately.'}
                  </p>

                  {/* Confirmed Deliverables */}
                  {order.serviceDetails?.deliverables && order.serviceDetails.deliverables.length > 0 && (
                    <div className="pt-2 sm:pl-7 border-t border-blue-200/50 dark:border-blue-900/40">
                      <span className="text-xs font-semibold text-muted-foreground block mb-2">Confirmed Deliverables:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.serviceDetails.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Client & Campaign Information Grid */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Client & Request Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Full Name
                      </div>
                      <div className="text-xs font-medium text-foreground">{order.serviceDetails?.clientName || 'Vikram Malhotra'}</div>
                    </div>

                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground truncate">{order.serviceDetails?.clientEmail || 'vikram@malhotratech.in'}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.serviceDetails?.clientEmail || '', 'Email', 'client_email')}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedKey === 'client_email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone Number
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{order.serviceDetails?.clientPhone || '+91 98765 43210'}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.serviceDetails?.clientPhone || '', 'Phone', 'client_phone')}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedKey === 'client_phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Budget Range
                      </div>
                      <div className="text-xs font-medium text-foreground">{order.serviceDetails?.budgetRange || '$500 - $1,000'}</div>
                    </div>

                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Target Timeline
                      </div>
                      <div className="text-xs font-medium text-foreground">{order.serviceDetails?.timeline || 'Within 1 week'}</div>
                    </div>

                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Target Delivery Date
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {order.serviceDetails?.estimatedDeliveryDate || 'Oct 12, 2026'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Description & Requirements */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Project Requirements & Description
                  </h4>
                  <div className="p-4 bg-muted/20 rounded-xl border border-border/60 text-xs text-foreground leading-relaxed">
                    {order.serviceDetails?.description || order.content?.description || 'No description provided.'}
                  </div>
                </div>

                {/* Uploaded Reference Files */}
                {order.content?.files && order.content.files.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Reference Files & Assets ({order.content.files.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.content.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="p-2 rounded-md bg-background border border-border/50 shrink-0">
                              {getFileIcon(file.name)}
                            </span>
                            <div className="truncate">
                              <span className="text-xs font-medium text-foreground block truncate" title={file.name}>
                                {file.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground">{file.size}</span>
                            </div>
                          </div>
                          <a
                            href={file.url || '#'}
                            download={file.name}
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fulfillment Timeline */}
                {order.timeline && order.timeline.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Fulfillment Progress
                    </h4>
                    <div className="space-y-2.5">
                      {order.timeline.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/10">
                          <div className="mt-0.5">
                            {item.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : item.status === 'current' ? (
                              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-muted-foreground/40" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-foreground">{item.step}</span>
                              <span className="text-[11px] text-muted-foreground">{item.timestamp}</span>
                            </div>
                            {item.description && (
                              <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Social Media Links Card: Matches Image 2 */}
          {!isServiceOrder && (
          <Card className="shadow-xs border-border/70 rounded-xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="text-base font-semibold text-foreground">Social Media Links</CardTitle>
              <p className="text-xs text-muted-foreground">Add usernames and URLs to the social media posts for this order</p>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3.5">
              {/* Instagram Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2 rounded-xl border border-border/60 bg-muted/10">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                {/* Username with Copy Icon */}
                <div className="relative w-full sm:w-60 shrink-0 flex items-center">
                  <Input
                    placeholder="@instagram_username"
                    value={socialUsernames.instagram || ''}
                    onChange={(e) => handleUsernameChange('instagram', e.target.value)}
                    className="h-10 text-xs pr-8 bg-background border-border/60"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialUsernames.instagram || '', 'Instagram Username', 'ig_user')}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Username"
                  >
                    {copiedKey === 'ig_user' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {/* Link with Copy Icon */}
                <div className="relative flex-1 flex items-center">
                  <Input
                    placeholder="https://instagram.com/p/..."
                    value={socialMediaLinks.instagram || ''}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    className="h-10 text-xs pr-8 bg-background border-border/60"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialMediaLinks.instagram || '', 'Instagram Link', 'ig_link')}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Link"
                  >
                    {copiedKey === 'ig_link' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {isValidUrl(socialMediaLinks.instagram) && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" asChild>
                    <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" title="Open Post URL">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Facebook Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2 rounded-xl border border-border/60 bg-muted/10">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                {/* Username with Copy Icon */}
                <div className="relative w-full sm:w-60 shrink-0 flex items-center">
                  <Input
                    placeholder="facebook.username"
                    value={socialUsernames.facebook || ''}
                    onChange={(e) => handleUsernameChange('facebook', e.target.value)}
                    className="h-10 text-xs pr-8 bg-background border-border/60"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialUsernames.facebook || '', 'Facebook Username', 'fb_user')}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Username"
                  >
                    {copiedKey === 'fb_user' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {/* Link with Copy Icon */}
                <div className="relative flex-1 flex items-center">
                  <Input
                    placeholder="https://facebook.com/..."
                    value={socialMediaLinks.facebook || ''}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    className="h-10 text-xs pr-8 bg-background border-border/60"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialMediaLinks.facebook || '', 'Facebook Link', 'fb_link')}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Link"
                  >
                    {copiedKey === 'fb_link' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {isValidUrl(socialMediaLinks.facebook) && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" asChild>
                    <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" title="Open Post URL">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* YouTube Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2 rounded-xl border border-border/60 bg-muted/10">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                {/* Username with Copy Icon */}
                <div className="relative w-full sm:w-60 shrink-0 flex items-center">
                  <Input
                    placeholder="@youtube_channel"
                    value={socialUsernames.youtube || ''}
                    onChange={(e) => handleUsernameChange('youtube', e.target.value)}
                    className="h-10 text-xs pr-8 bg-background border-border/60"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialUsernames.youtube || '', 'YouTube Channel', 'yt_user')}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Channel"
                  >
                    {copiedKey === 'yt_user' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {/* Link with Copy Icon */}
                <div className="relative flex-1 flex items-center">
                  <Input
                    placeholder="https://youtube.com/shorts/..."
                    value={socialMediaLinks.youtube || ''}
                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                    className="h-10 text-xs pr-8 bg-background border-border/60"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialMediaLinks.youtube || '', 'YouTube Link', 'yt_link')}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Link"
                  >
                    {copiedKey === 'yt_link' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {isValidUrl(socialMediaLinks.youtube) && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" asChild>
                    <a href={socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer" title="Open Post URL">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Twitter Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2 rounded-xl border border-border/60 bg-muted/10">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-sky-500" />
                </div>
                {/* Username with Copy Icon */}
                <div className="relative w-full sm:w-60 shrink-0 flex items-center">
                  <Input
                    placeholder="@twitter_handle"
                    value={socialUsernames.twitter || ''}
                    onChange={(e) => handleUsernameChange('twitter', e.target.value)}
                    className="h-10 text-xs pr-8 bg-background border-border/60"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialUsernames.twitter || '', 'Twitter Handle', 'tw_user')}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Handle"
                  >
                    {copiedKey === 'tw_user' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {/* Link with Copy Icon */}
                <div className="relative flex-1 flex items-center">
                  <Input
                    placeholder="https://twitter.com/..."
                    value={socialMediaLinks.twitter || ''}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    className="h-10 text-xs pr-8 bg-background border-border/60"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialMediaLinks.twitter || '', 'Twitter Link', 'tw_link')}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Link"
                  >
                    {copiedKey === 'tw_link' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {isValidUrl(socialMediaLinks.twitter) && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" asChild>
                    <a href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" title="Open Post URL">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Save Links Action */}
              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveSocialLinks}
                  disabled={isSavingLinks}
                  className="text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {isSavingLinks ? 'Saving...' : 'Save Social Media Links'}
                </Button>
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
