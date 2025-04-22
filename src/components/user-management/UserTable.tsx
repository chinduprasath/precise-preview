
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Ban, 
  Tag,
  Shield,
  Check,
  Star 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface UserTag {
  id: string;
  name: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  status: 'active' | 'inactive' | 'blocked';
  profileImage?: string;
  tags: UserTag[];
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onBlock: (userId: string, duration: string, reason?: string) => void;
  onTagsChange: (userId: string, tags: UserTag[]) => void;
  availableTags: UserTag[];
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onBlock,
  onTagsChange,
  availableTags
}) => {
  const [selectedBlockDuration, setSelectedBlockDuration] = useState<Record<string, string>>({});

  const getTagIcon = (tag: UserTag) => {
    switch(tag.name.toLowerCase()) {
      case 'verified':
        return <Check className="h-3 w-3" />;
      case 'sponsored':
        return <Shield className="h-3 w-3" />;
      case 'top rated':
        return <Star className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTagColor = (tag: UserTag) => {
    if (tag.color) return tag.color;
    
    switch(tag.name.toLowerCase()) {
      case 'verified':
        return 'bg-blue-500';
      case 'sponsored':
        return 'bg-yellow-500';
      case 'top rated':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleBlockUser = (userId: string) => {
    const duration = selectedBlockDuration[userId] || '1 day';
    onBlock(userId, duration);
    toast.success(`User blocked for ${duration}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleTagToggle = (userId: string, tag: UserTag) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const updatedTags = user.tags.some(t => t.id === tag.id) 
      ? user.tags.filter(t => t.id !== tag.id)
      : [...user.tags, tag];
    
    onTagsChange(userId, updatedTags);
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.joinedDate}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(user.status)}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.tags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="outline" 
                      className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 text-white ${getTagColor(tag)}`}
                    >
                      {getTagIcon(tag)}
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Ban className="mr-2 h-4 w-4" />
                        Block
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup 
                          value={selectedBlockDuration[user.id] || '1 day'}
                          onValueChange={(value) => {
                            setSelectedBlockDuration(prev => ({...prev, [user.id]: value}));
                          }}
                        >
                          <DropdownMenuRadioItem value="1 day">1 Day</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="3 days">3 Days</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="7 days">7 Days</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="custom">Custom...</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBlockUser(user.id)}>
                          Confirm Block
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Tag className="mr-2 h-4 w-4" />
                        Manage Tags
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {availableTags.map(tag => (
                          <DropdownMenuItem 
                            key={tag.id}
                            onClick={() => handleTagToggle(user.id, tag)}
                          >
                            <div className="flex items-center">
                              {user.tags.some(t => t.id === tag.id) ? (
                                <Check className="mr-2 h-4 w-4" />
                              ) : (
                                <div className="w-4 mr-2" />
                              )}
                              {tag.name}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                          onDelete(user.id);
                          toast.success("User deleted successfully");
                        }
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
