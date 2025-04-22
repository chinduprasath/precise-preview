
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  RefreshCcw, 
  SendHorizonal, 
  Pencil, 
  Trash2, 
  Shield, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the TeamMember type with specific status values
type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  dateAdded: string;
};

// Define the Role type
type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
  status: z.enum(["active", "inactive"]).default("active")
});

type FormValues = z.infer<typeof formSchema>;

const TeamManagementPage = () => {
  const navigate = useNavigate();
  
  // State for team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      role: "Super Admin",
      status: "active",
      dateAdded: "2025-01-15"
    },
    {
      id: "2",
      name: "Neha Singh",
      email: "neha.singh@example.com",
      role: "Operations",
      status: "active",
      dateAdded: "2025-02-03"
    },
    {
      id: "3",
      name: "Raj Malhotra",
      email: "raj.malhotra@example.com",
      role: "Support",
      status: "active",
      dateAdded: "2025-02-10"
    },
    {
      id: "4",
      name: "Priya Verma",
      email: "priya.verma@example.com",
      role: "Content Moderator",
      status: "inactive",
      dateAdded: "2025-02-18"
    },
    {
      id: "5",
      name: "Vikram Joshi",
      email: "vikram.joshi@example.com",
      role: "Finance",
      status: "active",
      dateAdded: "2025-03-05"
    }
  ]);

  // State for roles
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Super Admin",
      description: "Full access to all sections of the platform",
      permissions: ["all"]
    },
    {
      id: "2",
      name: "Operations",
      description: "Can manage influencer and business dashboards",
      permissions: ["manage_influencers", "manage_businesses", "view_analytics"]
    },
    {
      id: "3",
      name: "Support",
      description: "Can view and respond to support tickets",
      permissions: ["manage_support", "view_users"]
    },
    {
      id: "4",
      name: "Finance",
      description: "Can manage payments and withdrawal approvals",
      permissions: ["manage_payments", "view_reports"]
    },
    {
      id: "5",
      name: "Content Moderator",
      description: "Can manage user-generated content and posts",
      permissions: ["moderate_content", "view_content"]
    }
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Add member dialog state
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  
  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      status: "active"
    }
  });
  
  // Apply filters
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle remove member
  const handleRemoveMember = (id: string) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  // Handle toggle status
  const handleToggleStatus = (id: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id 
        ? { ...member, status: member.status === "active" ? "inactive" : "active" } 
        : member
    ));
  };

  // Handle add member
  const onSubmit = (data: FormValues) => {
    const newMember: TeamMember = {
      id: (teamMembers.length + 1).toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setTeamMembers([...teamMembers, newMember]);
    setAddMemberOpen(false);
    form.reset();
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("Refreshing team members data...");
    // In a real application, this would fetch fresh data from an API
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Team Management</h1>
                <p className="text-sm text-gray-500">
                  Manage team members, roles, and permissions
                </p>
              </div>
              
              <Button onClick={() => setAddMemberOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>

            <Tabs defaultValue="members" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="members">
                  <User className="w-4 h-4 mr-2" />
                  Team Members
                </TabsTrigger>
                <TabsTrigger value="roles">
                  <Shield className="w-4 h-4 mr-2" />
                  Roles & Permissions
                </TabsTrigger>
              </TabsList>

              {/* Team Members Tab */}
              <TabsContent value="members" className="space-y-6">
                {/* Search and filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="icon" onClick={handleRefresh}>
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Team members table */}
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Added</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No team members found matching your filters.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">{member.name}</TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    member.role === "Super Admin" 
                                      ? "bg-purple-50 text-purple-700 border-purple-200" 
                                      : member.role === "Finance" 
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                  }
                                >
                                  {member.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    member.status === "active" 
                                      ? "bg-green-50 text-green-700 border-green-200" 
                                      : "bg-red-50 text-red-700 border-red-200"
                                  }
                                >
                                  {member.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>{member.dateAdded}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
                                      {member.status === "active" ? (
                                        <>
                                          <X className="mr-2 h-4 w-4" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <Check className="mr-2 h-4 w-4" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRemoveMember(member.id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <SendHorizonal className="mr-2 h-4 w-4" />
                                      Send Password Reset
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between py-4">
                    <div className="text-sm text-gray-500">
                      Showing {filteredMembers.length} of {teamMembers.length} team members
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Roles & Permissions Tab */}
              <TabsContent value="roles" className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Available Roles</h2>
                  <Button>
                    <Shield className="mr-2 h-4 w-4" />
                    Create New Role
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <Card key={role.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {role.name === "Super Admin" ? (
                              <ShieldAlert className="mr-2 h-5 w-5 text-purple-600" />
                            ) : (
                              <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />
                            )}
                            <CardTitle>{role.name}</CardTitle>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>{role.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Permissions:</div>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission, index) => (
                              <Badge key={index} variant="secondary">
                                {permission === "all" ? "Full Access" : 
                                  permission.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex justify-between w-full">
                          <Button variant="outline" size="sm" className="text-xs">
                            <User className="mr-1 h-3 w-3" />
                            View Members ({
                              teamMembers.filter(m => m.role === role.name).length
                            })
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Pencil className="mr-1 h-3 w-3" />
                            Edit Role
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Add Member Dialog - Properly implemented with react-hook-form */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to manage the platform.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Available Roles</SelectLabel>
                          {roles.map(role => (
                            <SelectItem key={role.id} value={role.name}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status</FormLabel>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="active" 
                          value="active" 
                          checked={field.value === "active"}
                          onChange={() => field.onChange("active")}
                          className="rounded-full"
                        />
                        <label htmlFor="active">Active</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="inactive" 
                          value="inactive" 
                          checked={field.value === "inactive"}
                          onChange={() => field.onChange("inactive")}
                          className="rounded-full"
                        />
                        <label htmlFor="inactive">Inactive</label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => {
                  setAddMemberOpen(false);
                  form.reset();
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagementPage;
