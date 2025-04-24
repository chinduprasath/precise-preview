
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TicketTable from "@/components/support/TicketTable";
import TicketDetail from "@/components/support/TicketDetail";
import { Ticket, TicketStatus, TicketPriority, UserType } from "@/types/ticket";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileSpreadsheet } from "lucide-react";

// Mock team members - in a real app, fetch from the database
const teamMembers = [
  { id: "team1", name: "John Smith" },
  { id: "team2", name: "Sarah Johnson" },
  { id: "team3", name: "Mike Thompson" },
];

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  
  // In a real app, fetch tickets from the database
  useEffect(() => {
    // This would be replaced with actual fetch from Supabase
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Example of how to fetch tickets from Supabase
        // const { data, error } = await supabase
        //   .from('tickets')
        //   .select('*')
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        // setTickets(data);
        
        // Using mock data for now
        const mockTickets: Ticket[] = [
          {
            id: "T1001",
            userId: "user1",
            userName: "John Doe",
            userType: "business",
            subject: "Payment processing issue",
            category: "Payment",
            priority: "High",
            status: "New",
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            messages: [
              {
                id: "m1",
                ticketId: "T1001",
                userId: "user1",
                userName: "John Doe",
                userType: "business",
                message: "I'm having trouble processing a payment. The transaction fails every time.",
                createdAt: new Date().toISOString(),
                isInternal: false,
              },
            ],
          },
          {
            id: "T1002",
            userId: "user2",
            userName: "Jane Smith",
            userType: "influencer",
            subject: "Account verification",
            category: "Account Issue",
            priority: "Medium",
            status: "In Progress",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            lastUpdated: new Date(Date.now() - 43200000).toISOString(),
            assignedTo: "team1",
            messages: [
              {
                id: "m2",
                ticketId: "T1002",
                userId: "user2",
                userName: "Jane Smith",
                userType: "influencer",
                message: "I uploaded my verification documents yesterday but haven't received any updates.",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                isInternal: false,
              },
              {
                id: "m3",
                ticketId: "T1002",
                userId: "admin1",
                userName: "John Smith",
                userType: "admin",
                message: "I'm checking your documents now. Will update you shortly.",
                createdAt: new Date(Date.now() - 43200000).toISOString(),
                isInternal: false,
              },
              {
                id: "m4",
                ticketId: "T1002",
                userId: "admin1",
                userName: "John Smith",
                userType: "admin",
                message: "Documents look blurry. Need to request clearer ones.",
                createdAt: new Date(Date.now() - 43000000).toISOString(),
                isInternal: true,
              },
            ],
          },
        ];
        
        setTickets(mockTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error",
          description: "Failed to load support tickets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);
  
  const handleViewTicket = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };
  
  const handleReply = async (
    ticketId: string,
    message: string,
    isInternal: boolean,
    attachments: File[]
  ) => {
    try {
      // In a real app, upload attachments to storage and save message to database
      
      // Example only: Create a new message object with correct UserType
      const newMessage = {
        id: `m${Math.random().toString(36).substring(7)}`,
        ticketId,
        userId: "admin1",
        userName: "Admin User",
        userType: "admin" as UserType,  // Explicitly cast to UserType
        message,
        createdAt: new Date().toISOString(),
        isInternal,
        attachments: attachments.length
          ? attachments.map((file) => ({
              name: file.name,
              url: URL.createObjectURL(file),
              type: file.type,
            }))
          : undefined,
      };
      
      // Update the ticket in state with proper typing
      setTickets((prevTickets) =>
        prevTickets.map((ticket) => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              messages: [...ticket.messages, newMessage],
              lastUpdated: new Date().toISOString(),
            };
          }
          return ticket;
        })
      );
      
      // If the selected ticket is the one being updated, update it too
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => {
          if (prev) {
            return {
              ...prev,
              messages: [...prev.messages, newMessage],
              lastUpdated: new Date().toISOString(),
            };
          }
          return prev;
        });
      }
      
      toast({
        title: "Reply sent",
        description: isInternal
          ? "Internal note added successfully"
          : "Reply sent successfully",
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };
  
  const handleStatusChange = (ticketId: string, status: TicketStatus) => {
    // In a real app, update the status in the database
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status,
            lastUpdated: new Date().toISOString(),
          };
        }
        return ticket;
      })
    );
    
    // Update selected ticket if it's the one being changed
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => {
        if (prev) {
          return {
            ...prev,
            status,
            lastUpdated: new Date().toISOString(),
          };
        }
        return prev;
      });
    }
    
    toast({
      title: "Status updated",
      description: `Ticket status changed to ${status}`,
    });
  };
  
  const handleAssigneeChange = (ticketId: string, assigneeId: string) => {
    // In a real app, update the assignee in the database
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            assignedTo: assigneeId || undefined,
            lastUpdated: new Date().toISOString(),
          };
        }
        return ticket;
      })
    );
    
    // Update selected ticket if it's the one being changed
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => {
        if (prev) {
          return {
            ...prev,
            assignedTo: assigneeId || undefined,
            lastUpdated: new Date().toISOString(),
          };
        }
        return prev;
      });
    }
    
    const assigneeName = assigneeId
      ? teamMembers.find((m) => m.id === assigneeId)?.name || "Unknown"
      : "Unassigned";
    
    toast({
      title: "Assignee updated",
      description: `Ticket assigned to ${assigneeName}`,
    });
  };
  
  const handlePriorityChange = (ticketId: string, priority: TicketPriority) => {
    // In a real app, update the priority in the database
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            priority,
            lastUpdated: new Date().toISOString(),
          };
        }
        return ticket;
      })
    );
    
    // Update selected ticket if it's the one being changed
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => {
        if (prev) {
          return {
            ...prev,
            priority,
            lastUpdated: new Date().toISOString(),
          };
        }
        return prev;
      });
    }
    
    toast({
      title: "Priority updated",
      description: `Ticket priority changed to ${priority}`,
    });
  };
  
  const exportToCSV = () => {
    // Create CSV content from tickets
    const headers = [
      "Ticket ID",
      "Created At",
      "User Name",
      "User Type",
      "Subject",
      "Status",
      "Priority",
      "Assigned To",
      "Last Updated",
    ];
    
    const rows = tickets.map((ticket) => [
      ticket.id,
      new Date(ticket.createdAt).toLocaleString(),
      ticket.userName,
      ticket.userType,
      ticket.subject,
      ticket.status,
      ticket.priority,
      ticket.assignedTo
        ? teamMembers.find((m) => m.id === ticket.assignedTo)?.name || "Unknown"
        : "Unassigned",
      new Date(ticket.lastUpdated).toLocaleString(),
    ]);
    
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `support_tickets_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Support tickets exported to CSV",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">🛠️ Support Center</h1>
            <p className="text-muted-foreground">
              Manage and respond to support tickets from users
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Support Tickets</CardTitle>
                <CardDescription>
                  View and manage all support tickets across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets}
                    isAdmin={true}
                    onViewTicket={handleViewTicket}
                    teamMembers={teamMembers}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onPriorityChange={handlePriorityChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>New Tickets</CardTitle>
                <CardDescription>
                  Recently submitted tickets that require attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets.filter((t) => t.status === "New")}
                    isAdmin={true}
                    onViewTicket={handleViewTicket}
                    teamMembers={teamMembers}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onPriorityChange={handlePriorityChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inProgress">
            <Card>
              <CardHeader>
                <CardTitle>In Progress Tickets</CardTitle>
                <CardDescription>
                  Tickets currently being addressed by the team
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets.filter((t) => t.status === "In Progress")}
                    isAdmin={true}
                    onViewTicket={handleViewTicket}
                    teamMembers={teamMembers}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onPriorityChange={handlePriorityChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Tickets</CardTitle>
                <CardDescription>
                  Tickets that have been successfully resolved
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets.filter(
                      (t) => t.status === "Resolved" || t.status === "Closed"
                    )}
                    isAdmin={true}
                    onViewTicket={handleViewTicket}
                    teamMembers={teamMembers}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onPriorityChange={handlePriorityChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <TicketDetail
          ticket={selectedTicket}
          isAdmin={true}
          onClose={() => setSelectedTicket(null)}
          onReply={handleReply}
          onStatusChange={handleStatusChange}
          onAssigneeChange={handleAssigneeChange}
          teamMembers={teamMembers}
        />
      </div>
    </Layout>
  );
};

export default AdminSupportPage;
