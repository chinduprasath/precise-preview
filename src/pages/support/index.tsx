
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
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
import CreateTicketForm from "@/components/support/CreateTicketForm";
import { Ticket, TicketCategory, TicketPriority, UserType, TicketStatus } from "@/types/ticket";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSupportTickets, addSupportTicket, SupportTicketDetail } from "@/data/supportTickets";

const SupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>("business");
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "active";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "new" || tab === "active" || tab === "resolved")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearchParams({ tab: val });
  };
  
  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem("userType") as UserType | null;
    if (storedUserType && (storedUserType === "business" || storedUserType === "influencer")) {
      setUserType(storedUserType);
    }
    
    // Fetch tickets from persistent store
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const stored = getSupportTickets();
        const mappedTickets: Ticket[] = stored.map((t) => ({
          id: t.id,
          userId: "user1",
          userName: "Current User",
          userType: (storedUserType || "business") as UserType,
          subject: t.subject,
          category: (t.category as TicketCategory) || "Other",
          priority: t.priority,
          status: t.status as TicketStatus,
          createdAt: t.createdAt,
          lastUpdated: t.lastUpdated,
          assignedTo: t.assignedTo,
          messages: t.messages.map((m) => ({
            id: m.id,
            ticketId: t.id,
            userId: m.sender === "user" ? "user1" : "admin1",
            userName: m.name,
            userType: (m.sender === "user" ? (storedUserType || "business") : "admin") as UserType,
            message: m.message,
            createdAt: m.createdAt,
            isInternal: false,
          })),
        }));
        
        setTickets(mappedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error",
          description: "Failed to load your support tickets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);
  
  const navigate = useNavigate();
  const handleViewTicket = (ticketId: string) => {
    navigate(`/support/tickets/${ticketId}`);
  };
  
  const handleReply = async (
    ticketId: string,
    message: string,
    isInternal: boolean,
    attachments: File[]
  ) => {
    try {
      // In a real app, upload attachments to storage and save message to database
      
      // Example only: Create a new message object
      const newMessage = {
        id: `m${Math.random().toString(36).substring(7)}`,
        ticketId,
        userId: "user1",
        userName: "Current User",
        userType,
        message,
        createdAt: new Date().toISOString(),
        isInternal: false, // Users can't create internal notes
        attachments: attachments.length
          ? attachments.map((file) => ({
              name: file.name,
              url: URL.createObjectURL(file),
              type: file.type,
            }))
          : undefined,
      };
      
      // Update the ticket in state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              messages: [...ticket.messages, newMessage],
              lastUpdated: new Date().toISOString(),
              status: ticket.status === "Resolved" ? "In Progress" : ticket.status,
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
              status: prev.status === "Resolved" ? "In Progress" : prev.status,
            };
          }
          return prev;
        });
      }
      
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully",
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send your reply",
        variant: "destructive",
      });
    }
  };
  
  const handleCreateTicket = async (
    subject: string,
    category: TicketCategory,
    priority: TicketPriority,
    message: string,
    attachments: File[]
  ) => {
    try {
      // In a real app, upload attachments to storage and save ticket to database
      
      // Example only: Create a new ticket object
      const ticketId = `T${Math.floor(1000 + Math.random() * 9000)}`;
      const createdAtIso = new Date().toISOString();
      const newTicket: Ticket = {
        id: ticketId,
        userId: "user1",
        userName: "Current User",
        userType: (localStorage.getItem("userType") as UserType) || "business",
        subject,
        category,
        priority,
        status: "Submitted",
        createdAt: createdAtIso,
        lastUpdated: createdAtIso,
        messages: [
          {
            id: `m${Math.random().toString(36).substring(7)}`,
            ticketId,
            userId: "user1",
            userName: "Current User",
            userType: (localStorage.getItem("userType") as UserType) || "business",
            message,
            createdAt: createdAtIso,
            isInternal: false,
            attachments: attachments.length
              ? attachments.map((file) => ({
                  name: file.name,
                  url: URL.createObjectURL(file),
                  type: file.type,
                }))
              : undefined,
          },
        ],
      };

      const detailTicket: SupportTicketDetail = {
        id: ticketId,
        subject,
        status: "Submitted",
        priority,
        category,
        createdAt: createdAtIso,
        lastUpdated: createdAtIso,
        lastStatusChange: createdAtIso,
        assignedTo: "Support Team",
        agent: "Support Specialist",
        expectedResponse: "Within 4 hours",
        chatEnabled: true,
        supportOnline: true,
        issue: {
          description: message,
          affectedService: category,
        },
        messages: [
          {
            id: `m1`,
            sender: "user",
            name: "You",
            role: "Customer",
            createdAt: createdAtIso,
            message,
            status: "Sent",
            attachments: attachments.map((f) => ({
              name: f.name,
              size: f.size,
              type: f.type,
              url: URL.createObjectURL(f),
              uploadedAt: createdAtIso,
            })),
          },
        ],
        activity: [
          {
            id: `a1`,
            createdAt: createdAtIso,
            label: "Ticket created",
            kind: "created",
          },
        ],
        relatedIds: ["T1001"],
      };

      addSupportTicket(detailTicket);
      
      // Add the new ticket to the state
      setTickets((prevTickets) => [newTicket, ...prevTickets]);
      setActiveTab("active");
      
      toast({
        title: "Ticket created",
        description: "Your support ticket has been created successfully",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create your support ticket",
        variant: "destructive",
      });
      throw error; // Re-throw so the form knows it failed
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🛠️ Support Center</h1>
          <p className="text-muted-foreground">
            Get help and support for your account and services
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Tickets</TabsTrigger>
            <TabsTrigger value="new">Create New Ticket</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Tickets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            <CreateTicketForm onSubmit={handleCreateTicket} />
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Support Tickets</CardTitle>
                <CardDescription>
                  View and manage your ongoing support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets.filter(
                      (t) => t.status !== "Resolved" && t.status !== "Closed"
                    )}
                    isAdmin={false}
                    onViewTicket={handleViewTicket}
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
                  View your past and resolved support requests
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
                    isAdmin={false}
                    onViewTicket={handleViewTicket}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <TicketDetail
          ticket={selectedTicket}
          isAdmin={false}
          onClose={() => setSelectedTicket(null)}
          onReply={handleReply}
        />
      </div>
    </Layout>
  );
};

export default SupportPage;
