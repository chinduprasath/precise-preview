
import React, { useState, useRef } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AdminProfile } from '@/pages/dashboard/admin/profile';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface AdminProfileOverviewProps {
  profile: AdminProfile;
  onUpdate: (data: Partial<AdminProfile>) => void;
}

const AdminProfileOverview = ({ profile, onUpdate }: AdminProfileOverviewProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for demo purposes
      // In a real application, you would upload this to Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onUpdate({ avatar_url: base64 });
        setIsUploading(false);
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully",
          variant: "default",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary/10 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-background cursor-pointer"
                onClick={handleAvatarClick}
              >
                {isUploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <img 
                    src={profile.avatar_url || "https://via.placeholder.com/150"} 
                    alt={profile.full_name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
                <User size={16} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-muted-foreground">
                <Mail size={16} />
                <span>{profile.email}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-secondary/60 rounded-lg px-3 py-1 text-sm">
                  {profile.role}
                </div>
                {profile.designation && (
                  <div className="bg-secondary/60 rounded-lg px-3 py-1 text-sm">
                    {profile.designation}
                  </div>
                )}
                {profile.last_login && (
                  <div className="flex items-center gap-1 bg-secondary/60 rounded-lg px-3 py-1 text-sm">
                    <Calendar size={14} />
                    <span>Last login: {formatDistanceToNow(new Date(profile.last_login), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProfileOverview;
