
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, FileText, Download, Upload, Save, ArrowUp, Check, X } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ServiceOrder, ServiceOrderTeamMember, ServiceOrderFile } from '@/types/serviceOrder';
import { mockServiceOrders, mockTeamMembers } from '@/data/serviceOrders';

const ServiceOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [teamMembers, setTeamMembers] = useState<ServiceOrderTeamMember[]>([]);
  const [newNote, setNewNote] = useState('');
  const [notifyOnUpdate, setNotifyOnUpdate] = useState(false);
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState<string>('');
  const [fileUploads, setFileUploads] = useState<File[]>([]);

  useEffect(() => {
    // In a real application, this would be an API call to get the order by ID
    // For now, we'll use mock data
    const fetchOrderData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const foundOrder = mockServiceOrders.find(order => order.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
          setEstimatedCompletionDate(foundOrder.estimatedCompletionDate || '');
        } else {
          toast({
            title: "Order not found",
            description: "The requested service order could not be found.",
            variant: "destructive"
          });
          navigate('/dashboard/admin/service-orders');
        }
        setTeamMembers(mockTeamMembers);
        setLoading(false);
      }, 500);
    };
    
    fetchOrderData();
  }, [id, navigate, toast]);
  
  const handleStatusChange = (status: string) => {
    if (!order) return;
    
    setOrder({
      ...order,
      status: status as any
    });
  };
  
  const handleAssignedToChange = (memberId: string) => {
    if (!order) return;
    
    const selectedTeamMember = teamMembers.find(m => m.id === memberId);
    
    setOrder({
      ...order,
      assignedTo: memberId,
      assignedTeamMember: selectedTeamMember
    });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Append new files to existing uploads
      setFileUploads(prevFiles => [...prevFiles, ...Array.from(files)]);
    }
  };
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    if (!order) return;
    
    // Create a new note with timestamp
    const currentDate = new Date();
    const noteWithTimestamp = `[${format(currentDate, 'MMM dd, yyyy HH:mm')}] ${newNote}`;
    
    // Append to internal notes
    const updatedNotes = order.internalNotes 
      ? `${order.internalNotes}\n\n${noteWithTimestamp}` 
      : noteWithTimestamp;
    
    setOrder({
      ...order,
      internalNotes: updatedNotes
    });
    
    setNewNote('');
    
    toast({
      title: "Note added",
      description: "Your note has been added to this order.",
    });
  };
  
  const handleSaveOrder = () => {
    if (!order) return;
    
    // In a real application, this would save the order to the database
    // For now, we'll just show a success message
    toast({
      title: "Order updated",
      description: "Service order details have been updated successfully.",
    });
    
    if (notifyOnUpdate && order.assignedTeamMember) {
      toast({
        title: "Notification sent",
        description: `${order.assignedTeamMember.name} has been notified of the updates.`,
      });
    }
  };
  
  const handleAddFiles = () => {
    if (!order || fileUploads.length === 0) return;
    
    // In a real application, this would upload the files to a server
    // For now, we'll simulate adding files to the order
    const newFiles: ServiceOrderFile[] = fileUploads.map((file, index) => ({
      id: `new-file-${Date.now()}-${index}`,
      filename: file.name,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      uploadedBy: 'Admin',
      uploadedAt: new Date().toISOString()
    }));
    
    setOrder({
      ...order,
      files: [...(order.files || []), ...newFiles]
    });
    
    setFileUploads([]);
    
    toast({
      title: "Files added",
      description: `${newFiles.length} file(s) have been added to this order.`,
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
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
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
                  <p className="text-center">Order not found.</p>
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => navigate('/dashboard/admin/service-orders')}>
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
              <h1 className="text-2xl font-bold">Service Order Details</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/dashboard/admin/service-orders')}>
                  Back to Orders
                </Button>
                <Button onClick={handleSaveOrder}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Order Overview Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Order Overview</span>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column - Order info */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="orderId" className="text-right">Order ID</Label>
                      <div className="col-span-2 font-medium text-primary">{order.orderId}</div>
                    </div>
                  
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="serviceType" className="text-right">Service Type</Label>
                      <div className="col-span-2">{order.serviceTypeDisplay}</div>
                    </div>
                  
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="orderDate" className="text-right">Order Date</Label>
                      <div className="col-span-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(new Date(order.orderDate), 'MMMM dd, yyyy')}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="orderTime" className="text-right">Order Time</Label>
                      <div className="col-span-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(new Date(order.orderDate), 'HH:mm')}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="status" className="text-right">Status</Label>
                      <Select 
                        value={order.status} 
                        onValueChange={handleStatusChange}
                        className="col-span-2"
                      >
                        <SelectTrigger>
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
                    
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="completion" className="text-right">Est. Completion</Label>
                      <Input
                        id="completion"
                        className="col-span-2"
                        type="date"
                        value={estimatedCompletionDate}
                        onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Right column - Client info */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="userName" className="text-right">Client Name</Label>
                      <div className="col-span-2">{order.userName}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="userEmail" className="text-right">Client Email</Label>
                      <div className="col-span-2">{order.userEmail}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="userType" className="text-right">Client Type</Label>
                      <div className="col-span-2 capitalize">{order.userType}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">Amount</Label>
                      <div className="col-span-2">
                        {order.amount 
                          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency || 'USD' }).format(order.amount)
                          : 'Not specified'
                        }
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="notify" className="text-right">Notifications</Label>
                      <div className="col-span-2 flex items-center">
                        <input 
                          type="checkbox" 
                          id="notify"
                          checked={notifyOnUpdate}
                          onChange={() => setNotifyOnUpdate(!notifyOnUpdate)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="notify" className="ml-2 text-sm">
                          Notify when updated
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detail Tabs */}
            <Tabs defaultValue="assignment" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="assignment">Assignment</TabsTrigger>
                <TabsTrigger value="files">Files & Uploads</TabsTrigger>
                <TabsTrigger value="notes">Notes & Communication</TabsTrigger>
              </TabsList>
              
              {/* Assignment Tab */}
              <TabsContent value="assignment" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Assign Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="assignedTo" className="text-right">
                          Assign To Team Member
                        </Label>
                        <div className="col-span-3">
                          <Select 
                            value={order.assignedTo || 'unassigned'} 
                            onValueChange={handleAssignedToChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {teamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name} ({member.role})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currentAssignment" className="text-right">
                          Currently Assigned
                        </Label>
                        <div className="col-span-3">
                          {order.assignedTeamMember ? (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                {order.assignedTeamMember.avatar ? (
                                  <img 
                                    src={order.assignedTeamMember.avatar} 
                                    alt={order.assignedTeamMember.name} 
                                    className="h-8 w-8 rounded-full"
                                  />
                                ) : (
                                  <span className="text-sm font-medium">
                                    {order.assignedTeamMember.name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{order.assignedTeamMember.name}</p>
                                <p className="text-sm text-muted-foreground">{order.assignedTeamMember.role}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No team member assigned</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Files Tab */}
              <TabsContent value="files" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Client Uploaded Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.files && order.files.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {order.files.map((file) => (
                          <div 
                            key={file.id} 
                            className="flex items-center p-3 border rounded-md text-sm"
                          >
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                            <span className="truncate flex-1">{file.filename}</span>
                            <Button variant="ghost" size="icon" className="ml-2" title="Download file">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No files have been uploaded by the client.</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Upload Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Drag and drop files here, or click to select files
                        </p>
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          multiple
                        />
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose Files
                        </Button>
                      </div>
                      
                      {fileUploads.length > 0 && (
                        <>
                          <h4 className="text-sm font-medium">Files to upload ({fileUploads.length})</h4>
                          <div className="space-y-2">
                            {fileUploads.map((file, index) => (
                              <div 
                                key={index} 
                                className="flex items-center p-2 bg-secondary/20 rounded-md text-sm"
                              >
                                <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-secondary" />
                                <span className="truncate flex-1">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-end">
                            <Button onClick={handleAddFiles}>
                              <ArrowUp className="mr-2 h-4 w-4" />
                              Upload Files
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notes & Communication Tab */}
              <TabsContent value="notes" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Order Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                      {order.description || 'No description provided.'}
                    </p>
                    
                    {order.requirements && (
                      <>
                        <h3 className="text-lg font-medium mt-4 mb-2">Client Requirements</h3>
                        <p className="text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                          {order.requirements}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Internal Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Display existing notes */}
                      {order.internalNotes ? (
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-sm whitespace-pre-wrap">
                          {order.internalNotes}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No internal notes yet.</p>
                      )}
                      
                      <Separator />
                      
                      {/* Add new note */}
                      <div className="space-y-2">
                        <Label htmlFor="newNote">Add Note</Label>
                        <Textarea
                          id="newNote"
                          placeholder="Type your notes here..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end">
                          <Button onClick={handleAddNote}>
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Order Timeline */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-800">
                        <div className="absolute -left-1.5 mt-1.5">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                        </div>
                        <div className="mb-4">
                          <time className="text-xs text-muted-foreground">
                            {format(new Date(order.orderDate), 'MMM dd, yyyy HH:mm')}
                          </time>
                          <h3 className="font-medium">Order Created</h3>
                          <p className="text-sm text-muted-foreground">
                            Service order was placed by {order.userName}
                          </p>
                        </div>
                      </div>
                      
                      {/* Mock timeline events - in a real application these would come from the database */}
                      <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-800">
                        <div className="absolute -left-1.5 mt-1.5">
                          <div className="h-3 w-3 rounded-full bg-secondary"></div>
                        </div>
                        <div className="mb-4">
                          <time className="text-xs text-muted-foreground">
                            {format(new Date(), 'MMM dd, yyyy HH:mm')}
                          </time>
                          <h3 className="font-medium">Status Updated</h3>
                          <p className="text-sm text-muted-foreground">
                            Admin updated order status to <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServiceOrderDetailPage;
