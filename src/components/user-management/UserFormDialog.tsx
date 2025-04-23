
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserTag } from './UserTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  userType: 'business' | 'influencer';
  availableTags: UserTag[];
  categories?: Array<{ id: string; name: string }>;
  platforms?: Array<{ id: string; name: string }>;
  editing?: boolean;
  initialData?: any;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  userType,
  availableTags,
  categories = [],
  platforms = [],
  editing = false,
  initialData = {}
}) => {
  // Base schema for both user types
  const baseSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    phoneNumber: z.string().optional(),
    password: editing ? z.string().optional() : z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: editing ? z.string().optional() : z.string().min(8, "Password must be at least 8 characters"),
    accountStatus: z.string(),
    tags: z.array(z.string()),
    notes: z.string().optional(),
  }).refine(data => {
    if (!editing && data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // Business specific schema
  const businessSchema = z.object({
    ...baseSchema.shape,
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
  });

  // Influencer specific schema
  const influencerSchema = z.object({
    ...baseSchema.shape,
    categories: z.array(z.string()),
    platforms: z.array(z.string()),
    socialLinks: z.record(z.string(), z.string().url("Please enter a valid URL").optional()).optional(),
    followerCount: z.number().positive("Follower count must be a positive number").optional(),
  });

  // Choose schema based on userType
  const formSchema = userType === 'business' ? businessSchema : influencerSchema;
  
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData.fullName || '',
      username: initialData.username || '',
      email: initialData.email || '',
      phoneNumber: initialData.phoneNumber || '',
      password: '',
      confirmPassword: '',
      accountStatus: initialData.accountStatus || 'active',
      tags: initialData.tags || [],
      notes: initialData.notes || '',
      ...(userType === 'business' ? {
        companyName: initialData.companyName || '',
      } : {
        categories: initialData.categories || [],
        platforms: initialData.platforms || [],
        socialLinks: initialData.socialLinks || {
          instagram: '',
          youtube: '',
          tiktok: '',
          twitter: '',
        },
        followerCount: initialData.followerCount || 0,
      })
    }
  });

  const handleSubmitForm = (data: any) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Edit' : 'Add'} {userType === 'business' ? 'Business User' : 'Influencer'}
          </DialogTitle>
          <DialogDescription>
            {editing 
              ? 'Update the details for this user.' 
              : `Fill in the details to create a new ${userType === 'business' ? 'business user' : 'influencer'}.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {userType === 'business' && (
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {userType === 'influencer' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories/Niches</FormLabel>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`category-${category.id}`} 
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  const updatedValues = checked 
                                    ? [...currentValues, category.id]
                                    : currentValues.filter(id => id !== category.id);
                                  field.onChange(updatedValues);
                                }}
                              />
                              <label 
                                htmlFor={`category-${category.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="platforms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platforms</FormLabel>
                        <div className="space-y-2">
                          {platforms.map(platform => (
                            <div key={platform.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`platform-${platform.id}`} 
                                checked={field.value?.includes(platform.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  const updatedValues = checked 
                                    ? [...currentValues, platform.id]
                                    : currentValues.filter(id => id !== platform.id);
                                  field.onChange(updatedValues);
                                }}
                              />
                              <label 
                                htmlFor={`platform-${platform.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {platform.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="followerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follower Count</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10000" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Social Media Links</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {['instagram', 'youtube', 'tiktok', 'twitter'].map(platform => (
                      <FormField
                        key={platform}
                        control={form.control}
                        name={`socialLinks.${platform}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">{platform}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={`https://${platform}.com/username`} 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {!editing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="accountStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="space-y-2">
                    {availableTags.map(tag => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tag-${tag.id}`} 
                          checked={field.value?.includes(tag.id)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || [];
                            const updatedValues = checked 
                              ? [...currentValues, tag.id]
                              : currentValues.filter(id => id !== tag.id);
                            field.onChange(updatedValues);
                          }}
                        />
                        <label 
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Internal)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any internal notes about this user..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    These notes are for internal use only and will not be visible to the user.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editing ? 'Update' : 'Create'} {userType === 'business' ? 'Business User' : 'Influencer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
