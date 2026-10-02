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
  FileImage,
  FileSpreadsheet,
  File,
  CheckCircle2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { getStoredOrderById, updateStoredOrder } from '@/data/orders';
import { Order, OrderStatus, SocialMediaLinks } from '@/types/order';

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

  // Social media links state
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinks>(
    initialOrder?.socialMediaLinks || {}
  );
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
      updatedAt: new Date().toISOString(),
    };
    updateStoredOrder(updatedOrder);
    setOrder(updatedOrder);
    setTimeout(() => {
      setIsSavingLinks(false);
      toast({
        title: 'Social Media Links Saved',
        description: 'Post URLs updated successfully.',
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
      updatedAt: new Date().toISOString(),
    };
    updateStoredOrder(updatedOrder);
    setOrder(updatedOrder);
    setIsModifyMode(false);
    toast({
      title: 'Order Modified',
      description: 'Order pricing and schedule updated successfully.',
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
                  Update price or scheduled date/time directly in the fields below.
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

          {/* Top 2 Cards Grid: Order Information & Schedule & Product */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Order Information */}
            <Card className="shadow-xs border-border/70 rounded-xl">
              <CardHeader className="pb-3 pt-5 px-6">
                <CardTitle className="text-base font-semibold text-foreground">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
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

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Status:</span>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Username:</span>
                  <span className="font-medium text-foreground">
                    {order.username || order.influencer?.name || 'Akash Singh'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Order Type:</span>
                  <span className="font-medium text-foreground">
                    {order.orderType || 'Instagram Reel'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Date & Time:</span>
                  <span className="font-medium text-foreground">{formatDateTime(order.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Amount:</span>
                  {isModifyMode ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">₹</span>
                      <Input
                        type="number"
                        className="w-28 h-8 text-sm font-semibold"
                        value={modifyAmount}
                        onChange={(e) => setModifyAmount(e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className="font-bold text-foreground text-base">
                      {formatCurrency(order.amount)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Schedule & Product */}
            <Card className="shadow-xs border-border/70 rounded-xl">
              <CardHeader className="pb-3 pt-5 px-6">
                <CardTitle className="text-base font-semibold text-foreground">Schedule & Product</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Scheduled Date:</span>
                  {isModifyMode ? (
                    <Input
                      type="date"
                      className="w-36 h-8 text-xs"
                      value={modifyDate}
                      onChange={(e) => setModifyDate(e.target.value)}
                    />
                  ) : (
                    <span className="font-medium text-foreground">
                      {order.scheduledDate || '10 Aug 2026'}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Scheduled Time:</span>
                  {isModifyMode ? (
                    <Input
                      type="time"
                      className="w-28 h-8 text-xs"
                      value={modifyTime}
                      onChange={(e) => setModifyTime(e.target.value)}
                    />
                  ) : (
                    <span className="font-medium text-foreground">
                      {order.scheduledTime || '19:30'}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Category:</span>
                  <span className="font-medium text-foreground">
                    {order.category || 'Travel'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-normal">Product/Service:</span>
                  <span className="font-medium text-foreground">
                    {order.productService || order.contentTypeName || 'Reel Video'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Content Card: Matches Image 2 "Provided Content" card format */}
          <Card className="shadow-xs border-border/70 rounded-xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <div className="flex items-center gap-2">
                {isPollOrder ? (
                  <BarChart className="w-4 h-4 text-muted-foreground" />
                ) : isVisitPromoteOrder ? (
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground" />
                )}
                <CardTitle className="text-base font-semibold text-foreground">
                  {isPollOrder
                    ? 'Poll Details'
                    : isVisitPromoteOrder
                    ? 'Visit & Promote Details'
                    : 'Provided Content'}
                </CardTitle>
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

              {/* Poll Specific Details */}
              {isPollOrder && order.content?.polls && order.content.polls.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-border/60">
                  <span className="text-xs font-medium text-muted-foreground block">
                    Poll Questions & Options:
                  </span>
                  {order.content.polls.map((poll, idx) => (
                    <div key={poll.id || idx} className="p-4 bg-muted/20 rounded-lg border border-border/60 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-background">
                          Question {idx + 1}
                        </Badge>
                        <p className="text-sm font-semibold text-foreground">{poll.question}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                        {poll.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="flex items-center gap-2.5 p-2.5 bg-background rounded-md border border-border/60 text-xs font-medium"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Visit & Promote Specific Details */}
              {isVisitPromoteOrder && order.content?.visitDetails && (
                <div className="space-y-4 pt-2 border-t border-border/60 text-xs">
                  <span className="text-xs font-medium text-muted-foreground block">
                    Visit Campaign Specifications:
                  </span>

                  {/* Visit Dates & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 rounded-lg border border-border/60">
                      <span className="text-muted-foreground block mb-1">Preferred Dates:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(order.content.visitDetails.preferredDates || ['2026-10-15']).map((d, i) => (
                          <Badge key={i} variant="outline" className="bg-background text-xs">
                            <Calendar className="w-3 h-3 mr-1 text-primary" />
                            {d}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-lg border border-border/60">
                      <span className="text-muted-foreground block mb-1">Preferred Time Window:</span>
                      <span className="text-sm font-semibold text-foreground">
                        {order.content.visitDetails.timeSlot || '11:00 AM - 03:00 PM'}
                      </span>
                    </div>
                  </div>

                  {/* Venue & Location */}
                  <div className="p-3 bg-muted/20 rounded-lg border border-border/60 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-semibold text-foreground block">
                        {order.content.visitDetails.venueName || 'Flagship Store'}
                      </span>
                      <p className="text-muted-foreground mt-0.5">
                        {order.content.visitDetails.fullAddress ||
                          order.content.visitDetails.location ||
                          'Mumbai, Maharashtra'}
                      </p>
                      {order.content.visitDetails.landmarkInfo && (
                        <p className="text-muted-foreground mt-0.5">
                          Landmark: {order.content.visitDetails.landmarkInfo}
                        </p>
                      )}
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        order.content.visitDetails.fullAddress ||
                          order.content.visitDetails.location ||
                          'Mumbai'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-background border border-border/70 rounded hover:bg-muted shrink-0"
                    >
                      <Compass className="w-3.5 h-3.5 text-primary" />
                      Map
                    </a>
                  </div>

                  {/* Perks / Hospitality */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 bg-muted/20 rounded-lg border border-border/60">
                      <span className="font-medium text-foreground block">Food & Beverages:</span>
                      <span className="text-muted-foreground">
                        {order.content.visitDetails.foodProvided || order.content.visitDetails.offers?.food
                          ? order.content.visitDetails.foodDetails || 'Complimentary catering'
                          : 'Not Included'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-muted/20 rounded-lg border border-border/60">
                      <span className="font-medium text-foreground block">Travel Allowance:</span>
                      <span className="text-muted-foreground">
                        {order.content.visitDetails.travelReimbursement || order.content.visitDetails.offers?.travel
                          ? order.content.visitDetails.travelAmount || 'Reimbursed by brand'
                          : 'Not Included'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-muted/20 rounded-lg border border-border/60">
                      <span className="font-medium text-foreground block">Hotel / Stay:</span>
                      <span className="text-muted-foreground">
                        {order.content.visitDetails.stayProvided || order.content.visitDetails.offers?.stay
                          ? order.content.visitDetails.stayDetails || 'Hotel stay arranged'
                          : 'Not Included'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Media Links Card: Matches Image 2 */}
          <Card className="shadow-xs border-border/70 rounded-xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="text-base font-semibold text-foreground">Social Media Links</CardTitle>
              <p className="text-xs text-muted-foreground">Add URLs to the social media posts for this order</p>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {/* Instagram Row */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="https://instagram.com/p/..."
                    value={socialMediaLinks.instagram || ''}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    className="h-10 text-sm bg-muted/20 border-border/60 focus-visible:bg-background"
                  />
                </div>
                {isValidUrl(socialMediaLinks.instagram) && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" asChild>
                    <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Facebook Row */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="https://facebook.com/..."
                    value={socialMediaLinks.facebook || ''}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    className="h-10 text-sm bg-muted/20 border-border/60 focus-visible:bg-background"
                  />
                </div>
                {isValidUrl(socialMediaLinks.facebook) && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" asChild>
                    <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* YouTube Row */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="https://youtube.com/shorts/..."
                    value={socialMediaLinks.youtube || ''}
                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                    className="h-10 text-sm bg-muted/20 border-border/60 focus-visible:bg-background"
                  />
                </div>
                {isValidUrl(socialMediaLinks.youtube) && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" asChild>
                    <a href={socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Twitter Row */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-sky-500" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="https://twitter.com/..."
                    value={socialMediaLinks.twitter || ''}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    className="h-10 text-sm bg-muted/20 border-border/60 focus-visible:bg-background"
                  />
                </div>
                {isValidUrl(socialMediaLinks.twitter) && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" asChild>
                    <a href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">
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
        </div>
      </div>
    </Layout>
  );
}
