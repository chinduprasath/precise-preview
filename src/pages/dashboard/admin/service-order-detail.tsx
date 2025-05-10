import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Download, FileText, Upload, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { mockServiceOrders, mockTeamMembers } from '@/data/serviceOrders';
import { ServiceOrder, OrderStatus, ServiceOrderTeamMember } from '@/types/serviceOrder';
import { useToast } from '@/components/ui/use-toast';

const ServiceOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [internalNote, setInternalNote] = useState('');
  const [notes, setNotes] = useState<{ text: string, timestamp: Date }[]>([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting the file input

  useEffect(() => {
    // Simulate loading data from an API
    setLoading(true);
    setTimeout(() => {
      const foundOrder = mockServiceOrders.find(o => o.id === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
        if (foundOrder.internalNotes) {
          // Convert existing internal notes to our format if they exist
          setNotes([{ 
            text: foundOrder.internalNotes as string,
            timestamp: new Date(foundOrder.orderDate)
          }]);
        }
        
        if (foundOrder.estimatedCompletionDate) {
          setSelectedDate(new Date(foundOrder.estimatedCompletionDate));
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleStatusChange = (status: string) => {
    if (order) {
      setOrder({
        ...order,
        status: status as OrderStatus
      });
    }
  };

  const handleAssignTeamMember = (teamMemberId: string) => {
    if (order) {
      const teamMember = mockTeamMembers.find(tm => tm.id === teamMemberId);
      setOrder({
        ...order,
        assignedTo: teamMemberId,
        assignedTeamMember: teamMember
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (order && date) {
      setOrder({
        ...order,
        estimatedCompletionDate: date.toISOString().split('T')[0]
      });
    }
  };

  const handleAddNote = () => {
    if (!internalNote.trim()) return;
    
    const newNote = {
      text: internalNote,
      timestamp: new Date()
    };
    
    setNotes(prevNotes => [...prevNotes, newNote]);
    setInternalNote('');
    
    // Also update the order object
    if (order) {
      setOrder({
        ...order,
        internalNotes: internalNote // This would be appended in a real app
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    const file = e.target.files[0];
    
    // In a real app, we would upload this file to a server/storage
    // For now, let's simulate adding it to the order's files array
    if (order) {
      const newFile = {
        id: `f${Date.now()}`,
        filename: file.name,
        fileUrl: '#', // Would be a real URL in production
        fileType: file.type,
        uploadedBy: 'current-admin-id', // Would be real in production
        uploadedAt: new Date().toISOString()
      };
      
      setOrder({
        ...order,
        files: [...(order.files || []), newFile]
      });
      
      // Reset file input
      setFileInputKey(Date.now());
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleSaveOrder = () => {
    // In a real app, this would send the updated order to an API
    toast({
      title: "Order updated",
      description: `Order ${order?.orderId} has been updated successfully.`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'secondary';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">Order not found</h3>
                    <p className="text-muted-foreground mt-2">The requested service order does not exist or has been removed.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/dashboard/admin/service-orders')}
                    >
                      Back to Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-2"
                  onClick={() => navigate('/dashboard/admin/service-orders')}
                >
                  Back to Orders
                </Button>
                <h1 className="text-2xl font-bold flex items-center">
                  Order Details - {order.orderId}
                  <Badge variant={getStatusBadgeVariant(order.status)} className="ml-3">
                    {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </h1>
              </div>
              
              <Button onClick={handleSaveOrder}>Save Changes</Button>
            </div>

            {/* Order Overview Section */}
            <Card>
              <CardHeader>
                <CardTitle>Order Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Order Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Service Type</p>
                        <p className="text-sm font-medium">{order.serviceTypeDisplay}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="text-sm font-medium">
                          {format(new Date(order.orderDate), 'PPP')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="mt-1">
                          <Select
                            value={order.status}
                            onValueChange={handleStatusChange}
                          >
                            <SelectTrigger className="w-full sm:w-[200px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Completion Date</p>
                        <div className="flex mt-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={"w-full sm:w-[200px] justify-start text-left font-normal"}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Client Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="text-sm font-medium">{order.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{order.userEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">User Type</p>
                        <p className="text-sm font-medium capitalize">{order.userType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">User ID</p>
                        <p className="text-sm font-medium">{order.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Section */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Assigned Team Member</p>
                  <Select
                    value={order.assignedTo || ''}
                    onValueChange={handleAssignTeamMember}
                  >
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Assign to team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {order.assignedTeamMember && (
                  <div className="flex items-center mt-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      {order.assignedTeamMember.avatar ? (
                        <img 
                          src={order.assignedTeamMember.avatar} 
                          alt={order.assignedTeamMember.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <UserCircle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.assignedTeamMember.name}</p>
                      <p className="text-xs text-muted-foreground">{order.assignedTeamMember.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm bg-muted p-4 rounded-md">
                      {order.description || "No description provided."}
                    </p>
                  </div>
                  
                  {order.requirements && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Requirements</h4>
                      <p className="text-sm bg-muted p-4 rounded-md">
                        {order.requirements}
                      </p>
                    </div>
                  )}
                  
                  {order.amount && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Pricing</h4>
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: order.currency || 'USD'
                        }).format(order.amount)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* File Sharing Section */}
            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Files uploaded by the user */}
                  {order.files && order.files.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Attached Files</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {order.files.map(file => (
                          <div 
                            key={file.id}
                            className="flex items-center p-3 border rounded-lg text-sm"
                          >
                            <FileText className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="flex-grow truncate">{file.filename}</span>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No files attached to this order.
                    </div>
                  )}
                  
                  {/* File upload section */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Upload Files</h4>
                    <div className="flex items-center space-x-2">
                      <Input
                        key={fileInputKey}
                        type="file"
                        onChange={handleFileUpload}
                        className="flex-grow"
                      />
                      <Button type="button" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes & Communication Section */}
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Existing notes */}
                  <div>
                    {notes.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {notes.map((note, index) => (
                          <div key={index} className="p-3 bg-muted rounded-md">
                            <p className="text-sm mb-1">{note.text}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(note.timestamp), 'PPp')}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-sm text-muted-foreground">
                        No internal notes for this order yet.
                      </p>
                    )}
                  </div>
                  
                  {/* Add new note */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Add Note</h4>
                    <Textarea
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add internal notes here..."
                      className="mb-3"
                    />
                    <Button onClick={handleAddNote} disabled={!internalNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action buttons footer */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pb-8">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/admin/service-orders')}
              >
                Back to Orders
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="destructive">Cancel Order</Button>
                <Button onClick={handleSaveOrder}>Save Changes</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Export the component properly
export default ServiceOrderDetailPage;
