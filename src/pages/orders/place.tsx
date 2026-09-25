import React, { useState, useMemo, useRef } from "react";
import { Instagram, Facebook, Youtube, Twitter, Clock, ArrowLeft, FileText, Loader2, Link2, Tag, Sparkles, ShieldCheck } from "lucide-react";
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import DateTimePicker from "@/components/reach/DateTimePicker";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Import new components
import InfluencerProfileCard from '@/components/orders/place/InfluencerProfileCard';
import OrderTypeSelector from '@/components/orders/place/OrderTypeSelector';
import DescriptionInput from '@/components/orders/place/DescriptionInput';
import FileUploader from '@/components/orders/place/FileUploader';
import CouponSection from '@/components/orders/place/CouponSection';
import OrderSummary from '@/components/orders/place/OrderSummary';
import VisitPromoteTab from '@/components/orders/place/VisitPromoteTab';
import PollContentTab from '@/components/orders/place/PollContentTab';

const influencerMock = {
  avatar: "https://picsum.photos/id/64/100/100",
  name: "Gary Vaynerchuk",
  category: "Digital Marketing",
  location: "New York, USA",
  followers: [
    { platform: "Instagram", icon: <Instagram className="text-social-instagram w-5 h-5" />, value: "2.3M" },
    { platform: "Facebook", icon: <Facebook className="text-social-facebook w-5 h-5" />, value: "834K" },
    { platform: "YouTube", icon: <Youtube className="text-social-youtube w-5 h-5" />, value: "569K" },
    { platform: "Twitter", icon: <Twitter className="text-social-twitter w-5 h-5" />, value: "3.4M" },
  ],
};

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'text-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'text-blue-600' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: 'text-red-500' },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'text-blue-400' },
];

const availableCoupons = {
  "WELCOME10": { discount: 80, type: "fixed" },
  "NEWYEAR25": { discount: 200, type: "fixed" },
  "SAVE15": { discount: 15, type: "percentage" },
};

const contentTypesByOrder = {
  "Platform Based": [
    "Post Image/Video",
    "Reels/Shorts", 
    "Story (Image/Video)",
    "In-Video Promotion (<10 min)",
    "Promotions (>10 min)",
    "Polls",
    "Visit & Promote"
  ],
  "Custom Package": [
    "In-Video Promotion",
    "Promotion", 
    "Visit and Promotion"
  ]
};

// Dynamic suggestions based on description content
const generateDynamicHashtags = (text: string) => {
  const keywords = text.toLowerCase().split(/\s+/);
  const trendingHashtags = ["#trending", "#viral", "#fashion", "#lifestyle", "#brand", "#giveaway", "#sale", "#new", "#exclusive", "#limited"];
  
  // Filter hashtags based on content relevance
  return trendingHashtags.filter(tag => {
    const tagWord = tag.substring(1);
    return keywords.some(word => word.includes(tagWord) || tagWord.includes(word)) || 
           Math.random() > 0.6; // Add some randomness for trending tags
  }).slice(0, 5);
};

const businessProfiles = [
  { handle: "@brandname", platform: "instagram", icon: <Instagram className="w-4 h-4 text-pink-500" /> },
  { handle: "@companyofficial", platform: "facebook", icon: <Facebook className="w-4 h-4 text-blue-600" /> },
  { handle: "@yourstore", platform: "youtube", icon: <Youtube className="w-4 h-4 text-red-500" /> },
  { handle: "@businessofficial", platform: "twitter", icon: <Twitter className="w-4 h-4 text-blue-400" /> },
];

const generateContextualEmojis = (text: string) => {
  const lowerText = text.toLowerCase();
  const emojiMap = {
    'sale': ['🛍️', '💰', '🏷️'],
    'new': ['✨', '🆕', '🎉'],
    'fashion': ['👗', '💄', '👠'],
    'food': ['🍕', '🍰', '🥗'],
    'tech': ['📱', '💻', '⚡'],
    'fitness': ['💪', '🏃‍♀️', '🏋️'],
    'travel': ['✈️', '🌍', '📸'],
    'beauty': ['💄', '✨', '💅'],
    'love': ['❤️', '💖', '😍'],
  };
  
  let contextualEmojis = [];
  for (const [keyword, emojis] of Object.entries(emojiMap)) {
    if (lowerText.includes(keyword)) {
      contextualEmojis.push(...emojis);
    }
  }
  
  // Add general popular emojis
  const popularEmojis = ["🔥", "✨", "💯", "🎉", "👑", "💖"];
  contextualEmojis.push(...popularEmojis);
  
  return [...new Set(contextualEmojis)].slice(0, 6);
};

// Reusable professional section card
const SectionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ icon, title, description, children, className }) => (
  <section className={cn(
    "rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden",
    className
  )}>
    <header className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/30">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </header>
    <div className="p-5 space-y-5">{children}</div>
  </section>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function PlaceOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order details from navigation state
  const orderDetails = location.state || {};
  const { influencerName = "Gary Vaynerchuk", selectedItems = [], isVisitPromote = false } = orderDetails;
  
  const [affiliateLink, setAffiliateLink] = useState("");
  const [affiliateLinkError, setAffiliateLinkError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number, type: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);

  // New states for dropdowns
  const [selectedOrderType, setSelectedOrderType] = useState<string>("Platform Based");
  const [selectedContent, setSelectedContent] = useState<string>("Post Image/Video");
  const [selectedSinglePlatform, setSelectedSinglePlatform] = useState<string>("instagram");
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);

  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [notesDescription, setNotesDescription] = useState("");

  // Dynamic suggestions based on current description
  const dynamicHashtags = useMemo(() => generateDynamicHashtags(description), [description]);
  const contextualEmojis = useMemo(() => generateContextualEmojis(description), [description]);

  const packagePrice = 800;
  const platformFee = 99;
  
  const couponDiscount = appliedCoupon ? 
    appliedCoupon.type === "percentage" 
      ? Math.round(packagePrice * appliedCoupon.discount / 100) 
      : appliedCoupon.discount 
    : 0;
  
  const total = packagePrice - couponDiscount + platformFee;

  const validateAffiliateLink = (link: string) => {
    // Make affiliate link optional - no validation required if empty
    if (!link.trim()) {
      return "";
    }
    
    try {
      new URL(link);
      return "";
    } catch (e) {
      return "Please enter a valid URL";
    }
  };

  const validateDescription = (message: string) => {
    if (message.length > 500) {
      return "Description must be less than 500 characters";
    }
    return "";
  };

  const handleOrderTypeChange = (orderType: string) => {
    setSelectedOrderType(orderType);
    // Reset content to first option of new order type
    const newContentOptions = contentTypesByOrder[orderType as keyof typeof contentTypesByOrder];
    setSelectedContent(newContentOptions[0]);
  };

  const handleAffiliateLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setAffiliateLink(link);
    setAffiliateLinkError(validateAffiliateLink(link));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = e.target.value;
    setDescription(message);
    setDescriptionError(validateDescription(message));
  };

  const handleAiEnhance = () => {
    setIsAiEnhancing(true);
    // Simulate AI enhancement
    setTimeout(() => {
      const enhancedText = description + " ✨ Enhanced with trending hashtags and engaging content suggestions!";
      setDescription(enhancedText);
      setIsAiEnhancing(false);
      toast({
        title: "AI Enhancement Complete",
        description: "Your description has been enhanced with AI suggestions!",
        variant: "default"
      });
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDescription(prev => prev + (prev ? " " : "") + suggestion);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        setFiles(Array.from(e.target.files || []));
        setIsUploading(false);
      }, 1000);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-primary", "bg-primary/5");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary", "bg-primary/5");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary", "bg-primary/5");
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        setFiles(Array.from(e.dataTransfer.files));
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    const coupon = availableCoupons[couponCode as keyof typeof availableCoupons];
    if (coupon) {
      setAppliedCoupon({
        code: couponCode,
        discount: coupon.discount,
        type: coupon.type
      });
      toast({
        title: "Success",
        description: `Coupon ${couponCode} applied successfully!`,
        variant: "default"
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "This coupon code is not valid",
        variant: "destructive"
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed",
      variant: "default"
    });
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const linkError = validateAffiliateLink(affiliateLink);
    const messageError = validateDescription(description);
    
    setAffiliateLinkError(linkError);
    setDescriptionError(messageError);
    
    if (linkError || messageError) {
      toast({
        title: "Form Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    // Validate that either description or files are provided
    if (!description.trim() && files.length === 0) {
      toast({
        title: "Missing Content",
        description: "Please provide a description or upload files",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedDateTime) {
      toast({
        title: "Missing Selection",
        description: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowThankYouDialog(true);
      
      console.log({
        orderType: selectedOrderType,
        content: selectedContent,
        platform: selectedSinglePlatform,
        affiliateLink,
        description,
        selectedDateTime: selectedDateTime ? format(selectedDateTime, "PPP p") : undefined,
        files: files.map((f) => f.name),
        notesDescription,
        appliedCoupon,
        total
      });
    }, 1500);
  };

  const isSpecialFlow = selectedContent === "Visit & Promote" || selectedContent === "Polls";

  return (
    <Layout>
      <div className="flex-1 bg-muted/40 min-h-full">
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          {/* Page header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 bg-background"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Complete Your Order</h1>
                <p className="text-sm text-muted-foreground">
                  Review the details, add your content requirements and send the request to {influencerName}.
                </p>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Column 1 - Left side */}
            <div className="flex-1 w-full flex flex-col gap-5">
              {/* Influencer Card */}
              <InfluencerProfileCard influencer={influencerMock} />
              
              <SectionCard
                icon={<Sparkles className="w-5 h-5" />}
                title="Selected Order"
                description="Choose the package type, content format and platform"
              >
                <OrderTypeSelector
                  selectedOrderType={selectedOrderType}
                  selectedContent={selectedContent}
                  selectedSinglePlatform={selectedSinglePlatform}
                  onOrderTypeChange={handleOrderTypeChange}
                  onContentChange={setSelectedContent}
                  onPlatformChange={setSelectedSinglePlatform}
                  contentTypesByOrder={contentTypesByOrder}
                  socialPlatforms={socialPlatforms}
                  isCustomPackage={selectedOrderType === "Custom Package"}
                />
              </SectionCard>

              {/* Content section — Upload Files only, all content shown inline */}
              {!isSpecialFlow && (
                <SectionCard
                  icon={<FileText className="w-5 h-5" />}
                  title="Content Details"
                  description="Describe your request and attach any reference files"
                >
                  <DescriptionInput
                    description={description}
                    descriptionError={descriptionError}
                    isAiEnhancing={isAiEnhancing}
                    dynamicHashtags={dynamicHashtags}
                    businessProfiles={businessProfiles}
                    contextualEmojis={contextualEmojis}
                    onDescriptionChange={handleDescriptionChange}
                    onBlur={() => setDescriptionError(validateDescription(description))}
                    onAiEnhance={handleAiEnhance}
                    onSuggestionClick={handleSuggestionClick}
                  />
                  
                  <FileUploader
                    files={files}
                    isUploading={isUploading}
                    onFileChange={handleFileChange}
                    onRemoveFile={removeFile}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  />
                  
                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes-description" className="text-sm font-medium">
                      Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <textarea
                      id="notes-description"
                      placeholder="Add any additional instructions or notes for the influencer..."
                      className="w-full min-h-[90px] rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      value={notesDescription}
                      onChange={(e) => setNotesDescription(e.target.value)}
                      maxLength={300}
                    />
                    <div className="text-xs text-right text-muted-foreground">
                      {notesDescription.length}/300 characters
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>
            
            {/* Column 2 - Right side */}
            <aside className="w-full lg:w-[400px] shrink-0 flex flex-col gap-5 lg:sticky lg:top-20">
              {/* Date & Time */}
              <SectionCard
                icon={<Clock className="w-5 h-5" />}
                title={isSpecialFlow ? "Schedule Post" : "Select Date & Time"}
                description="When should this go live?"
              >
                <DateTimePicker
                  value={selectedDateTime}
                  onChange={setSelectedDateTime}
                  label=""
                  placeholder="Pick a date and time"
                />
              </SectionCard>

              {/* Affiliate Link */}
              <SectionCard
                icon={<Link2 className="w-5 h-5" />}
                title="Affiliate Link"
                description="Optional — track conversions from this post"
              >
                <Input
                  id="affiliate-link"
                  placeholder="https://example.com/your-affiliate-link"
                  className={cn(
                    "transition-all focus-visible:ring-primary",
                    affiliateLinkError && "border-destructive focus-visible:ring-destructive"
                  )}
                  value={affiliateLink}
                  onChange={handleAffiliateLinkChange}
                  onBlur={() => setAffiliateLinkError(validateAffiliateLink(affiliateLink))}
                />
                {affiliateLinkError && (
                  <p className="text-xs text-destructive">{affiliateLinkError}</p>
                )}
              </SectionCard>

              {/* Coupon */}
              <SectionCard
                icon={<Tag className="w-5 h-5" />}
                title="Coupon Code"
                description="Apply a discount to this order"
              >
                <CouponSection
                  couponCode={couponCode}
                  appliedCoupon={appliedCoupon}
                  onCouponCodeChange={setCouponCode}
                  onCouponApply={handleCouponApply}
                  onRemoveCoupon={removeCoupon}
                />
              </SectionCard>

              {/* Order Summary */}
              <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3.5">
                  <h2 className="text-sm font-semibold text-white tracking-tight">Order Summary</h2>
                </div>
                <div className="p-5">
                  <OrderSummary
                    selectedOrderType={selectedOrderType}
                    selectedContent={selectedContent}
                    selectedSinglePlatform={selectedSinglePlatform}
                    contentSubmissionMethod="upload"
                    packagePrice={packagePrice}
                    platformFee={platformFee}
                    couponDiscount={couponDiscount}
                    appliedCoupon={appliedCoupon}
                    total={total}
                    isSubmitting={isSubmitting}
                    socialPlatforms={socialPlatforms}
                    onPlatformChange={setSelectedSinglePlatform}
                    onSendRequest={handleSendRequest}
                    isCustomPackage={selectedOrderType === "Custom Package"}
                    formatCurrency={formatCurrency}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      <AlertDialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-center">
              Thank You!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-2">
              <p>Request has been sent to influencer successfully.</p>
              <p>The post will be automatically scheduled and published on the influencer's page.</p>
              <p>Once the posting is completed, you can track the results on the Reach page.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
