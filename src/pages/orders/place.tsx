
import React, { useState } from "react";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const influencerMock = {
  avatar:
    "https://picsum.photos/id/64/100/100",
  name: "Username",
  email: "Username@gmail.com",
  followers: [
    { platform: "Instagram", icon: <Instagram className="text-[#ff2667] w-5 h-5" />, value: "1M" },
    { platform: "Facebook", icon: <Facebook className="text-[#1773ea] w-5 h-5" />, value: "235K" },
    { platform: "YouTube", icon: <Youtube className="text-[#ff0000] w-5 h-5" />, value: "98K" },
    { platform: "Twitter", icon: <Twitter className="text-[#1DA1F2] w-5 h-5" />, value: "2M" },
  ],
};

const affiliatePlatforms = [
  { name: "Instagram", id: "instagram" },
  { name: "Facebook", id: "facebook" },
  { name: "Youtube", id: "youtube" },
  { name: "Twitter", id: "twitter" },
];

const timeSlots = [
  "09:00", "09:30", "10:15", "12:15", "12:15",
  "01:00", "02:30", "03:15", "04:00", "04:30",
];

export default function PlaceOrderPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "instagram",
    "facebook",
    "youtube",
    "twitter",
  ]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 1, 28)); // Feb 28, 2025
  const [selectedSlot, setSelectedSlot] = useState("03:15");
  const [files, setFiles] = useState<File[]>([]);
  // Dummy pricing
  const packageName = "Packagename-1: Insta/FB/Youtube";
  const packagePrice = 800;
  const couponDiscount = -100;
  const platformFee = 99;
  const total = packagePrice + couponDiscount + platformFee;

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

  const handleSendRequest = () => {
    // simulate order submission
    alert("Order sent!\n\n" + JSON.stringify({
      platforms: selectedPlatforms,
      affiliateLink,
      customMessage,
      selectedDate,
      selectedSlot,
      files: files.map(f => f.name),
    }, null, 2));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2 py-8">
      <div className="w-full max-w-6xl rounded-xl bg-white shadow-md p-6 flex flex-col md:flex-row gap-8">
        {/* Left Side */}
        <div className="flex-1 md:max-w-sm flex flex-col gap-7">
          <div>
            <h2 className="text-xl font-semibold mb-0">Place Order</h2>
            <div className="text-sm text-gray-500">Please fill out the form below to continue.</div>
          </div>
          {/* Profile */}
          <div className="flex items-center gap-4 bg-[#F1F0FB] rounded-lg px-5 py-4">
            <img src={influencerMock.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover border border-gray-300" />
            <div className="flex flex-col gap-1">
              <div className="text-base font-semibold">{influencerMock.name}</div>
              <div className="text-xs text-gray-700">{influencerMock.email}</div>
              <div className="flex items-center gap-2 mt-1">
                {influencerMock.followers.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {item.icon}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          {/* Follower counts */}
          <div className="flex items-center gap-6 mt-2 mb-3 pl-2">
            {influencerMock.followers.map((item, idx) => (
              <div key={idx} className="text-center flex flex-col items-center text-xs text-gray-700">
                <span className="font-semibold">{item.value}</span>
                <span className="capitalize">{item.platform.split(" ")[0]}</span>
              </div>
            ))}
          </div>
          {/* Affiliate Links */}
          <div>
            <label className="font-semibold text-base mb-1 block">Affiliate Links</label>
            <div className="flex gap-x-2 gap-y-2 flex-wrap mb-3">
              {affiliatePlatforms.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedPlatforms.includes(p.id)}
                    id={p.id}
                    onCheckedChange={() => handlePlatformChange(p.id)}
                  />
                  <label htmlFor={p.id} className="text-sm">{p.name}</label>
                </div>
              ))}
            </div>
            <Input
              placeholder="Provide your link"
              className="mb-3 bg-[#F1F0FB] border border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={affiliateLink}
              onChange={e => setAffiliateLink(e.target.value)}
            />
          </div>
          {/* Custom Message */}
          <Textarea
            className="resize-none bg-[#F1F0FB] border border-gray-200 min-h-[70px]"
            placeholder="Custom Message"
            value={customMessage}
            onChange={e => setCustomMessage(e.target.value)}
          />
          {/* Upload Files */}
          <div className="flex flex-col gap-2 mt-3">
            <label htmlFor="file-upload" className="block">
              <Button
                type="button"
                className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 text-white w-full py-2 rounded-md px-4 text-base font-semibold"
                asChild
              >
                <span>
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
              <div className="flex flex-wrap mt-2 gap-1 text-xs">{files.map(f => (
                <span key={f.name} className="bg-gray-100 px-2 py-0.5 rounded">{f.name}</span>
              ))}</div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          {/* Calendar and Time slots */}
          <div className="w-full">
            <div className="flex flex-col md:items-start md:px-4">
              <span className="px-2 py-1 rounded bg-[#9b87f5] text-white text-xs w-max mb-2">Select the date and the time:</span>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="pointer-events-auto"
                classNames={{
                  months: "flex flex-col",
                  caption_label: "font-medium",
                  // for more styling, adjust here as needed
                }}
                initialFocus
                // Ensures calendar is always open to Feb 2025 by default for demo
                defaultMonth={new Date(2025, 1)}
              />
              {/* Time Slots */}
              {selectedDate && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {timeSlots.map((slot, idx) => (
                    <button
                      key={slot}
                      type="button"
                      className={`py-1 px-4 rounded border
                        ${selectedSlot === slot ? "bg-[#fff] border-[#9b87f5] text-[#9b87f5] font-bold ring-2 ring-[#9b87f5]" : "bg-[#F1F0FB] border-gray-200"}
                        transition`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Order Details */}
          <div className="w-full md:px-4 mt-5">
            <div className="bg-white rounded-md border border-gray-100 px-4 pt-4 pb-2 shadow-sm w-full max-w-[320px]">
              <div className="mb-1 font-semibold text-base">Details</div>
              <div className="flex justify-between text-sm mb-1"><span>{packageName}</span> <span className="font-bold">{packagePrice}₹</span></div>
              <div className="flex justify-between text-sm mb-1 text-gray-500"><span>Coupon Code</span> <span>{couponDiscount}₹</span></div>
              <div className="flex justify-between text-sm mb-3 text-gray-500"><span>Platform Fee</span> <span>{platformFee}₹</span></div>
              <div className="flex justify-between items-center mt-2 font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{total}₹</span>
              </div>
            </div>
            {/* Send Request Button */}
            <Button
              onClick={handleSendRequest}
              className="mt-6 w-full py-3 px-8 bg-[#574ee1] hover:bg-[#443fb3] text-white font-semibold rounded-lg text-base transition"
              type="button"
            >
              Send Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
