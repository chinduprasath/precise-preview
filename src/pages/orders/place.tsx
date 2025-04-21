
import React, { useState, useMemo } from "react";
import { Instagram, Facebook, Youtube, Twitter, Paperclip, Check } from "lucide-react";
import BusinessSidebar from "@/components/layout/BusinessSidebar";
import BusinessTopbar from "@/components/layout/BusinessTopbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const influencerMock = {
  avatar: "https://picsum.photos/id/64/100/100",
  name: "Gary Vaynerchuk",
  email: "garyv@example.com",
  followers: [
    { platform: "Instagram", icon: <Instagram className="text-[#ff2667] w-5 h-5" />, value: "2.3M" },
    { platform: "Facebook", icon: <Facebook className="text-[#1773ea] w-5 h-5" />, value: "834K" },
    { platform: "YouTube", icon: <Youtube className="text-[#ff0000] w-5 h-5" />, value: "569K" },
    { platform: "Twitter", icon: <Twitter className="text-[#1DA1F2] w-5 h-5" />, value: "3.4M" },
  ],
};

const affiliatePlatforms = [
  { name: "Instagram", id: "instagram", icon: <Instagram className="w-4 h-4 text-[#ff2667]" /> },
  { name: "Facebook", id: "facebook", icon: <Facebook className="w-4 h-4 text-[#1773ea]" /> },
  { name: "YouTube", id: "youtube", icon: <Youtube className="w-4 h-4 text-[#ff0000]" /> },
  { name: "Twitter", id: "twitter", icon: <Twitter className="w-4 h-4 text-[#1DA1F2]" /> },
];

// Mock: date -> time slots
const mockTimeSlotsForDate = (date: Date | undefined) => {
  if (!date) return [];
  // For Saturdays/Sundays: less slots
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  return isWeekend
    ? ["10:00", "12:00", "16:00"]
    : ["09:00", "09:30", "10:15", "12:15", "13:00", "14:30", "15:15", "16:00", "16:30"];
};

export default function PlaceOrderPage() {
  // Form state
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  // Dummy pricing
  const packageName = "Packagename-1: Insta/FB/Youtube";
  const packagePrice = 800;
  const couponDiscount = -100;
  const platformFee = 99;
  const total = packagePrice + couponDiscount + platformFee;

  const timeSlots = useMemo(() => mockTimeSlotsForDate(selectedDate), [selectedDate]);

  // Form logic
  const handlePlatformChange = (id: string) => {
    setSelectedPlatforms((current) =>
      current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Would submit order to backend (use toast for demo)
    alert(
      "Order sent!\n\n" +
        JSON.stringify(
          {
            platforms: selectedPlatforms,
            affiliateLink,
            customMessage,
            selectedDate: selectedDate ? format(selectedDate, "PPP") : undefined,
            selectedTime,
            files: files.map((f) => f.name),
          },
          null,
          2
        )
    );
  };

  // Generate next 30 days for date picker
  const next30Days = Array.from({ length: 30 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return d;
  });

  return (
    <div className="min-h-screen flex bg-[#F1F0FB]">
      <BusinessSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <BusinessTopbar />
        <form
          onSubmit={handleSendRequest}
          className="flex-1 flex justify-center px-1 py-10 md:py-16"
        >
          <div className="w-full max-w-5xl rounded-xl bg-white shadow-2xl p-0 flex flex-col md:flex-row gap-12 border border-gray-100">
            {/* Left Side: Profile + platforms + upload */}
            <div className="flex-1 md:max-w-sm flex flex-col gap-7 p-8">
              {/* Profile */}
              <div>
                <div className="flex items-center gap-4 bg-[#F1F0FB] rounded-lg px-5 py-4">
                  <img
                    src={influencerMock.avatar}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full object-cover border border-gray-300"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="text-base font-semibold">{influencerMock.name}</div>
                    <div className="text-xs text-gray-700">{influencerMock.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {influencerMock.followers.map((item, idx) => (
                        <React.Fragment key={idx}>{item.icon}</React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Follower counts */}
                <div className="flex items-center gap-6 mt-2 mb-3 pl-2">
                  {influencerMock.followers.map((item, idx) => (
                    <div key={idx} className="text-center flex flex-col items-center text-xs text-gray-700">
                      <span className="font-semibold">{item.value}</span>
                      <span className="capitalize">{item.platform}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Affiliate Links */}
              <div>
                <label className="font-semibold text-base mb-1 block">Affiliate Platforms</label>
                <div className="flex gap-x-2 gap-y-2 flex-wrap mb-2">
                  {affiliatePlatforms.map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedPlatforms.includes(p.id)}
                        id={p.id}
                        onCheckedChange={() => handlePlatformChange(p.id)}
                      />
                      <label htmlFor={p.id} className="text-sm flex items-center gap-1">{p.icon} {p.name}</label>
                    </div>
                  ))}
                </div>
                <Input
                  placeholder="Paste your affiliate link"
                  className="mb-3 bg-[#F1F0FB] border border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs"
                  value={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.value)}
                />
              </div>
              {/* Custom Message */}
              <Textarea
                className="resize-none bg-[#F1F0FB] border border-gray-200 min-h-[70px] text-sm"
                placeholder="Custom message or special instructions"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
              {/* Upload Files */}
              <div className="flex flex-col gap-2 mt-3">
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
            </div>
            {/* Right Side: Date + Time + Order details */}
            <div className="flex-1 flex flex-col items-center md:items-start py-8 px-4">
              {/* Date & Time Picker */}
              <div className="w-full max-w-xs mb-8">
                <span className="px-2 py-1 rounded bg-[#9b87f5] text-white text-xs w-max mb-3 inline-block">
                  Select the date and the time:
                </span>
                {/* Date dropdown */}
                <div className="mb-4">
                  <select
                    className="w-full bg-[#F1F0FB] border border-gray-200 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]"
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
                </div>
                {/* Time slots dropdown */}
                <div>
                  <select
                    className="w-full bg-[#F1F0FB] border border-gray-200 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]"
                    value={selectedTime}
                    disabled={timeSlots.length === 0}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Pick a time slot</option>
                    {timeSlots.map((time) => (
                      <option value={time} key={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Helper: show currently selected */}
                {selectedDate && selectedTime &&
                  <div className="mt-3 text-sm text-[#7E69AB]">Selected: {format(selectedDate, "PPP")} at {selectedTime}</div>
                }
              </div>
              {/* Order Details */}
              <div className="w-full max-w-xs mb-3">
                <div className="bg-white rounded-md border border-gray-100 px-4 pt-4 pb-2 shadow-sm w-full">
                  <div className="mb-1 font-semibold text-base">Order Details</div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{packageName}</span>
                    <span className="font-bold">{packagePrice}₹</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1 text-gray-500">
                    <span>Coupon Discount</span>
                    <span>{couponDiscount}₹</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3 text-gray-500">
                    <span>Platform Fee</span>
                    <span>{platformFee}₹</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{total}₹</span>
                  </div>
                </div>
                {/* Send Request Button */}
                <Button
                  type="submit"
                  className="mt-6 w-full py-3 px-8 bg-[#574ee1] hover:bg-[#443fb3] text-white font-semibold rounded-lg text-base transition"
                >
                  Send Request
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
