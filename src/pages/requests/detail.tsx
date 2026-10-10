import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Edit, 
  Upload, 
  FileText, 
  BarChart, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  CalendarDays,
  Clock, 
  MessageCircle, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Gift,
  Users,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Share2,
  FileCheck,
  MoreVertical,
  ChevronDown,
  IndianRupee,
  Wallet,
  ShieldCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { InfluencerRequest, RequestStatus, ServiceType, ContentType } from '@/types/request';
import { getRequestById, updateRequest } from '@/data/requests';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [request, setRequest] = useState<InfluencerRequest | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [priceNote, setPriceNote] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedPolls, setExpandedPolls] = useState<Record<string, boolean>>({ '1': true, '2': true, '3': true });
  const [expandedVisit, setExpandedVisit] = useState({
    basicInfo: true,
    location: true,
    offers: true,
    guidelines: true,
    links: true,
  });

  // Delivery links & notes state
  const [deliveryNotes, setDeliveryNotes] = useState<string>('All campaign deliverables and sponsored content have been successfully produced and published across scheduled channels in accordance with the campaign brief.');
  const [deliveryInstagram, setDeliveryInstagram] = useState<string>('');
  const [deliveryYoutube, setDeliveryYoutube] = useState<string>('');
  const [deliveryFacebook, setDeliveryFacebook] = useState<string>('');
  const [deliveryTwitter, setDeliveryTwitter] = useState<string>('');
  const [isEditingDelivery, setIsEditingDelivery] = useState<boolean>(false);

  const togglePoll = (pollId: string) => {
    setExpandedPolls(prev => ({ ...prev, [pollId]: !prev[pollId] }));
  };

  const toggleVisitSection = (sec: keyof typeof expandedVisit) => {
    setExpandedVisit(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  useEffect(() => {
    // Check if user is an influencer
    const userType = localStorage.getItem('userType');
    if (userType !== 'influencer') {
      toast({
        title: "Access Denied",
        description: "Only influencers can access request details.",
        variant: "destructive",
      });
      navigate('/dashboard/business');
      return;
    }

    if (id) {
      const found = getRequestById(id);
      if (found) {
        setRequest(found);
        setCustomPrice(found.price.toString());
        setPriceNote(found.priceNote || '');
        if (found.deliveredService?.deliveryNotes) {
          setDeliveryNotes(found.deliveredService.deliveryNotes);
        }
        setDeliveryInstagram(found.deliveredService?.instagramUrl || '');
        setDeliveryYoutube(found.deliveredService?.youtubeUrl || '');
        setDeliveryFacebook(found.deliveredService?.facebookUrl || '');
        setDeliveryTwitter(found.deliveredService?.twitterUrl || '');
      } else {
        toast({
          title: "Request Not Found",
          description: `No order request found with ID #${id}`,
          variant: "destructive",
        });
        navigate('/requests');
      }
    }
  }, [id, navigate, toast]);

  const formatRequestDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    try {
      return format(new Date(dateString), 'MM/dd/yyyy hh:mm a');
    } catch {
      return dateString;
    }
  };

  const getServiceTypeLabel = (type: ServiceType) => {
    switch (type) {
      case 'post': return 'Post Image/Video';
      case 'story': return 'Story (Image/Video)';
      case 'reel':
      case 'short': return 'Reels/Shorts';
      case 'video': return 'In-Video Promotion (<10 min)';
      default: return type;
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 font-semibold px-2.5 py-0.5">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold px-2.5 py-0.5">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300 font-semibold px-2.5 py-0.5">Rejected</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 font-semibold px-2.5 py-0.5">Paid</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300 font-semibold px-2.5 py-0.5">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'upload_files': return <Upload className="w-4 h-4 text-blue-500" />;
      case 'provided_content': return <FileText className="w-4 h-4 text-green-500" />;
      case 'polls': return <BarChart className="w-4 h-4 text-purple-500" />;
      case 'visit_promote': return <MapPin className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'upload_files': return 'Upload Files';
      case 'provided_content': return 'Provided Content';
      case 'polls': return 'Polls';
      case 'visit_promote': return 'Visit & Promote';
      default: return type;
    }
  };

  const formatPlatforms = (platform: string | string[]) => {
    if (Array.isArray(platform)) {
      return platform.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
    }
    return platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Not specified';
  };

  const handleAcceptRequest = () => {
    if (!request) return;
    setIsUpdating(true);
    const priceNum = parseFloat(customPrice);
    const updates: Partial<InfluencerRequest> = { status: 'approved' };
    if (!isNaN(priceNum) && priceNum > 0 && priceNum !== request.price) {
      updates.price = priceNum;
      if (priceNote.trim()) {
        updates.priceNote = priceNote.trim();
      }
    }
    const updated = updateRequest(request.id, updates);
    if (updated) {
      setRequest(updated);
      toast({
        title: "Request Approved",
        description: `Order request #${request.id} has been accepted successfully.`,
      });
    }
    setIsUpdating(false);
  };

  const handleRejectRequest = () => {
    if (!request) return;
    setIsUpdating(true);
    const updated = updateRequest(request.id, { status: 'rejected' });
    if (updated) {
      setRequest(updated);
      toast({
        title: "Request Rejected",
        description: `Order request #${request.id} has been declined.`,
        variant: "destructive",
      });
    }
    setIsUpdating(false);
  };

  const handleModifyPrice = () => {
    if (!request) return;
    const priceNum = parseFloat(customPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price amount.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    const updated = updateRequest(request.id, { 
      price: priceNum,
      priceNote: priceNote.trim() || undefined
    });
    if (updated) {
      setRequest(updated);
      toast({
        title: "Price Proposal Updated",
        description: priceNote.trim() 
          ? `Price updated to ₹${priceNum} with note.`
          : `Price proposal updated to ₹${priceNum}.`,
      });
    }
    setIsUpdating(false);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    toast({
      title: "Link Copied",
      description: "Copied to clipboard!",
    });
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleSaveDeliveryDetails = () => {
    if (!request) return;
    setIsUpdating(true);
    const hasAnyField = Boolean(
      deliveryNotes.trim() ||
      deliveryInstagram.trim() ||
      deliveryYoutube.trim() ||
      deliveryFacebook.trim() ||
      deliveryTwitter.trim()
    );
    const updatedDelivery = {
      deliveryNotes: deliveryNotes.trim() || undefined,
      instagramUrl: deliveryInstagram.trim() || undefined,
      youtubeUrl: deliveryYoutube.trim() || undefined,
      facebookUrl: deliveryFacebook.trim() || undefined,
      twitterUrl: deliveryTwitter.trim() || undefined,
      isFilled: hasAnyField,
      completedAt: request.deliveredService?.completedAt,
    };
    const updated = updateRequest(request.id, {
      deliveredService: updatedDelivery
    });
    if (updated) {
      setRequest(updated);
      setIsEditingDelivery(false);
      toast({
        title: "Delivery Details Saved",
        description: "Delivered service links & notes updated successfully.",
      });
    }
    setIsUpdating(false);
  };

  const handleMarkAsCompleted = () => {
    if (!request) return;
    setIsUpdating(true);
    const updatedDelivery = {
      deliveryNotes: deliveryNotes.trim() || 'All campaign deliverables and sponsored content have been successfully produced and published across scheduled channels in accordance with the campaign brief.',
      instagramUrl: deliveryInstagram.trim() || undefined,
      youtubeUrl: deliveryYoutube.trim() || undefined,
      facebookUrl: deliveryFacebook.trim() || undefined,
      twitterUrl: deliveryTwitter.trim() || undefined,
      isFilled: true,
      completedAt: new Date().toISOString(),
    };
    const updated = updateRequest(request.id, {
      status: 'completed',
      deliveredService: updatedDelivery
    });
    if (updated) {
      setRequest(updated);
      setIsEditingDelivery(false);
      toast({
        title: "Order Completed",
        description: `Order #${request.id} has been marked as completed!`,
      });
    }
    setIsUpdating(false);
  };

  if (!request) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading request details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const business = {
    businessName: request.businessInfo?.businessName || request.businessName || "ABC Company",
    category: request.businessInfo?.category || "Fashion & Apparel",
    serviceType: request.businessInfo?.serviceType || "Online & Offline",
    website: request.businessInfo?.website || "www.abccompany.com",
    address: request.businessInfo?.address || "123 Commercial Plaza, Bandra West, Mumbai 400050",
    accountManagement: request.businessInfo?.accountManagement || "Managed Account",
    socialLinks: request.businessInfo?.socialLinks || {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
      twitter: "https://twitter.com",
    }
  };

  const orderTotal = request.price || 0;
  const platformFeePercent = 10;
  const platformFeeAmount = Math.round(orderTotal * (platformFeePercent / 100));
  const influencerCreditAmount = orderTotal - platformFeeAmount;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6 pb-12">
            
            {/* Top Navigation Bar & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigate('/requests')}
                  className="h-9 w-9 hover:bg-muted"
                  title="Back to Requests"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="h-4 w-px bg-border hidden sm:block"></div>
                <div>
                  <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <span>Order Request Details</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                      #{request.id}
                    </span>
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete information and fulfillment options for this service request
                  </p>
                </div>
              </div>

              {/* Actions in Header */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 mr-2">
                  <span className="text-xs text-muted-foreground font-medium">Status:</span>
                  {getStatusBadge(request.status)}
                </div>

                <Button
                  size="sm"
                  onClick={handleAcceptRequest}
                  disabled={request.status === 'approved' || request.status === 'completed' || isUpdating}
                  className="gap-1.5 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Request</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-border text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                      onClick={handleRejectRequest}
                      disabled={request.status === 'rejected' || isUpdating}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer gap-2"
                    >
                      <X className="w-4 h-4 text-red-600" />
                      <span>Reject</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Request Progress Tracker */}
            <Card className="border border-border/80 shadow-xs bg-card">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Request Created</p>
                      <p className="text-[11px] text-muted-foreground">{formatRequestDate(request.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      request.status !== 'pending'
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600'
                        : 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 animate-pulse'
                    }`}>
                      {request.status !== 'pending' ? '✓' : '2'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Influencer Review</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{request.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      request.status === 'approved' || request.status === 'completed' || request.status === 'paid'
                        ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      3
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Execution Date</p>
                      <p className="text-[11px] text-muted-foreground">{formatRequestDate(request.dateRequested)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      request.status === 'completed' || request.status === 'paid'
                        ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      4
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Completion</p>
                      <p className="text-[11px] text-muted-foreground">{request.status === 'completed' ? 'Delivered' : 'Pending completion'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid: Order Information & Business Information (matching Image 1) */}
            {/* Main Info Cards - 2 Columns (Balanced Layout) */}
            {/* Main Info Cards - 2 Columns (Left: Order Info, Right: Business & Pricing) */}
            {/* Main Info Cards - 2 Columns (Compact, Height-Adjusted) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 items-start">
              
              {/* Left Column: Order Information */}
              <Card className="border border-border/80 shadow-xs">
                <CardHeader className="py-2.5 px-4 border-b border-border/60">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>Order Information</span>
                    <span className="text-xs font-normal text-muted-foreground font-mono">ID: #{request.id}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                    <span className="text-muted-foreground font-medium">Order ID:</span>
                    <span className="font-semibold text-foreground font-mono">{request.id}</span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                    <span className="text-muted-foreground font-medium">Created:</span>
                    <span className="text-foreground">{formatRequestDate(request.createdAt)}</span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                    <span className="text-muted-foreground font-medium">Scheduled:</span>
                    <span className="text-foreground">{formatRequestDate(request.dateRequested)}</span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                    <span className="text-muted-foreground font-medium">Status:</span>
                    <div>{getStatusBadge(request.status)}</div>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                    <span className="text-muted-foreground font-medium">Order Type:</span>
                    <span className="font-semibold text-foreground">{request.orderType || getServiceTypeLabel(request.serviceType)}</span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                    <span className="text-muted-foreground font-medium">Platform:</span>
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <span className="capitalize">{formatPlatforms(request.platform)}</span>
                    </div>
                  </div>

                  {request.content && (
                    <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground font-medium">Content Type:</span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 text-[11px] font-medium">
                        {getContentTypeIcon(request.content.type)}
                        <span>{getContentTypeLabel(request.content.type)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                    <span className="text-muted-foreground font-medium">Campaign Scope:</span>
                    <span className="font-medium text-foreground text-[11px] truncate max-w-[220px]">
                      {request.content?.type === 'visit_promote'
                        ? 'On-site Visit, Store Experience & Promotion'
                        : request.content?.type === 'polls'
                          ? 'Interactive Audience Polls & Feedback'
                          : `${getServiceTypeLabel(request.serviceType)} Content Fulfillment`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                    <span className="text-muted-foreground font-medium">Payment Protection:</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Escrow Guaranteed
                    </span>
                  </div>

                  <div className="pt-1.5">
                    <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-foreground block">Total Order Amount</span>
                        <span className="text-[10px] text-muted-foreground">Fixed price offered by business</span>
                      </div>
                      <span className="font-extrabold text-xl text-primary">₹{request.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column: Business Information & Pricing Details */}
              <div className="space-y-4">
                {/* Card 2: Business Information (compact height) */}
                <Card className="border border-border/80 shadow-xs">
                  <CardHeader className="py-2.5 px-4 border-b border-border/60">
                    <CardTitle className="text-sm font-bold">
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground font-medium">Business Name:</span>
                      <span className="font-semibold text-foreground">{business.businessName}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground font-medium">Category:</span>
                      <span className="text-foreground font-medium">{business.category}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground font-medium">Service Type:</span>
                      <span className="text-foreground font-medium">{business.serviceType}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground font-medium">Website Link:</span>
                      <a
                        href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium text-[11px] truncate max-w-[200px]"
                      >
                        <span className="truncate">{business.website}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <div className="flex justify-between items-start py-0.5 border-b border-border/30 gap-2">
                      <span className="text-muted-foreground font-medium shrink-0">Address:</span>
                      <span className="text-foreground font-medium text-right text-[11px] line-clamp-2">{business.address}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground font-medium">Account Management:</span>
                      <Badge variant="secondary" className="font-medium text-[10px] py-0 h-4.5">
                        {business.accountManagement}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-muted-foreground font-medium">Social Media:</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={business.socialLinks?.instagram || 'https://instagram.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 transition-colors"
                          title="Instagram"
                        >
                          <Instagram className="h-3 w-3" />
                        </a>
                        <a
                          href={business.socialLinks?.facebook || 'https://facebook.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 transition-colors"
                          title="Facebook"
                        >
                          <Facebook className="h-3 w-3" />
                        </a>
                        <a
                          href={business.socialLinks?.youtube || 'https://youtube.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600/10 hover:bg-red-600/20 text-red-600 transition-colors"
                          title="YouTube"
                        >
                          <Youtube className="h-3 w-3" />
                        </a>
                        <a
                          href={business.socialLinks?.twitter || 'https://twitter.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 transition-colors"
                          title="Twitter"
                        >
                          <Twitter className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3: Pricing Details (compact height) */}
                <Card className="border border-border/80 shadow-xs">
                  <CardHeader className="py-2.5 px-4 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pricing Details</span>
                      </CardTitle>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 text-[10px] py-0 h-4.5">
                        Wallet Credit
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground font-medium">Total Cost of Order:</span>
                      <span className="font-bold text-foreground text-sm">₹{orderTotal}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground font-medium">Platform Fee (10%):</span>
                      <span className="text-muted-foreground font-medium">- ₹{platformFeeAmount}</span>
                    </div>

                    {/* Influencer Credit Amount Box - Compact Sleek Design */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block leading-tight">
                            Influencer Credit:
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                            Credited to wallet upon completion
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        ₹{influencerCreditAmount}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>

            {/* Description Section - Full Width (matching user request) */}
            <Card className="border border-border/80 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Description</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/60">
                  {request.description || 'No description provided for this service request.'}
                </p>
              </CardContent>
            </Card>

            {/* CASE 1: POLLS ORDER DETAILS (Matches Image 3 & orders/detail.tsx) */}
            {request.content?.type === 'polls' && (
              <Card className="border border-border/80 shadow-xs rounded-xl">
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
                  {/* Purple/Blue Gradient Banner */}
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50/70 to-purple-50/70 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <h3 className="text-base font-semibold text-foreground mb-1 flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Poll Content for {Array.isArray(request.platform) ? request.platform.join(', ').toUpperCase() : (request.platform ? request.platform.toUpperCase() : 'TWITTER')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Create up to 3 poll questions with up to 4 options each
                    </p>
                  </div>

                  {/* Poll List (Up to 3 polls) */}
                  <div className="space-y-4">
                    {(request.content.polls || []).slice(0, 3).map((poll, pollIdx) => {
                      const isExpanded = expandedPolls[poll.id] ?? true;
                      return (
                        <Collapsible
                          key={poll.id || pollIdx}
                          open={isExpanded}
                          onOpenChange={() => togglePoll(poll.id || String(pollIdx + 1))}
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
                            <ChevronDown
                              className={cn(
                                'w-4 h-4 text-muted-foreground transition-transform',
                                isExpanded && 'rotate-180'
                              )}
                            />
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
                                readOnly
                                className="text-sm bg-muted/20 border-border/60 cursor-default"
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
                                      readOnly
                                      className="text-sm bg-muted/20 border-border/60 cursor-default"
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CASE 2: VISIT & PROMOTE DETAILS (Matches orders/detail.tsx) */}
            {request.content?.type === 'visit_promote' && (
              <Card className="border border-border/80 shadow-xs rounded-xl">
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
                  {/* Purple/Blue Banner */}
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50/70 to-purple-50/70 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <h3 className="text-base font-semibold text-foreground mb-1">Visit & Promote Content Details</h3>
                    <p className="text-xs text-muted-foreground">
                      Complete the details below for your visit and promotion requirements
                    </p>
                  </div>

                  {/* 1. Basic Info Section */}
                  <Collapsible
                    open={expandedVisit.basicInfo}
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
                          expandedVisit.basicInfo && 'rotate-180'
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
                            {(request.content.visitPromote?.preferredDates || ['2026-10-22']).map((d, idx) => (
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
                          <Input
                            readOnly
                            value={request.content.visitPromote?.timeSlot || 'Flexible'}
                            className="text-sm bg-muted/20 border-border/60 cursor-default"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 2. Visit Location Section */}
                  <Collapsible
                    open={expandedVisit.location}
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
                          expandedVisit.location && 'rotate-180'
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t border-border/60 bg-background space-y-4">
                      <div>
                        <Label className="text-xs font-semibold text-foreground mb-1.5 block">Venue Name</Label>
                        <Input
                          placeholder="e.g., Trendy Fashion Boutique"
                          value={request.content.visitPromote?.venueName || ''}
                          readOnly
                          className="text-sm bg-muted/20 border-border/60 cursor-default"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-foreground mb-1.5 block">Full Address</Label>
                        <Textarea
                          placeholder="Complete address with pincode"
                          value={request.content.visitPromote?.fullAddress || ''}
                          readOnly
                          className="min-h-[70px] text-sm bg-muted/20 border-border/60 cursor-default"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                          Landmark & Nearby Transit Info (Optional)
                        </Label>
                        <Input
                          placeholder="e.g., Near Central Mall, Metro Station 5 min walk"
                          value={request.content.visitPromote?.landmarkInfo || ''}
                          readOnly
                          className="text-sm bg-muted/20 border-border/60 cursor-default"
                        />
                      </div>

                      {request.content.visitPromote?.googleMapsLink && (
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/60">
                          <div className="flex items-center gap-2 text-xs text-foreground">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <span className="font-medium">Map Location:</span>
                            <span className="truncate max-w-xs text-muted-foreground">{request.content.visitPromote.googleMapsLink}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(request.content.visitPromote?.googleMapsLink, '_blank')}
                            className="h-7 text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            Open Maps
                          </Button>
                        </div>
                      )}

                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200/50 dark:border-blue-900/40">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          💡 Tip: Ensure address is accurate and include COVID safety protocols or ID verification requirements if applicable
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 3. Offers & Facilities for Influencer */}
                  <Collapsible
                    open={expandedVisit.offers}
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
                          expandedVisit.offers && 'rotate-180'
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t border-border/60 bg-background space-y-4">
                      {/* Travel Reimbursement */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-foreground">Travel Reimbursement</Label>
                          <Switch
                            checked={Boolean(request.content.visitPromote?.travelReimbursement)}
                            disabled
                          />
                        </div>
                        {request.content.visitPromote?.travelReimbursement && (
                          <Input
                            placeholder="Amount or notes (e.g., ₹500 or Cab fare both ways)"
                            value={request.content.visitPromote?.travelAmount || ''}
                            readOnly
                            className="text-sm bg-muted/20 border-border/60 cursor-default"
                          />
                        )}
                      </div>

                      {/* Food/Refreshments */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-foreground">Food/Refreshments Provided</Label>
                          <Switch
                            checked={Boolean(request.content.visitPromote?.foodProvided)}
                            disabled
                          />
                        </div>
                        {request.content.visitPromote?.foodProvided && (
                          <Input
                            placeholder="Details (e.g., Lunch, Snacks, Beverages)"
                            value={request.content.visitPromote?.foodDetails || ''}
                            readOnly
                            className="text-sm bg-muted/20 border-border/60 cursor-default"
                          />
                        )}
                      </div>

                      {/* Stay Provided */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-foreground">Stay Provided (if outstation)</Label>
                          <Switch
                            checked={Boolean(request.content.visitPromote?.stayProvided)}
                            disabled
                          />
                        </div>
                        {request.content.visitPromote?.stayProvided && (
                          <Input
                            placeholder="Stay details (e.g., 4-star hotel stay)"
                            value={request.content.visitPromote?.stayDetails || ''}
                            readOnly
                            className="text-sm bg-muted/20 border-border/60 cursor-default"
                          />
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 4. Content Expectations */}
                  <Collapsible
                    open={expandedVisit.guidelines}
                    onOpenChange={() => toggleVisitSection('guidelines')}
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
                          expandedVisit.guidelines && 'rotate-180'
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t border-border/60 bg-background space-y-4">
                      <div>
                        <Label className="text-xs font-semibold text-foreground mb-1.5 block">Brief Description</Label>
                        <Textarea
                          placeholder="e.g., Shoot product demo inside the store, post 2 stories tagging us"
                          value={request.content.visitPromote?.contentDescription || request.content.visitPromote?.guidelines || ''}
                          readOnly
                          className="min-h-[80px] text-sm bg-muted/20 border-border/60 cursor-default"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-foreground mb-1.5 block">Hashtags to Use</Label>
                        <Input
                          placeholder="e.g., #BrandName #Fashion #NewCollection"
                          value={request.content.visitPromote?.hashtags || ''}
                          readOnly
                          className="text-sm bg-muted/20 border-border/60 cursor-default"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-foreground mb-1.5 block">Handles to Tag</Label>
                        <Input
                          placeholder="e.g., @brandname @storename"
                          value={request.content.visitPromote?.handlesToTag || ''}
                          readOnly
                          className="text-sm bg-muted/20 border-border/60 cursor-default"
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 5. Notes, Guidelines & Affiliate Links */}
                  <Collapsible
                    open={expandedVisit.links}
                    onOpenChange={() => toggleVisitSection('links')}
                    className="rounded-xl border border-border/70 overflow-hidden"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm text-foreground">5. Notes, Guidelines & Affiliate Links</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-muted-foreground transition-transform',
                          expandedVisit.links && 'rotate-180'
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
                          value={request.content.visitPromote?.specialGuidelines || request.content.visitPromote?.guidelines || ''}
                          readOnly
                          className="min-h-[80px] text-sm bg-muted/20 border-border/60 cursor-default"
                        />
                      </div>

                      {request.content.visitPromote?.affiliateLinks && request.content.visitPromote.affiliateLinks.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <Label className="text-xs font-semibold text-foreground block">
                            Campaign Affiliate & Promotion Links
                          </Label>
                          <div className="space-y-2">
                            {request.content.visitPromote.affiliateLinks.map((link, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2.5 bg-muted/40 rounded-lg border border-border/60 text-xs">
                                <span className="font-mono text-muted-foreground truncate mr-2">{link}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyLink(link)}
                                    className="h-7 px-2 text-xs"
                                  >
                                    {copiedLink === link ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(link, '_blank')}
                                    className="h-7 px-2 text-xs"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* CASE 3: UPLOAD FILES / PROVIDED CONTENT (Standard Image 1 view) */}
            {request.content && request.content.type !== 'polls' && request.content.type !== 'visit_promote' && (
              <Card className="border border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    {getContentTypeIcon(request.content.type)}
                    <span>{getContentTypeLabel(request.content.type)} Content</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Content requirements and creative assets provided by the business
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {/* Upload Files Content */}
                  {request.content.type === 'upload_files' && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Submitted Files ({request.content.files?.length || 0}):
                      </p>
                      {request.content.files && request.content.files.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {request.content.files.map((file, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/70 rounded-xl border border-border/70 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                  <Upload className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-medium text-foreground truncate">{file}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  toast({
                                    title: "Downloading File",
                                    description: `Downloading ${file}...`,
                                  });
                                }}
                                className="h-7 px-2 text-[11px] text-primary hover:bg-primary/10"
                              >
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No files uploaded for this request.</p>
                      )}
                    </div>
                  )}

                  {/* Provided Content */}
                  {request.content.type === 'provided_content' && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Creative Guidelines & Script:
                      </p>
                      <div className="p-4 bg-muted/30 rounded-xl border border-border/60 text-sm leading-relaxed text-foreground">
                        {request.content.description || 'No detailed content description provided.'}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions Panel */}
            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold">Fulfillment & Actions</CardTitle>
                <CardDescription className="text-xs">
                  Respond to this request or propose modified pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                {request.status === 'pending' ? (
                  <div className="space-y-4">
                    {/* Custom price & note inputs (matches Image 2 & user request) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-1">
                      <div className="space-y-2">
                        <Label htmlFor="detail-custom-price" className="text-xs font-semibold text-foreground">
                          Propose Custom Price (₹)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                          <Input
                            id="detail-custom-price"
                            type="number"
                            placeholder="Enter amount"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className="pl-8 text-sm font-semibold"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="detail-price-note" className="text-xs font-semibold text-foreground">
                          Add Note for Price Update
                        </Label>
                        <Input
                          id="detail-price-note"
                          type="text"
                          placeholder="e.g., Note explaining price change (scope, revisions, travel expenses)"
                          value={priceNote}
                          onChange={(e) => setPriceNote(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {request.priceNote && (
                      <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs flex items-start gap-2 text-amber-900 dark:text-amber-200">
                        <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Latest Price Proposal Note: </span>
                          <span>{request.priceNote}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={handleRejectRequest}
                        disabled={isUpdating}
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs px-4 h-9"
                      >
                        <X className="w-4 h-4 mr-1.5" />
                        <span>Reject Request</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleModifyPrice}
                        disabled={isUpdating}
                        className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs px-4 h-9"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        <span>Update Price</span>
                      </Button>

                      <Button
                        onClick={handleAcceptRequest}
                        disabled={isUpdating}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 h-9"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        <span>Accept Request (₹{customPrice || request.price})</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/60">
                    <div className="flex items-center gap-2.5">
                      {request.status === 'approved' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {request.status === 'rejected' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                      {request.status === 'completed' && <FileCheck className="w-5 h-5 text-purple-600" />}
                      <div>
                        <p className="text-sm font-bold text-foreground capitalize">
                          Request is {request.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.status === 'approved' 
                            ? 'You have approved this request. Please fulfill by the scheduled date.'
                            : request.status === 'rejected'
                              ? 'This request was rejected.'
                              : 'Order is in fulfillment pipeline.'}
                        </p>
                      </div>
                    </div>

                    {request.status === 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAcceptRequest}
                        className="text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        Re-evaluate & Accept
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivered Service Links & Notes Section (Moved to Bottom) */}
            {(request.status === 'approved' || request.status === 'completed') && (
              <Card className="border border-border/80 shadow-xs bg-white">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
                        Delivered Service Links & Notes
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        Post URLs and delivery notes for the service provided for this order
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingDelivery(!isEditingDelivery)}
                        className="h-9 text-xs gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>{isEditingDelivery ? 'Cancel' : 'Edit Details'}</span>
                      </Button>

                      {request.status !== 'completed' ? (
                        <Button
                          size="sm"
                          onClick={handleMarkAsCompleted}
                          disabled={isUpdating}
                          className="h-9 text-xs px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark as Completed</span>
                        </Button>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 font-semibold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 pt-2 space-y-3">
                  {/* Delivery Notes */}
                  <div className="rounded-xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Delivery Notes</span>
                    </div>
                    {isEditingDelivery ? (
                      <Textarea
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="Enter delivery notes and campaign summary..."
                        rows={3}
                        className="text-xs sm:text-sm bg-white mt-1"
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {deliveryNotes || "All campaign deliverables and sponsored content have been successfully produced and published across scheduled channels in accordance with the campaign brief."}
                      </p>
                    )}
                  </div>

                  {/* Platform 1: Instagram */}
                  <div className="rounded-xl border border-gray-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm">
                          <span className="font-semibold text-foreground">Instagram</span>
                          <span className="text-muted-foreground mx-1.5">•</span>
                          <span className="text-xs text-muted-foreground">Post / Reel / Story URL</span>
                        </div>
                        {isEditingDelivery ? (
                          <Input
                            value={deliveryInstagram}
                            onChange={(e) => setDeliveryInstagram(e.target.value)}
                            placeholder="https://instagram.com/p/..."
                            className="h-8 text-xs mt-1 w-full max-w-md"
                          />
                        ) : deliveryInstagram ? (
                          <a 
                            href={deliveryInstagram} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium mt-0.5 truncate"
                          >
                            {deliveryInstagram} <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <p className="text-xs italic text-muted-foreground mt-0.5">Delivery link not provided</p>
                        )}
                      </div>
                    </div>
                    {!isEditingDelivery && (
                      <div className="shrink-0">
                        {deliveryInstagram ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">Provided</Badge>
                        ) : (
                          <span className="text-xs italic text-muted-foreground">Not provided</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Platform 2: YouTube */}
                  <div className="rounded-xl border border-gray-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <Youtube className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm">
                          <span className="font-semibold text-foreground">YouTube</span>
                          <span className="text-muted-foreground mx-1.5">•</span>
                          <span className="text-xs text-muted-foreground">Video / Short URL</span>
                        </div>
                        {isEditingDelivery ? (
                          <Input
                            value={deliveryYoutube}
                            onChange={(e) => setDeliveryYoutube(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="h-8 text-xs mt-1 w-full max-w-md"
                          />
                        ) : deliveryYoutube ? (
                          <a 
                            href={deliveryYoutube} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium mt-0.5 truncate"
                          >
                            {deliveryYoutube} <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <p className="text-xs italic text-muted-foreground mt-0.5">Delivery link not provided</p>
                        )}
                      </div>
                    </div>
                    {!isEditingDelivery && (
                      <div className="shrink-0">
                        {deliveryYoutube ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">Provided</Badge>
                        ) : (
                          <span className="text-xs italic text-muted-foreground">Not provided</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Platform 3: Facebook */}
                  <div className="rounded-xl border border-gray-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Facebook className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm">
                          <span className="font-semibold text-foreground">Facebook</span>
                          <span className="text-muted-foreground mx-1.5">•</span>
                          <span className="text-xs text-muted-foreground">Post / Video URL</span>
                        </div>
                        {isEditingDelivery ? (
                          <Input
                            value={deliveryFacebook}
                            onChange={(e) => setDeliveryFacebook(e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="h-8 text-xs mt-1 w-full max-w-md"
                          />
                        ) : deliveryFacebook ? (
                          <a 
                            href={deliveryFacebook} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium mt-0.5 truncate"
                          >
                            {deliveryFacebook} <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <p className="text-xs italic text-muted-foreground mt-0.5">Delivery link not provided</p>
                        )}
                      </div>
                    </div>
                    {!isEditingDelivery && (
                      <div className="shrink-0">
                        {deliveryFacebook ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">Provided</Badge>
                        ) : (
                          <span className="text-xs italic text-muted-foreground">Not provided</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Platform 4: Twitter / X */}
                  <div className="rounded-xl border border-gray-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
                        <Twitter className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm">
                          <span className="font-semibold text-foreground">Twitter / X</span>
                          <span className="text-muted-foreground mx-1.5">•</span>
                          <span className="text-xs text-muted-foreground">Post / Tweet URL</span>
                        </div>
                        {isEditingDelivery ? (
                          <Input
                            value={deliveryTwitter}
                            onChange={(e) => setDeliveryTwitter(e.target.value)}
                            placeholder="https://x.com/..."
                            className="h-8 text-xs mt-1 w-full max-w-md"
                          />
                        ) : deliveryTwitter ? (
                          <a 
                            href={deliveryTwitter} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium mt-0.5 truncate"
                          >
                            {deliveryTwitter} <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <p className="text-xs italic text-muted-foreground mt-0.5">Delivery link not provided</p>
                        )}
                      </div>
                    </div>
                    {!isEditingDelivery && (
                      <div className="shrink-0">
                        {deliveryTwitter ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">Provided</Badge>
                        ) : (
                          <span className="text-xs italic text-muted-foreground">Not provided</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Edit Mode Save Button */}
                  {isEditingDelivery && (
                    <div className="flex items-center justify-end gap-2 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditingDelivery(false)}
                        className="h-8 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveDeliveryDetails}
                        disabled={isUpdating}
                        className="h-8 text-xs bg-primary text-white"
                      >
                        Save Delivery Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
