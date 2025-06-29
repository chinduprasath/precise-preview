import React, { useState, useMemo, useCallback, useRef } from "react";
import { Instagram, Facebook, Youtube, Twitter, Paperclip, Check, Clock, Upload, X, Loader2, Tag, FileText, Calendar } from "lucide-react";
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DateTimePicker from "@/components/reach/DateTimePicker";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router-dom";

const influencerMock = {
  avatar: "https://picsum.photos/id/64/100/100",
  name: "Gary Vaynerchuk",
  email: "garyv@example.com",
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

const contentTypes = [
  "Post (Image/Video)",
  "Reels / Shorts", 
  "Story",
  "Polls",
  "In-Video Promotion",
  "Promotion",
  "Visit and Promotion"
];

export default function PlaceOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order details from navigation state
  const orderDetails = location.state || {};
  const { influencerName = "Gary Vaynerchuk", selectedItems = [], isVisitPromote = false } = orderDetails;
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
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
  
  // New states for content input option
  const [contentSubmissionMethod, setContentSubmissionMethod] = useState<'upload' | 'describe'>('upload');
  const [contentDescription, setContentDescription] = useState("");
  const [contentDescriptionError, setContentDescriptionError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const packageName = selectedItems.length > 0 ? selectedItems[0] : "Selected Package";
  const orderType = packageName.includes("Instagram") || packageName.includes("Facebook") || packageName.includes("YouTube") || packageName.includes("Twitter") ? "Platform Based" : "Custom Package";
  const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)]; // This should come from actual selection
  const packagePrice = 800;
  const platformFee = 99;
  
  const couponDiscount = appliedCoupon ? 
    appliedCoupon.type === "percentage" 
      ? Math.round(packagePrice * appliedCoupon.discount / 100) 
      : appliedCoupon.discount 
    : 0;
  
  const total = packagePrice - couponDiscount + platformFee;

  const validateAffiliateLink = (link: string) => {
    if (!link.trim()) {
      return "Affiliate link is required";
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

  const validateContentDescription = (description: string) => {
    if (contentSubmissionMethod === 'describe' && !description.trim()) {
      return "Content description is required";
    }
    if (description.length > 500) {
      return "Description must be less than 500 characters";
    }
    return "";
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
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

  const handleContentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const desc = e.target.value;
    setContentDescription(desc);
    setContentDescriptionError(validateContentDescription(desc));
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

  const handleContentMethodChange = (method: 'upload' | 'describe') => {
    setContentSubmissionMethod(method);
    // Clear any validation errors when switching methods
    if (method === 'upload') {
      setContentDescriptionError("");
    } else {
      setFiles([]);
    }
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const linkError = validateAffiliateLink(affiliateLink);
    const messageError = validateDescription(description);
    const descError = validateContentDescription(contentDescription);
    
    setAffiliateLinkError(linkError);
    setDescriptionError(messageError);
    setContentDescriptionError(descError);
    
    if (linkError || messageError || descError) {
      toast({
        title: "Form Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Missing Selection",
        description: "Please select at least one platform",
        variant: "destructive"
      });
      return;
    }

    // Validate content submission based on method
    if (contentSubmissionMethod === 'upload' && files.length === 0) {
      toast({
        title: "Missing Content",
        description: "Please upload content files or switch to describe content option",
        variant: "destructive"
      });
      return;
    }

    if (contentSubmissionMethod === 'describe' && !contentDescription.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide a description or switch to upload files option",
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
        platforms: selectedPlatforms,
        affiliateLink,
        description,
        selectedDateTime: selectedDateTime ? format(selectedDateTime, "PPP p") : undefined,
        contentSubmissionMethod,
        files: contentSubmissionMethod === 'upload' ? files.map((f) => f.name) : [],
        contentDescription: contentSubmissionMethod === 'describe' ? contentDescription : '',
        appliedCoupon,
        total: contentSubmissionMethod === 'upload' ? total : 'To be quoted'
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="flex-1 flex justify-center px-4 py-10 md:py-16 max-w-7xl mx-auto w-full">
        <div className="w-full flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-7">
            <Card className="rounded-xl overflow-hidden border-0 shadow-md bg-white dark:bg-card">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-[#9b87f5]/90 to-[#7E69AB]/90 p-5 flex items-center gap-4 text-white">
                  <div className="relative">
                    <img
                      src={influencerMock.avatar}
                      alt="Influencer Avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">{influencerMock.name}</h3>
                    <p className="text-sm text-white/90">{influencerMock.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-border border-t">
                  {influencerMock.followers.map((item, idx) => (
                    <div key={idx} className="p-3 text-center group transition-all hover:bg-accent cursor-default">
                      <div className="flex justify-center mb-1 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="font-semibold text-sm">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.platform}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Updated Selected Order Display */}
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Check className="w-5 h-5 text-primary/80" />
                Selected Order
              </Label>
              <Card className="p-4 border border-border">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Order Type:</span>
                    <span className="text-foreground">{orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Content:</span>
                    <span className="text-foreground">{contentType}</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary/80" />
                How would you like to provide the content?
              </Label>
              
              <RadioGroup 
                value={contentSubmissionMethod} 
                onValueChange={(value) => handleContentMethodChange(value as 'upload' | 'describe')}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload" className="text-sm font-medium cursor-pointer">
                    Upload Files
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="describe" id="describe" />
                  <Label htmlFor="describe" className="text-sm font-medium cursor-pointer">
                    Describe What to Create
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {contentSubmissionMethod === 'upload' ? (
              <div>
                <Label className="text-sm mb-3 block">Upload Files</Label>
                
                <div
                  ref={dropAreaRef}
                  className="border-2 border-dashed border-border rounded-lg p-6 transition-all cursor-pointer hover:bg-accent/30"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                        <p className="text-sm text-muted-foreground">Uploading files...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-primary mb-2" />
                        <p className="text-sm font-medium mb-1">Drag & drop files here</p>
                        <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          Select Files
                        </Button>
                      </>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm block">Selected Files ({files.length})</Label>
                    <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                      {files.map((file, index) => (
                        <div 
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between bg-accent/50 p-2 rounded-md text-sm"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Label 
                  htmlFor="content-description" 
                  className={cn(
                    "text-sm mb-1.5 block",
                    contentDescriptionError && "text-destructive"
                  )}
                >
                  Content Description {contentDescriptionError && `(${contentDescriptionError})`}
                </Label>
                <Textarea
                  id="content-description"
                  placeholder="Describe what kind of content you want the influencer to create. E.g., 'Create a video story promoting our eco-friendly shoes. Include discount, brand colors, and a call to action.'"
                  className={cn(
                    "min-h-[120px] resize-none transition-all focus-visible:ring-primary",
                    contentDescriptionError && "border-destructive focus-visible:ring-destructive"
                  )}
                  value={contentDescription}
                  onChange={handleContentDescriptionChange}
                  onBlur={() => setContentDescriptionError(validateContentDescription(contentDescription))}
                />
                <div className="mt-1 text-xs text-right text-muted-foreground">
                  {contentDescription.length}/500 characters
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary/80" />
                  Select Date & Time
                </Label>
                
                <DateTimePicker
                  value={selectedDateTime}
                  onChange={setSelectedDateTime}
                  label=""
                  placeholder="Pick a date and time"
                />
              </div>
              
              <div className="space-y-4 pt-4 border-t border-border">
                <Label 
                  htmlFor="description" 
                  className={cn(
                    "text-base font-semibold block",
                    descriptionError && "text-destructive"
                  )}
                >
                  Description {descriptionError && `(${descriptionError})`}
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add any specific instructions or details about your request..."
                  className={cn(
                    "min-h-[100px] resize-none transition-all focus-visible:ring-primary",
                    descriptionError && "border-destructive focus-visible:ring-destructive"
                  )}
                  value={description}
                  onChange={handleDescriptionChange}
                  onBlur={() => setDescriptionError(validateDescription(description))}
                />
                <div className="mt-1 text-xs text-right text-muted-foreground">
                  {description.length}/500 characters
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <Label 
                  htmlFor="affiliate-link" 
                  className={cn(
                    "text-sm mb-1.5 block",
                    affiliateLinkError && "text-destructive"
                  )}
                >
                  Affiliate Link {affiliateLinkError && `(${affiliateLinkError})`}
                </Label>
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
              </div>

              {/* Updated Pages & Platforms Section */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Pages</Label>
                  
                  <div className="flex gap-2">
                    {socialPlatforms.map(platform => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => handlePlatformToggle(platform.id)}
                        className={cn(
                          "p-2 rounded-lg border transition-all",
                          selectedPlatforms.includes(platform.id)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-accent",
                          platform.color
                        )}
                      >
                        {platform.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-border">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary/80" />
                  Coupon Code
                </Label>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={!!appliedCoupon}
                    className="flex-1"
                  />
                  {appliedCoupon ? (
                    <Button
                      variant="outline"
                      className="whitespace-nowrap"
                      onClick={removeCoupon}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="whitespace-nowrap"
                      onClick={handleCouponApply}
                    >
                      Apply
                    </Button>
                  )}
                </div>
                
                {appliedCoupon && (
                  <div className="text-sm text-primary flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>
                      Coupon <span className="font-medium">{appliedCoupon.code}</span> applied: 
                      {appliedCoupon.type === "percentage" 
                        ? ` ${appliedCoupon.discount}% off`
                        : ` ${appliedCoupon.discount}₹ off`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Updated Order Summary */}
            <Card className="mt-auto">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold">Order Summary</h3>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Order Details</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium text-foreground">{orderType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Content:</span>
                        <span className="font-medium text-foreground">{contentType}</span>
                      </div>
                      {selectedPlatforms.length > 0 && (
                        <div className="flex justify-between">
                          <span>Platforms:</span>
                          <span className="font-medium text-foreground">
                            {selectedPlatforms.map(id => 
                              socialPlatforms.find(p => p.id === id)?.name
                            ).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {contentSubmissionMethod === 'upload' ? (
                    <div className="space-y-1.5 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className={cn(
                          "transition-all",
                          appliedCoupon ? "text-primary" : "text-muted-foreground"
                        )}>
                          Coupon Discount
                        </span>
                        <span className={cn(
                          appliedCoupon ? "text-primary font-medium" : "text-muted-foreground"
                        )}>
                          {couponDiscount ? `-${couponDiscount}₹` : "—"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform Fee</span>
                        <span className="text-muted-foreground">{platformFee}₹</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2 border-t">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Posting Fee (Fixed):</span>
                          <span className="font-bold">₹800</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Custom Content Creation Fee:</span>
                          <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-md text-xs font-medium">
                            To be quoted
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md border">
                        <div className="text-sm text-muted-foreground">
                          <strong>Note:</strong> Your request will be reviewed by the influencer. A custom quote for content creation will be shared based on your description.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              {contentSubmissionMethod === 'upload' && (
                <div className="px-6 py-4 bg-muted/30 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-xl font-bold">{total}₹</span>
                  </div>
                </div>
              )}
              
              <CardFooter className="pt-6">
                <Button
                  type="button"
                  className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#8b77e5] hover:to-[#6E59AB] transition-all py-6 text-base"
                  onClick={handleSendRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : contentSubmissionMethod === 'upload' ? (
                    "Send Request"
                  ) : (
                    "Send Request for Quote"
                  )}
                </Button>
              </CardFooter>
            </Card>
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
              {contentSubmissionMethod === 'upload' ? (
                <>
                  <p>Request has been sent to influencer successfully.</p>
                  <p>The post will be automatically scheduled and published on the influencer's page.</p>
                  <p>Once the posting is completed, you can track the results on the Reach page.</p>
                </>
              ) : (
                <>
                  <p>Your request for quote has been sent to the influencer successfully.</p>
                  <p>The influencer will review your content requirements and provide a custom quote.</p>
                  <p>You'll receive a notification once the quote is ready for review.</p>
                </>
              )}
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
