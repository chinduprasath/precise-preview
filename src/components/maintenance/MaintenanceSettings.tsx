import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, Clock } from "lucide-react";

export default function MaintenanceSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "Our site is currently undergoing scheduled maintenance. We'll be back shortly!"
  );
  const [whitelistedIPs, setWhitelistedIPs] = useState("");
  const [lastModifiedBy, setLastModifiedBy] = useState("");
  const [lastModifiedAt, setLastModifiedAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMaintenanceSettings();
  }, []);

  const fetchMaintenanceSettings = async () => {
    const { data, error } = await supabase
      .from('maintenance_settings')
      .select('*')
      .single();

    if (error) {
      toast.error('Failed to fetch maintenance settings');
      return;
    }

    if (data) {
      setMaintenanceMode(data.is_enabled);
      setMaintenanceMessage(data.message);
      setWhitelistedIPs(data.whitelisted_ips?.join('\n') || '');
      
      // Fetch the user who last modified the settings
      if (data.last_modified_by) {
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', data.last_modified_by)
          .single();
          
        if (!userError && userData) {
          setLastModifiedBy(`${userData.first_name} ${userData.last_name}`);
        } else {
          setLastModifiedBy('Unknown');
        }
      } else {
        setLastModifiedBy('Unknown');
      }
      
      setLastModifiedAt(data.last_modified_at ? new Date(data.last_modified_at).toLocaleString() : '');
    }
  };

  const validateIPAddresses = (ipString: string): boolean => {
    if (!ipString.trim()) return true;
    
    const ips = ipString.split('\n').map(ip => ip.trim()).filter(Boolean);
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    return ips.every(ip => ipRegex.test(ip));
  };

  const handleMaintenanceModeToggle = async () => {
    setMaintenanceMode(!maintenanceMode);
  };

  const handleSaveSettings = async () => {
    if (!validateIPAddresses(whitelistedIPs)) {
      toast.error('Please enter valid IP addresses');
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('maintenance_settings')
        .update({
          is_enabled: maintenanceMode,
          message: maintenanceMessage,
          whitelisted_ips: whitelistedIPs.split('\n').map(ip => ip.trim()).filter(Boolean),
          last_modified_by: (await supabase.auth.getUser()).data.user?.id,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('maintenance_settings').select('id').single()).data?.id);

      if (error) throw error;

      toast.success(`Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'} successfully`);
      fetchMaintenanceSettings();
    } catch (error) {
      console.error('Error saving maintenance settings:', error);
      toast.error('Failed to save maintenance settings');
    } finally {
      setIsSaving(false);
    }
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
            <p className="text-sm text-muted-foreground">
              This message will be displayed to users during maintenance mode.
            </p>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="whitelisted-ips">Whitelisted IP Addresses</Label>
            <Textarea
              id="whitelisted-ips"
              value={whitelistedIPs}
              onChange={(e) => setWhitelistedIPs(e.target.value)}
              rows={3}
              placeholder="Enter IP addresses (one per line)"
              className={`w-full ${!validateIPAddresses(whitelistedIPs) ? 'border-red-500' : ''}`}
            />
            {!validateIPAddresses(whitelistedIPs) && (
              <p className="text-sm text-red-500">
                Please enter valid IP addresses (one per line)
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Enter IP addresses that can access the site during maintenance mode (one per line).
            </p>
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
}
