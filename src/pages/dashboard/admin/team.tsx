
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  UserCheck,
  UserX 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Types for team members and roles
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  dateAdded: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const TeamManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [sendInviteEmail, setSendInviteEmail] = useState(true);

  // Mock data for demonstration
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      role: 'Super Admin',
      status: 'active',
      dateAdded: '2023-11-15'
    },
    {
      id: '2',
      name: 'Neha Singh',
      email: 'neha@example.com',
      role: 'Operations',
      status: 'active',
      dateAdded: '2023-12-03'
    },
    {
      id: '3',
      name: 'Raj Malhotra',
      email: 'raj@example.com',
      role: 'Support',
      status: 'active',
      dateAdded: '2024-01-12'
    },
    {
      id: '4',
      name: 'Priya Verma',
      email: 'priya@example.com',
      role: 'Moderator',
      status: 'inactive',
      dateAdded: '2024-02-05'
    },
    {
      id: '5',
      name: 'Vikram Joshi',
      email: 'vikram@example.com',
      role: 'Finance',
      status: 'active',
      dateAdded: '2024-03-18'
    }
  ]);

  const roles: Role[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full access to all sections',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Operations',
      description: 'Can manage influencer and business dashboards',
      permissions: ['view_dashboards', 'manage_influencers', 'manage_businesses']
    },
    {
      id: '3',
      name: 'Support',
      description: 'Can view and respond to support tickets',
      permissions: ['view_tickets', 'respond_tickets']
    },
    {
      id: '4',
      name: 'Finance',
      description: 'Can manage payments and withdrawal approvals',
      permissions: ['view_payments', 'approve_withdrawals', 'manage_transactions']
    },
    {
      id: '5',
      name: 'Moderator',
      description: 'Can manage user-generated content and posts',
      permissions: ['view_content', 'approve_content', 'delete_content']
    }
  ];

  const permissions: Permission[] = [
    { id: 'view_dashboards', name: 'View Dashboards', description: 'Can view all dashboards' },
    { id: 'manage_influencers', name: 'Manage Influencers', description: 'Can manage influencer accounts' },
    { id: 'manage_businesses', name: 'Manage Businesses', description: 'Can manage business accounts' },
    { id: 'view_tickets', name: 'View Support Tickets', description: 'Can view support tickets' },
    { id: 'respond_tickets', name: 'Respond to Tickets', description: 'Can respond to support tickets' },
    { id: 'view_payments', name: 'View Payments', description: 'Can view payment information' },
    { id: 'approve_withdrawals', name: 'Approve Withdrawals', description: 'Can approve withdrawal requests' },
    { id: 'manage_transactions', name: 'Manage Transactions', description: 'Can manage financial transactions' },
    { id: 'view_content', name: 'View Content', description: 'Can view user-generated content' },
    { id: 'approve_content', name: 'Approve Content', description: 'Can approve user-generated content' },
    { id: 'delete_content', name: 'Delete Content', description: 'Can delete inappropriate content' }
  ];

  // Form state for new team member
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active' as 'active' | 'inactive',
    selectedPermissions: [] as string[]
  });

  // Filter team members based on search query and filters
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle adding a new team member
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newTeamMember: TeamMember = {
      id: (teamMembers.length + 1).toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: newMember.status,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setTeamMembers([...teamMembers, newTeamMember]);
    
    // Reset form
    setNewMember({
      name: '',
      email: '',
      role: '',
      status: 'active',
      selectedPermissions: []
    });
    
    setIsAddMemberDialogOpen(false);
    
    if (sendInviteEmail) {
      toast({
        title: "Invitation Sent",
        description: `Invitation email has been sent to ${newMember.email}`,
      });
    }

    toast({
      title: "Team Member Added",
      description: `${newMember.name} has been added as ${newMember.role}`,
    });
  };

  // Handle updating a team member
  const handleUpdateMember = () => {
    if (!selectedMember) return;

    const updatedMembers = teamMembers.map(member => 
      member.id === selectedMember.id ? selectedMember : member
    );

    setTeamMembers(updatedMembers);
    setIsEditMemberDialogOpen(false);
    setSelectedMember(null);

    toast({
      title: "Team Member Updated",
      description: "The team member information has been updated.",
    });
  };

  // Handle member status toggle
  const toggleMemberStatus = (memberId: string) => {
    const updatedMembers = teamMembers.map(member => {
      if (member.id === memberId) {
        const newStatus = member.status === 'active' ? 'inactive' : 'active';
        return { ...member, status: newStatus };
      }
      return member;
    });

    setTeamMembers(updatedMembers);

    const member = teamMembers.find(m => m.id === memberId);
    const newStatus = member?.status === 'active' ? 'inactive' : 'active';
    
    toast({
      title: `Member ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `${member?.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };

  // Handle member removal
  const handleRemoveMember = (memberId: string) => {
    const memberToRemove = teamMembers.find(m => m.id === memberId);
    const updatedMembers = teamMembers.filter(member => member.id !== memberId);
    setTeamMembers(updatedMembers);

    toast({
      title: "Team Member Removed",
      description: `${memberToRemove?.name} has been removed from the team.`,
    });
  };

  // Open edit dialog and set selected member
  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditMemberDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Tabs defaultValue="members" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-1">Team Management</h1>
              <p className="text-sm text-muted-foreground">Manage team members, roles, and permissions</p>
            </div>
            <TabsList className="mt-4 md:mt-0">
              <TabsTrigger value="members">Team Members</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name or email..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex gap-2">
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[130px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <span>Role: {roleFilter === 'all' ? 'All' : roleFilter}</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          {roles.map(role => (
                            <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="whitespace-nowrap">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Add New Team Member</DialogTitle>
                          <DialogDescription>
                            Add a new team member and assign their role and permissions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Full Name
                            </Label>
                            <Input
                              id="name"
                              placeholder="Enter full name"
                              className="col-span-3"
                              value={newMember.name}
                              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter email address"
                              className="col-span-3"
                              value={newMember.email}
                              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                              Role
                            </Label>
                            <Select 
                              value={newMember.role} 
                              onValueChange={(value) => setNewMember({...newMember, role: value})}
                            >
                              <SelectTrigger id="role" className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map(role => (
                                  <SelectItem key={role.id} value={role.name}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <div className="flex items-center space-x-2 col-span-3">
                              <Switch 
                                id="status" 
                                checked={newMember.status === 'active'}
                                onCheckedChange={(checked) => 
                                  setNewMember({...newMember, status: checked ? 'active' : 'inactive'})
                                }
                              />
                              <Label htmlFor="status" className="cursor-pointer">
                                {newMember.status === 'active' ? 'Active' : 'Inactive'}
                              </Label>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="invite" className="text-right">
                              Send Invite
                            </Label>
                            <div className="flex items-center space-x-2 col-span-3">
                              <Switch 
                                id="invite" 
                                checked={sendInviteEmail}
                                onCheckedChange={setSendInviteEmail}
                              />
                              <Label htmlFor="invite" className="cursor-pointer">
                                Send invitation email
                              </Label>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleAddMember}>Add Member</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
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
                      {filteredTeamMembers.length > 0 ? (
                        filteredTeamMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  member.role === 'Super Admin' 
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
                                    : member.role === 'Finance'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                }
                              >
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                {member.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(member.dateAdded)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => openEditDialog(member)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => toggleMemberStatus(member.id)}
                                >
                                  {member.status === 'active' ? (
                                    <UserX className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <UserCheck className="h-4 w-4 text-green-500" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveMember(member.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No team members found matching your filters
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  Define roles and assign permissions to control access to different parts of the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {roles.map((role) => (
                    <div key={role.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{role.name}</h3>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          {role.name !== 'Super Admin' && (
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Delete</Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {role.name === 'Super Admin' ? (
                          <div className="flex items-center space-x-2 border p-2 rounded">
                            <Checkbox id="all-permissions" checked={true} disabled />
                            <Label htmlFor="all-permissions" className="text-sm">All Permissions</Label>
                          </div>
                        ) : (
                          permissions
                            .filter(permission => role.permissions.includes(permission.id))
                            .map(permission => (
                              <div key={permission.id} className="flex items-center space-x-2 border p-2 rounded">
                                <Checkbox 
                                  id={`${role.id}-${permission.id}`} 
                                  checked={true} 
                                  disabled 
                                />
                                <Label 
                                  htmlFor={`${role.id}-${permission.id}`} 
                                  className="text-sm cursor-default"
                                  title={permission.description}
                                >
                                  {permission.name}
                                </Label>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Member Dialog */}
        <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>
                Update team member details and role
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="edit-name"
                    placeholder="Enter full name"
                    className="col-span-3"
                    value={selectedMember.name}
                    onChange={(e) => setSelectedMember({...selectedMember, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="Enter email address"
                    className="col-span-3"
                    value={selectedMember.email}
                    onChange={(e) => setSelectedMember({...selectedMember, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select 
                    value={selectedMember.role} 
                    onValueChange={(value) => setSelectedMember({...selectedMember, role: value})}
                  >
                    <SelectTrigger id="edit-role" className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch 
                      id="edit-status" 
                      checked={selectedMember.status === 'active'}
                      onCheckedChange={(checked) => 
                        setSelectedMember({...selectedMember, status: checked ? 'active' : 'inactive'})
                      }
                    />
                    <Label htmlFor="edit-status" className="cursor-pointer">
                      {selectedMember.status === 'active' ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateMember}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TeamManagementPage;
