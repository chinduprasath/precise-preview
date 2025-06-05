import React, { useState, useMemo, useCallback, useRef } from "react";
import { Instagram, Facebook, Youtube, Twitter, Paperclip, Check, Clock, Upload, X, Loader2, Tag, FileText } from "lucide-react";
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScheduleSelector } from "@/components/orders/ScheduleSelector";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

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

const affiliatePlatforms = [
  { name: "Instagram", id: "instagram", icon: <Instagram className="w-5 h-5 text-social-instagram" />, color: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white" },
  { name: "Facebook", id: "facebook", icon: <Facebook className="w-5 h-5 text-social-facebook" />, color: "bg-[#1877f2] text-white" },
  { name: "YouTube", id: "youtube", icon: <Youtube className="w-5 h-5 text-social-youtube" />, color: "bg-[#ff0000] text-white" },
  { name: "Twitter", id: "twitter", icon: <Twitter className="w-5 h-5 text-social-twitter" />, color: "bg-[#1da1f2] text-white" },
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 18 && minute === 30) continue;
      
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const formattedMinute = minute === 0 ? '00' : minute;
      
      slots.push({
        label: `${displayHour}:${formattedMinute} ${period}`,
        value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      });
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const availableCoupons = {
  "WELCOME10": { discount: 80, type: "fixed" },
  "NEWYEAR25": { discount: 200, type: "fixed" },
  "SAVE15": { discount: 15, type: "percentage" },
};

interface TimeSelection {
  hour: string;
  minute: string;
  period: string;
}

export default function PlaceOrderPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [affiliateLinkError, setAffiliateLinkError] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [customMessageError, setCustomMessageError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<TimeSelection>({
    hour: '',
    minute: '',
    period: ''
  });
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

  const packageName = "Packagename-1: Insta/FB/Youtube";
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

  const validateCustomMessage = (message: string) => {
    if (message.length > 500) {
      return "Message must be less than 500 characters";
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

  const handlePlatformChange = (values: string[]) => {
    setSelectedPlatforms(values);
  };

  const handleAffiliateLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setAffiliateLink(link);
    setAffiliateLinkError(validateAffiliateLink(link));
  };

  const handleCustomMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = e.target.value;
    setCustomMessage(message);
    setCustomMessageError(validateCustomMessage(message));
  };

  const handleContentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    setContentDescription(description);
    setContentDescriptionError(validateContentDescription(description));
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
    const messageError = validateCustomMessage(customMessage);
    const descriptionError = validateContentDescription(contentDescription);
    
    setAffiliateLinkError(linkError);
    setCustomMessageError(messageError);
    setContentDescriptionError(descriptionError);
    
    if (linkError || messageError || descriptionError) {
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
    
    if (!selectedDate || !selectedTime.hour || !selectedTime.minute || !selectedTime.period) {
      toast({
        title: "Missing Selection",
        description: "Please select both date and time",
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
        customMessage,
        selectedDate: selectedDate ? format(selectedDate, "PPP") : undefined,
        selectedTime,
        contentSubmissionMethod,
        files: contentSubmissionMethod === 'upload' ? files.map((f) => f.name) : [],
        contentDescription: contentSubmissionMethod === 'describe' ? contentDescription : '',
        appliedCoupon,
        total: contentSubmissionMethod === 'upload' ? total : 'To be quoted'
      });
    }, 1500);
  };

  const navigate = useNavigate();

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
            
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-5 h-5 text-primary/80" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Affiliate Platforms
              </Label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {affiliatePlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={cn(
                      "relative cursor-pointer rounded-lg overflow-hidden transition-all",
                      selectedPlatforms.includes(platform.id) 
                        ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-background" 
                        : "opacity-70 hover:opacity-100"
                    )}
                    onClick={() => {
                      if (selectedPlatforms.includes(platform.id)) {
                        setSelectedPlatforms(selectedPlatforms.filter(id => id !== platform.id));
                      } else {
                        setSelectedPlatforms([...selectedPlatforms, platform.id]);
                      }
                    }}
                  >
                    <div className={cn(
                      "flex items-center gap-2 p-3 transition-all",
                      platform.color
                    )}>
                      {platform.icon}
                      <span className="font-medium text-sm">{platform.name}</span>
                      
                      {selectedPlatforms.includes(platform.id) && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
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
                  Schedule
                </Label>
                
                <ScheduleSelector
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                />
              </div>
              
              <div className="space-y-4 pt-4 border-t border-border">
                <Label 
                  htmlFor="custom-message" 
                  className={cn(
                    "text-base font-semibold block",
                    customMessageError && "text-destructive"
                  )}
                >
                  Custom Message {customMessageError && `(${customMessageError})`}
                </Label>
                <Textarea
                  id="custom-message"
                  placeholder="Add any specific instructions or details about your request..."
                  className={cn(
                    "min-h-[100px] resize-none transition-all focus-visible:ring-primary",
                    customMessageError && "border-destructive focus-visible:ring-destructive"
                  )}
                  value={customMessage}
                  onChange={handleCustomMessageChange}
                  onBlur={() => setCustomMessageError(validateCustomMessage(customMessage))}
                />
                <div className="mt-1 text-xs text-right text-muted-foreground">
                  {customMessage.length}/500 characters
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
            
            <Card className="mt-auto">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold">Order Summary</h3>
              </CardHeader>
              <CardContent className="pb-4">
                {contentSubmissionMethod === 'upload' ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm">{packageName}</span>
                      <span className="font-medium">{packagePrice}₹</span>
                    </div>
                    
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
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">{packageName}</span>
                    </div>
                    
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
                        <strong>Note:</strong> Your request will be reviewed by the influencer. A custom quote for content creation will be shared based on your description. Once approved, the final total will be calculated.
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      <strong>Estimated Range:</strong> ₹800 (base) + ₹0 – ₹700 (content) = <span className="font-bold">₹800 – ₹1,500</span>
                    </div>
                  </div>
                )}
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
