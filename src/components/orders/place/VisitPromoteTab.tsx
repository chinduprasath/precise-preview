
import React, { useState } from 'react';
import { Calendar, MapPin, Gift, FileText, Users, Clock, CalendarDays } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface VisitPromoteTabProps {
  onSendRequest: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const VisitPromoteTab: React.FC<VisitPromoteTabProps> = ({
  onSendRequest,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    preferredDates: '',
    timeSlot: 'Flexible',
    venueName: '',
    fullAddress: '',
    googleMapsLink: '',
    landmarkInfo: '',
    travelReimbursement: false,
    travelAmount: '',
    foodProvided: false,
    foodDetails: '',
    stayProvided: false,
    stayDetails: '',
    giftsVouchers: '',
    otherPerks: '',
    contentDescription: '',
    hashtags: '',
    handlesToTag: '',
    specialGuidelines: '',
  });

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    location: false,
    offers: false,
    content: false,
    notes: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDates(prev => {
        const dateExists = prev.some(d => d.toDateString() === date.toDateString());
        if (dateExists) {
          return prev.filter(d => d.toDateString() !== date.toDateString());
        } else {
          return [...prev, date];
        }
      });
    }
  };

  const formatSelectedDates = () => {
    if (selectedDates.length === 0) return "Select preferred dates";
    if (selectedDates.length === 1) return format(selectedDates[0], "PPP");
    return `${selectedDates.length} dates selected`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Visit & Promote Content Details</h3>
        <p className="text-sm text-gray-600">Complete the details below for your visit and promotion requirements</p>
      </div>

      <div className="space-y-4">
        {/* Basic Info Section */}
        <Collapsible open={expandedSections.basicInfo} onOpenChange={() => toggleSection('basicInfo')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">1. Basic Info</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", expandedSections.basicInfo && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferred-dates" className="text-sm mb-2 block">Preferred Visit Dates</Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        selectedDates.length === 0 && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {formatSelectedDates()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={(dates) => setSelectedDates(dates || [])}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time-slot" className="text-sm mb-2 block">Preferred Time Slot</Label>
                <select 
                  id="time-slot"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={formData.timeSlot}
                  onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Visit Location Section */}
        <Collapsible open={expandedSections.location} onOpenChange={() => toggleSection('location')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">2. Visit Location</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", expandedSections.location && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4 px-4">
            <div>
              <Label htmlFor="venue-name" className="text-sm mb-2 block">Venue Name</Label>
              <Input
                id="venue-name"
                placeholder="e.g., Trendy Fashion Boutique"
                value={formData.venueName}
                onChange={(e) => handleInputChange('venueName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="full-address" className="text-sm mb-2 block">Full Address</Label>
              <Textarea
                id="full-address"
                placeholder="Complete address with pincode"
                className="min-h-[80px]"
                value={formData.fullAddress}
                onChange={(e) => handleInputChange('fullAddress', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="google-maps-link" className="text-sm mb-2 block">Google Maps Link</Label>
              <Input
                id="google-maps-link"
                type="url"
                placeholder="https://maps.google.com/..."
                value={formData.googleMapsLink}
                onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="landmark-info" className="text-sm mb-2 block">Landmark & Nearby Transit Info (Optional)</Label>
              <Input
                id="landmark-info"
                placeholder="e.g., Near Central Mall, Metro Station 5 min walk"
                value={formData.landmarkInfo}
                onChange={(e) => handleInputChange('landmarkInfo', e.target.value)}
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">💡 Tip: Ensure address is accurate and include COVID safety protocols or ID verification requirements if applicable</p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Offers & Facilities Section */}
        <Collapsible open={expandedSections.offers} onOpenChange={() => toggleSection('offers')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-primary" />
              <span className="font-medium">3. Offers & Facilities for Influencer</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", expandedSections.offers && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-6 px-4">
            {/* Travel Reimbursement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Travel Reimbursement</Label>
                <Switch
                  checked={formData.travelReimbursement}
                  onCheckedChange={(checked) => handleInputChange('travelReimbursement', checked)}
                />
              </div>
              {formData.travelReimbursement && (
                <Input
                  placeholder="Amount or notes (e.g., ₹500 or Cab fare both ways)"
                  value={formData.travelAmount}
                  onChange={(e) => handleInputChange('travelAmount', e.target.value)}
                />
              )}
            </div>

            {/* Food/Refreshments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Food/Refreshments Provided</Label>
                <Switch
                  checked={formData.foodProvided}
                  onCheckedChange={(checked) => handleInputChange('foodProvided', checked)}
                />
              </div>
              {formData.foodProvided && (
                <Input
                  placeholder="Details (e.g., Lunch, Snacks, Beverages)"
                  value={formData.foodDetails}
                  onChange={(e) => handleInputChange('foodDetails', e.target.value)}
                />
              )}
            </div>

            {/* Stay Provided */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Stay Provided (if outstation)</Label>
                <Switch
                  checked={formData.stayProvided}
                  onCheckedChange={(checked) => handleInputChange('stayProvided', checked)}
                />
              </div>
              {formData.stayProvided && (
                <Textarea
                  placeholder="Hotel name, address, and duration"
                  className="min-h-[60px]"
                  value={formData.stayDetails}
                  onChange={(e) => handleInputChange('stayDetails', e.target.value)}
                />
              )}
            </div>

            {/* Gifts/Vouchers */}
            <div>
              <Label htmlFor="gifts-vouchers" className="text-sm mb-2 block">Any Gifts, Coupons or Vouchers? (Optional)</Label>
              <Input
                id="gifts-vouchers"
                placeholder="e.g., Free products worth ₹2000, Discount coupons"
                value={formData.giftsVouchers}
                onChange={(e) => handleInputChange('giftsVouchers', e.target.value)}
              />
            </div>

            {/* Other Perks */}
            <div>
              <Label htmlFor="other-perks" className="text-sm mb-2 block">Other Perks</Label>
              <Input
                id="other-perks"
                placeholder="e.g., Free Products, Partner Collaborations"
                value={formData.otherPerks}
                onChange={(e) => handleInputChange('otherPerks', e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Content Expectations */}
        <Collapsible open={expandedSections.content} onOpenChange={() => toggleSection('content')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium">4. Content Expectations</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", expandedSections.content && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4 px-4">
            <div>
              <Label htmlFor="content-description" className="text-sm mb-2 block">Brief Description</Label>
              <Textarea
                id="content-description"
                placeholder="e.g., Shoot product demo inside the store, post 2 stories tagging us"
                className="min-h-[100px]"
                value={formData.contentDescription}
                onChange={(e) => handleInputChange('contentDescription', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hashtags" className="text-sm mb-2 block">Hashtags to Use</Label>
              <Input
                id="hashtags"
                placeholder="e.g., #BrandName #Fashion #NewCollection"
                value={formData.hashtags}
                onChange={(e) => handleInputChange('hashtags', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="handles-to-tag" className="text-sm mb-2 block">Handles to Tag</Label>
              <Input
                id="handles-to-tag"
                placeholder="e.g., @brandname @storename"
                value={formData.handlesToTag}
                onChange={(e) => handleInputChange('handlesToTag', e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Notes & Instructions */}
        <Collapsible open={expandedSections.notes} onOpenChange={() => toggleSection('notes')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">5. Notes & Instructions</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", expandedSections.notes && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4 px-4">
            <div>
              <Label htmlFor="special-guidelines" className="text-sm mb-2 block">Special Guidelines, Dress Code, Dos & Don'ts</Label>
              <Textarea
                id="special-guidelines"
                placeholder="Any specific instructions, dress code, or guidelines for the visit"
                className="min-h-[100px]"
                value={formData.specialGuidelines}
                onChange={(e) => handleInputChange('specialGuidelines', e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default VisitPromoteTab;
