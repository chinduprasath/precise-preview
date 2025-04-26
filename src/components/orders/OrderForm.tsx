
import React, { useState } from "react";
import { Instagram, Facebook, Youtube, Twitter, Paperclip, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface OrderFormProps {
  influencer: {
    id: string;
    name: string;
    image_url?: string;
    followers_instagram?: number;
    followers_facebook?: number;
    followers_youtube?: number;
    followers_twitter?: number;
  };
  onCancel: () => void;
}

const formatNumber = (num: number = 0): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

const affiliatePlatforms = [
  { name: "Instagram", id: "instagram", icon: <Instagram className="w-4 h-4 text-[#ff2667]" /> },
  { name: "Facebook", id: "facebook", icon: <Facebook className="w-4 h-4 text-[#1773ea]" /> },
  { name: "YouTube", id: "youtube", icon: <Youtube className="w-4 h-4 text-[#ff0000]" /> },
  { name: "Twitter", id: "twitter", icon: <Twitter className="w-4 h-4 text-[#1DA1F2]" /> },
];

const OrderForm: React.FC<OrderFormProps> = ({ influencer, onCancel }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const packagePrice = 800;
  const couponDiscount = -100;
  const platformFee = 99;
  const total = packagePrice + couponDiscount + platformFee;

  const handlePlatformChange = (id: string) => {
    setSelectedPlatforms(current =>
      current.includes(id)
        ? current.filter(v => v !== id)
        : [...current, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the order",
        variant: "destructive"
      });
      return;
    }

    // Here we would submit the order data
    toast({
      title: "Order Submitted",
      description: "Your order has been successfully submitted",
    });
    
    onCancel(); // Close the form after submission
  };

  // Generate next 30 days for date picker
  const next30Days = Array.from({ length: 30 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return d;
  });

  const timeSlots = selectedDate ? [
    "09:00", "09:30", "10:15", "12:15", "13:00", 
    "14:30", "15:15", "16:00", "16:30"
  ] : [];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      {/* Profile Section */}
      <div className="mb-6">
        <div className="flex items-center gap-4 bg-[#F1F0FB] rounded-lg px-5 py-4">
          <img
            src={influencer.image_url || 'https://picsum.photos/id/64/100/100'}
            alt={influencer.name}
            className="w-14 h-14 rounded-full object-cover border border-gray-300"
          />
          <div className="flex flex-col gap-1">
            <div className="text-base font-semibold">{influencer.name}</div>
            <div className="flex items-center gap-2 mt-1">
              {influencer.followers_instagram && (
                <span className="text-xs">
                  <Instagram className="inline w-4 h-4 text-[#ff2667] mr-1" />
                  {formatNumber(influencer.followers_instagram)}
                </span>
              )}
              {influencer.followers_facebook && (
                <span className="text-xs">
                  <Facebook className="inline w-4 h-4 text-[#1773ea] mr-1" />
                  {formatNumber(influencer.followers_facebook)}
                </span>
              )}
              {influencer.followers_youtube && (
                <span className="text-xs">
                  <Youtube className="inline w-4 h-4 text-[#ff0000] mr-1" />
                  {formatNumber(influencer.followers_youtube)}
                </span>
              )}
              {influencer.followers_twitter && (
                <span className="text-xs">
                  <Twitter className="inline w-4 h-4 text-[#1DA1F2] mr-1" />
                  {formatNumber(influencer.followers_twitter)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Links */}
      <div className="mb-6">
        <label className="font-semibold text-base mb-2 block">Affiliate Platforms</label>
        <div className="flex gap-x-4 gap-y-2 flex-wrap mb-3">
          {affiliatePlatforms.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedPlatforms.includes(p.id)}
                id={p.id}
                onCheckedChange={() => handlePlatformChange(p.id)}
              />
              <label htmlFor={p.id} className="text-sm flex items-center gap-1">
                {p.icon} {p.name}
              </label>
            </div>
          ))}
        </div>
        <Input
          placeholder="Paste your affiliate link"
          className="mb-3 bg-[#F1F0FB] border border-gray-200 text-sm"
          value={affiliateLink}
          onChange={(e) => setAffiliateLink(e.target.value)}
        />
      </div>

      {/* Custom Message */}
      <div className="mb-6">
        <Textarea
          className="resize-none bg-[#F1F0FB] border border-gray-200 min-h-[70px] text-sm"
          placeholder="Custom message or special instructions"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
        />
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label htmlFor="file-upload" className="block">
          <Button
            type="button"
            className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 text-white w-full py-2 rounded-md px-4 text-base font-semibold flex items-center justify-center"
            asChild
          >
            <span>
              <Paperclip className="mr-2 w-4 h-4 inline-block" />
              Upload Files
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </span>
          </Button>
        </label>
        {files.length > 0 && (
          <div className="flex flex-wrap mt-2 gap-1 text-xs">
            {files.map((f) => (
              <span key={f.name} className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500" /> {f.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Date & Time Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Date & Time</label>
        <div className="grid grid-cols-2 gap-4">
          <select
            className="bg-[#F1F0FB] border border-gray-200 rounded-md px-3 py-2 text-sm"
            value={selectedDate ? selectedDate.toISOString() : ""}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDate(val ? new Date(val) : undefined);
              setSelectedTime("");
            }}
          >
            <option value="">Pick a date</option>
            {next30Days.map((date) => (
              <option value={date.toISOString()} key={date.toISOString()}>
                {format(date, "PPP")}
              </option>
            ))}
          </select>

          <select
            className="bg-[#F1F0FB] border border-gray-200 rounded-md px-3 py-2 text-sm"
            value={selectedTime}
            disabled={timeSlots.length === 0}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">Pick a time slot</option>
            {timeSlots.map((time) => (
              <option value={time} key={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <div className="bg-[#F1F0FB] p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Package Price</span>
              <span>₹{packagePrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Coupon Discount</span>
              <span>₹{couponDiscount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#574ee1] hover:bg-[#443fb3] text-white"
        >
          Place Order
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;
