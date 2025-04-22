
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormDescription } from "@/components/ui/form";
import { toast } from "sonner";
import { ToggleRight, User, Clock } from "lucide-react";

interface MaintenanceSettingsProps {
  initialMaintenanceMode: boolean;
  initialMaintenanceMessage: string;
  initialWhitelistedIPs: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

const MaintenanceSettings: React.FC<MaintenanceSettingsProps> = ({
  initialMaintenanceMode = false,
  initialMaintenanceMessage = "Our site is currently undergoing scheduled maintenance. We'll be back shortly!",
  initialWhitelistedIPs = "",
  lastModifiedBy = "Admin User",
  lastModifiedAt = new Date().toLocaleString(),
}) => {
  const [maintenanceMode, setMaintenanceMode] = useState(initialMaintenanceMode);
  const [maintenanceMessage, setMaintenanceMessage] = useState(initialMaintenanceMessage);
  const [whitelistedIPs, setWhitelistedIPs] = useState(initialWhitelistedIPs);
  const [isSaving, setIsSaving] = useState(false);

  const handleMaintenanceModeToggle = () => {
    setMaintenanceMode(!maintenanceMode);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`Maintenance mode settings ${maintenanceMode ? 'enabled' : 'disabled'} successfully`);
      // In a real implementation, you would save to database here
    }, 800);
  };

  const validateIPAddresses = (ipString: string): boolean => {
    if (!ipString.trim()) return true;
    
    const ips = ipString.split(',').map(ip => ip.trim());
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    return ips.every(ip => ipRegex.test(ip));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Mode</CardTitle>
        <CardDescription>
          Put your site in maintenance mode while you make updates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground">
                When enabled, all users will see a maintenance page instead of the site.
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceModeToggle}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label htmlFor="maintenance-message">Maintenance Message</Label>
            <Textarea
              id="maintenance-message"
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              rows={5}
              className="w-full"
              placeholder="Enter the message to display during maintenance"
            />
            <FormDescription>
              This message will be displayed to users during maintenance mode.
            </FormDescription>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="whitelisted-ips">Whitelisted IP Addresses</Label>
            <Textarea
              id="whitelisted-ips"
              value={whitelistedIPs}
              onChange={(e) => setWhitelistedIPs(e.target.value)}
              rows={3}
              placeholder="192.168.1.1, 10.0.0.1"
              className={`w-full ${!validateIPAddresses(whitelistedIPs) ? 'border-red-500' : ''}`}
            />
            {!validateIPAddresses(whitelistedIPs) && (
              <p className="text-sm text-red-500">
                Please enter valid IP addresses separated by commas.
              </p>
            )}
            <FormDescription>
              Enter IP addresses that can access the site during maintenance mode. Separate with commas.
            </FormDescription>
          </div>
          
          {(lastModifiedBy || lastModifiedAt) && (
            <div className="flex flex-col space-y-2 pt-2 text-sm text-muted-foreground">
              {lastModifiedBy && (
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Last modified by: {lastModifiedBy}</span>
                </div>
              )}
              {lastModifiedAt && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Last modified at: {lastModifiedAt}</span>
                </div>
              )}
            </div>
          )}
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving || !validateIPAddresses(whitelistedIPs)}
          >
            {isSaving ? 'Saving...' : 'Save Maintenance Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceSettings;
