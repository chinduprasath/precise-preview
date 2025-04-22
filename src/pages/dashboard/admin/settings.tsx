
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Palette, Upload, Globe, Shield, Phone, 
  Mail, ToggleRight, DollarSign, FileText, 
  Settings, RotateCcw, Facebook, Twitter, 
  Linkedin, Instagram, Image
} from "lucide-react";

// Sample data for subscription plans
const samplePlans = [
  {
    id: "1",
    name: "Basic Plan",
    targetAudience: "Business",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: ["Basic analytics", "10 requests/month", "Email support"],
    trialDays: 14,
    status: "active",
    taxPercentage: 18,
    paymentGatewayId: "price_basic123",
    autoRenewal: true
  },
  {
    id: "2",
    name: "Pro Plan",
    targetAudience: "Business",
    monthlyPrice: 2999,
    yearlyPrice: 29990, 
    features: ["Advanced analytics", "Unlimited requests", "Priority support", "Custom reports"],
    trialDays: 7,
    status: "active",
    taxPercentage: 18,
    paymentGatewayId: "price_pro123",
    autoRenewal: true
  },
  {
    id: "3",
    name: "Influencer Plus",
    targetAudience: "Influencer",
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    features: ["Campaign insights", "Business connections", "Verification badge"],
    trialDays: 14,
    status: "active",
    taxPercentage: 18,
    paymentGatewayId: "price_infplus123",
    autoRenewal: true
  }
];

// Form schema for branding settings
const brandingFormSchema = z.object({
  siteTitle: z.string().min(2, {
    message: "Site title must be at least 2 characters.",
  }),
  metaDescription: z.string().max(160, {
    message: "Meta description should not exceed 160 characters.",
  }),
  keywords: z.string().optional(),
});

// Form schema for contact settings
const contactFormSchema = z.object({
  supportEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  supportPhone: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
});

// Form schema for security settings
const securityFormSchema = z.object({
  enableTwoFactor: z.boolean().default(false),
  enableRecaptcha: z.boolean().default(true),
  sessionTimeout: z.number().min(10).max(120).default(30),
});

// Form schema for global settings
const globalFormSchema = z.object({
  defaultLanguage: z.string().default("en"),
  defaultTimezone: z.string().default("UTC"),
});

const SiteSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("branding");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "Our site is currently undergoing scheduled maintenance. We'll be back shortly!"
  );
  const [whitelistedIPs, setWhitelistedIPs] = useState("");
  const [subscriptionPlans, setSubscriptionPlans] = useState(samplePlans);
  
  // Branding form
  const brandingForm = useForm<z.infer<typeof brandingFormSchema>>({
    resolver: zodResolver(brandingFormSchema),
    defaultValues: {
      siteTitle: "Influencer Network",
      metaDescription: "Connect with influencers and businesses for impactful marketing campaigns",
      keywords: "influencer, marketing, social media, campaigns",
    },
  });

  // Contact form
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      supportEmail: "support@influencernetwork.com",
      supportPhone: "+1 (555) 123-4567",
      instagram: "influencernetwork",
      twitter: "influencernetwork",
      facebook: "influencernetwork",
      linkedin: "influencer-network",
    },
  });

  // Security form
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      enableTwoFactor: false,
      enableRecaptcha: true,
      sessionTimeout: 30,
    },
  });

  // Global form
  const globalForm = useForm<z.infer<typeof globalFormSchema>>({
    resolver: zodResolver(globalFormSchema),
    defaultValues: {
      defaultLanguage: "en",
      defaultTimezone: "UTC",
    },
  });

  // Form submission handlers
  const onBrandingSubmit = (data: z.infer<typeof brandingFormSchema>) => {
    console.log("Branding form data:", data);
    toast.success("Branding settings updated successfully!");
  };

  const onContactSubmit = (data: z.infer<typeof contactFormSchema>) => {
    console.log("Contact form data:", data);
    toast.success("Contact settings updated successfully!");
  };

  const onSecuritySubmit = (data: z.infer<typeof securityFormSchema>) => {
    console.log("Security form data:", data);
    toast.success("Security settings updated successfully!");
  };

  const onGlobalSubmit = (data: z.infer<typeof globalFormSchema>) => {
    console.log("Global form data:", data);
    toast.success("Global settings updated successfully!");
  };

  const handleMaintenanceModeToggle = () => {
    setMaintenanceMode(!maintenanceMode);
    toast.success(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
  };

  const handleResetToDefaults = () => {
    // Reset settings to default values
    brandingForm.reset({
      siteTitle: "Influencer Network",
      metaDescription: "Connect with influencers and businesses for impactful marketing campaigns",
      keywords: "influencer, marketing, social media, campaigns",
    });
    
    contactForm.reset({
      supportEmail: "support@influencernetwork.com",
      supportPhone: "+1 (555) 123-4567",
      instagram: "influencernetwork",
      twitter: "influencernetwork",
      facebook: "influencernetwork",
      linkedin: "influencer-network",
    });
    
    securityForm.reset({
      enableTwoFactor: false,
      enableRecaptcha: true,
      sessionTimeout: 30,
    });
    
    globalForm.reset({
      defaultLanguage: "en",
      defaultTimezone: "UTC",
    });
    
    setMaintenanceMode(false);
    setMaintenanceMessage("Our site is currently undergoing scheduled maintenance. We'll be back shortly!");
    setWhitelistedIPs("");
    
    toast.success("All settings have been reset to defaults");
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Site Settings</h1>
            <p className="text-muted-foreground">Manage global application settings</p>
          </div>
          <Button variant="outline" onClick={handleResetToDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="branding">
              <FileText className="mr-2 h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette className="mr-2 h-4 w-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <ToggleRight className="mr-2 h-4 w-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <DollarSign className="mr-2 h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="other">
              <Settings className="mr-2 h-4 w-4" />
              Other Settings
            </TabsTrigger>
          </TabsList>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>
                  Update your site's branding elements like logo, favicon, and metadata.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Logo & Images</h3>
                      <Separator />

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="main-logo">Main Site Logo</Label>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="h-20 w-40 rounded-md border border-input bg-gray-50 flex items-center justify-center">
                              <Image className="h-8 w-8 text-gray-400" />
                            </div>
                            <Button variant="outline" className="flex items-center">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Logo
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="favicon">Favicon</Label>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-md border border-input bg-gray-50 flex items-center justify-center">
                              <Image className="h-6 w-6 text-gray-400" />
                            </div>
                            <Button variant="outline" className="flex items-center">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Favicon
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="login-background">Login Page Background</Label>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="h-32 w-48 rounded-md border border-input bg-gray-50 flex items-center justify-center">
                              <Image className="h-8 w-8 text-gray-400" />
                            </div>
                            <Button variant="outline" className="flex items-center">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Background
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Site Metadata</h3>
                    <Separator className="mb-4" />

                    <Form {...brandingForm}>
                      <form onSubmit={brandingForm.handleSubmit(onBrandingSubmit)} className="space-y-4">
                        <FormField
                          control={brandingForm.control}
                          name="siteTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Site Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Site Title" {...field} />
                              </FormControl>
                              <FormDescription>
                                This will appear in browser tabs and search results.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={brandingForm.control}
                          name="metaDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Brief description of your site"
                                  {...field}
                                  rows={3}
                                />
                              </FormControl>
                              <FormDescription>
                                This will be used for SEO in search engine results. Max 160 characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={brandingForm.control}
                          name="keywords"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Keywords</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="keyword1, keyword2, keyword3"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Comma-separated keywords for search engines.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit">Save Branding Settings</Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Customization</CardTitle>
                <CardDescription>
                  Customize the look and feel of your site with colors and fonts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Color Scheme</h3>
                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary-color">Primary Color</Label>
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-md border bg-primary" />
                            <Input
                              id="primary-color"
                              type="text"
                              value="#8B5CF6"
                              className="w-24"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondary-color">Secondary Color</Label>
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-md border bg-secondary" />
                            <Input
                              id="secondary-color"
                              type="text"
                              value="#E5DEFF"
                              className="w-24"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="text-color">Text Color</Label>
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-md border bg-foreground" />
                            <Input
                              id="text-color"
                              type="text"
                              value="#1A1F2C"
                              className="w-24"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="background-color">Background Color</Label>
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-md border bg-background" />
                            <Input
                              id="background-color"
                              type="text"
                              value="#FFFFFF"
                              className="w-24"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Label htmlFor="font-style">Font Style</Label>
                        <select
                          id="font-style"
                          className="mt-2 w-full rounded-md border border-input p-2"
                          defaultValue="inter"
                        >
                          <option value="inter">Inter</option>
                          <option value="roboto">Roboto</option>
                          <option value="poppins">Poppins</option>
                          <option value="lato">Lato</option>
                        </select>
                      </div>

                      <div className="pt-4">
                        <Label>Theme Mode</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <Button variant="outline" className="justify-start">
                            Light Mode
                          </Button>
                          <Button variant="outline" className="justify-start">
                            Dark Mode
                          </Button>
                          <Button variant="default" className="justify-start">
                            Auto (System)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme Preview</h3>
                    <Separator className="mb-4" />
                    
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="bg-background p-6 space-y-4">
                        <h3 className="text-xl font-bold text-foreground">Theme Preview</h3>
                        <p className="text-muted-foreground">
                          This is how your theme will look to users.
                        </p>
                        
                        <div className="flex space-x-2">
                          <Button variant="default">Primary Button</Button>
                          <Button variant="secondary">Secondary Button</Button>
                          <Button variant="outline">Outline Button</Button>
                        </div>
                        
                        <div className="bg-card p-4 rounded-md border border-border mt-4">
                          <h4 className="font-medium text-card-foreground">Card Component</h4>
                          <p className="text-muted-foreground text-sm mt-2">
                            This is an example card to preview your theme.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="mt-6">Save Theme Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
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
                      className="w-full"
                    />
                    <FormDescription>
                      Enter IP addresses that can access the site during maintenance mode. Separate with commas.
                    </FormDescription>
                  </div>
                  
                  <Button>Save Maintenance Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Manage subscription plans available to users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Available Plans</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and manage subscription plans.
                    </p>
                  </div>
                  <Button>Add New Plan</Button>
                </div>
                
                <div className="space-y-6">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold">{plan.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            For {plan.targetAudience}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium">Pricing</p>
                          <div className="flex space-x-4 mt-1">
                            <p>₹{plan.monthlyPrice}/month</p>
                            <p>₹{plan.yearlyPrice}/year</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Free Trial</p>
                          <p className="mt-1">{plan.trialDays} days</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Status</p>
                          <div className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              plan.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {plan.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Tax</p>
                          <p className="mt-1">{plan.taxPercentage}%</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium">Features</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm">{feature}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Payment Gateway ID</p>
                          <p className="text-sm mt-1 font-mono">{plan.paymentGatewayId}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Auto-Renewal</p>
                          <p className="mt-1">{plan.autoRenewal ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Settings Tab */}
          <TabsContent value="other" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Global Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Global Settings</CardTitle>
                  <CardDescription>
                    Configure global site settings like language and timezone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...globalForm}>
                    <form onSubmit={globalForm.handleSubmit(onGlobalSubmit)} className="space-y-4">
                      <FormField
                        control={globalForm.control}
                        name="defaultLanguage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Language</FormLabel>
                            <select
                              className="w-full rounded-md border border-input p-2"
                              {...field}
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="hi">Hindi</option>
                            </select>
                            <FormDescription>
                              The default language for the application.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={globalForm.control}
                        name="defaultTimezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Timezone</FormLabel>
                            <select
                              className="w-full rounded-md border border-input p-2"
                              {...field}
                            >
                              <option value="UTC">UTC</option>
                              <option value="America/New_York">Eastern Time (ET)</option>
                              <option value="America/Chicago">Central Time (CT)</option>
                              <option value="America/Denver">Mountain Time (MT)</option>
                              <option value="America/Los_Angeles">Pacific Time (PT)</option>
                              <option value="Asia/Kolkata">India Standard Time (IST)</option>
                            </select>
                            <FormDescription>
                              The default timezone for the application.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Save Global Settings</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure security options for the application.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                      <FormField
                        control={securityForm.control}
                        name="enableTwoFactor"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Two-Factor Authentication
                              </FormLabel>
                              <FormDescription>
                                Require 2FA for all admin users.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={securityForm.control}
                        name="enableRecaptcha"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                reCAPTCHA Protection
                              </FormLabel>
                              <FormDescription>
                                Enable reCAPTCHA on login forms.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout (minutes)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                              />
                            </FormControl>
                            <FormDescription>
                              Time in minutes before an inactive session expires.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Save Security Settings</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Contact Settings */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Contact & Social Media</CardTitle>
                  <CardDescription>
                    Configure contact information and social media links.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...contactForm}>
                    <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={contactForm.control}
                          name="supportEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Support Email</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="support@example.com" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={contactForm.control}
                          name="supportPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Support Phone</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="+1 123 456 7890" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="my-4" />
                      <h3 className="text-lg font-medium mb-4">Social Media Links</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={contactForm.control}
                          name="instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instagram</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Instagram className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="username" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={contactForm.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twitter / X</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Twitter className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="username" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={contactForm.control}
                          name="facebook"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Facebook</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Facebook className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="username" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={contactForm.control}
                          name="linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Linkedin className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="company-name" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="mt-4">Save Contact Settings</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SiteSettingsPage;
