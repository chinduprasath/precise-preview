
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardUserFormProps {
  onSuccess: () => void;
}

const OnboardUserForm: React.FC<OnboardUserFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'influencer' as 'influencer' | 'business' | 'admin',
    company: '',
    category: '',
    socialFollowers: {
      instagram: 0,
      youtube: 0,
      tiktok: 0,
      twitter: 0,
      facebook: 0
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialFollowerChange = (platform: keyof typeof formData.socialFollowers, value: string) => {
    const followerCount = parseInt(value) || 0;
    setFormData((prev) => ({
      ...prev,
      socialFollowers: {
        ...prev.socialFollowers,
        [platform]: followerCount
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Insert into onboarding_users table
      const { error } = await supabase
        .from('onboarding_users')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          user_type: formData.userType,
          company: formData.userType === 'business' ? formData.company : null,
          category: formData.userType === 'influencer' ? formData.category : null,
          social_followers: formData.userType === 'influencer' ? formData.socialFollowers : null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "User has been added to onboarding queue.",
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        userType: 'influencer',
        company: '',
        category: '',
        socialFollowers: {
          instagram: 0,
          youtube: 0,
          tiktok: 0,
          twitter: 0,
          facebook: 0
        }
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add user to onboarding queue.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>
          Add a new user to the onboarding queue for approval
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">User Type</Label>
            <Select
              value={formData.userType}
              onValueChange={(value) => handleSelectChange('userType', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="userType">
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="influencer">Influencer</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.userType === 'business' && (
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          )}

          {formData.userType === 'influencer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="category">Primary Content Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion & Style</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="fitness">Fitness & Health</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="food">Food & Cooking</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Social Media Followers</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      type="number"
                      min="0"
                      value={formData.socialFollowers.instagram || ''}
                      onChange={(e) => handleSocialFollowerChange('instagram', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      type="number"
                      min="0"
                      value={formData.socialFollowers.youtube || ''}
                      onChange={(e) => handleSocialFollowerChange('youtube', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                      id="tiktok"
                      type="number"
                      min="0"
                      value={formData.socialFollowers.tiktok || ''}
                      onChange={(e) => handleSocialFollowerChange('tiktok', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      type="number"
                      min="0"
                      value={formData.socialFollowers.twitter || ''}
                      onChange={(e) => handleSocialFollowerChange('twitter', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      type="number"
                      min="0"
                      value={formData.socialFollowers.facebook || ''}
                      onChange={(e) => handleSocialFollowerChange('facebook', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding User..." : "Add User"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OnboardUserForm;
