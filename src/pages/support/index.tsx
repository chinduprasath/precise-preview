
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
import { Ticket, TicketCategory, TicketPriority } from "@/types/ticket";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<"business" | "influencer">("business");
  
  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem("userType") as "business" | "influencer" | null;
    if (storedUserType && (storedUserType === "business" || storedUserType === "influencer")) {
      setUserType(storedUserType);
    }
    
    // In a real app, fetch tickets from the database
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Example of how to fetch tickets from Supabase
        // const { data, error } = await supabase
        //   .from('tickets')
        //   .select('*')
        //   .eq('user_type', storedUserType)
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        // setTickets(data);
        
        // Using mock data for now
        const mockTickets: Ticket[] = [
          {
            id: "T1001",
            userId: "user1",
            userName: "Current User",
            userType: storedUserType || "business",
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
                userName: "Current User",
                userType: storedUserType || "business",
                message: "I'm having trouble processing a payment. The transaction fails every time.",
                createdAt: new Date().toISOString(),
                isInternal: false,
              },
            ],
          },
          {
            id: "T1002",
            userId: "user1",
            userName: "Current User",
            userType: storedUserType || "business",
            subject: "Account verification",
            category: "Account Issue",
            priority: "Medium",
            status: "In Progress",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            lastUpdated: new Date(Date.now() - 43200000).toISOString(),
            messages: [
              {
                id: "m2",
                ticketId: "T1002",
                userId: "user1",
                userName: "Current User",
                userType: storedUserType || "business",
                message: "I uploaded my verification documents yesterday but haven't received any updates.",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                isInternal: false,
              },
              {
                id: "m3",
                ticketId: "T1002",
                userId: "admin1",
                userName: "Support Team",
                userType: "admin",
                message: "Thank you for reaching out. I'm checking your documents now. Will update you shortly.",
                createdAt: new Date(Date.now() - 43200000).toISOString(),
                isInternal: false,
              },
            ],
          },
          {
            id: "T1003",
            userId: "user1",
            userName: "Current User",
            userType: storedUserType || "business",
            subject: "Feature request",
            category: "Other",
            priority: "Low",
            status: "Resolved",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            lastUpdated: new Date(Date.now() - 86400000).toISOString(),
            messages: [
              {
                id: "m4",
                ticketId: "T1003",
                userId: "user1",
                userName: "Current User",
                userType: storedUserType || "business",
                message: "I would like to suggest a new feature that allows bulk editing of campaigns.",
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                isInternal: false,
              },
              {
                id: "m5",
                ticketId: "T1003",
                userId: "admin1",
                userName: "Support Team",
                userType: "admin",
                message: "Thank you for the suggestion! We've added it to our feature backlog and will consider it for future updates.",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                isInternal: false,
              },
            ],
          },
        ];
        
        setTickets(mockTickets);
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
      
      // Example only: Create a new message object
      const newMessage = {
        id: `m${Math.random().toString(36).substring(7)}`,
        ticketId,
        userId: "user1",
        userName: "Current User",
        userType: userType,
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
      const newTicket: Ticket = {
        id: `T${Math.floor(1000 + Math.random() * 9000)}`,
        userId: "user1",
        userName: "Current User",
        userType: userType,
        subject,
        category,
        priority,
        status: "New",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        messages: [
          {
            id: `m${Math.random().toString(36).substring(7)}`,
            ticketId: `T${Math.floor(1000 + Math.random() * 9000)}`,
            userId: "user1",
            userName: "Current User",
            userType: userType,
            message,
            createdAt: new Date().toISOString(),
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
      
      // Add the new ticket to the state
      setTickets((prevTickets) => [newTicket, ...prevTickets]);
      
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
        
        <Tabs defaultValue="new">
          <TabsList className="mb-6">
            <TabsTrigger value="new">Create New Ticket</TabsTrigger>
            <TabsTrigger value="active">Active Tickets</TabsTrigger>
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
                      (t) => t.status === "New" || t.status === "In Progress"
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
