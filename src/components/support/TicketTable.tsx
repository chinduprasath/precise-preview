import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ticket, TicketStatus, TicketPriority } from "@/types/ticket";
import { Eye, MoreHorizontal, Search } from "lucide-react";

interface TicketTableProps {
  tickets: Ticket[];
  isAdmin?: boolean;
  onViewTicket: (ticketId: string) => void;
  teamMembers?: { id: string; name: string }[];
  onStatusChange?: (ticketId: string, status: TicketStatus) => void;
  onAssigneeChange?: (ticketId: string, assigneeId: string) => void;
  onPriorityChange?: (ticketId: string, priority: TicketPriority) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  isAdmin = false,
  onViewTicket,
  teamMembers = [],
  onStatusChange,
  onAssigneeChange,
  onPriorityChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadgeColor = (status: TicketStatus) => {
    switch (status) {
      case "New":
      case "Submitted":
      case "Under Review":
        return "bg-blue-600 text-white hover:bg-blue-700";
      case "In Progress":
        return "bg-amber-600 text-white hover:bg-amber-700";
      case "Waiting for User":
        return "bg-purple-600 text-white hover:bg-purple-700";
      case "Resolved":
        return "bg-green-600 text-white hover:bg-green-700";
      case "Closed":
        return "bg-slate-500 text-white hover:bg-slate-600";
      case "Escalated":
        return "bg-red-600 text-white hover:bg-red-700";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  const getPriorityBadgeColor = (priority: TicketPriority) => {
    switch (priority) {
      case "Low": return "bg-blue-500 text-white";
      case "Medium": return "bg-amber-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Critical": return "bg-red-600 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by ID, subject, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Waiting for User">Waiting for User</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Created</TableHead>
              {isAdmin && <TableHead>User</TableHead>}
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead>Priority</TableHead>}
              {isAdmin && <TableHead>Assigned To</TableHead>}
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 9 : 6} className="text-center py-8">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className={!isAdmin ? "cursor-pointer hover:bg-muted/60 transition-colors" : undefined}
                  onClick={!isAdmin ? () => onViewTicket(ticket.id) : undefined}
                >
                  <TableCell className="font-semibold text-primary hover:underline">
                    {ticket.id}
                  </TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      {ticket.userName}{" "}
                      <Badge variant="outline">{ticket.userType}</Badge>
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>
                    {isAdmin && onStatusChange ? (
                      <Select
                        defaultValue={ticket.status}
                        onValueChange={(value) => onStatusChange(ticket.id, value as TicketStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getStatusBadgeColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      {onPriorityChange ? (
                        <Select
                          defaultValue={ticket.priority}
                          onValueChange={(value) => onPriorityChange(ticket.id, value as TicketPriority)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getPriorityBadgeColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  {isAdmin && (
                    <TableCell>
                      {onAssigneeChange ? (
                        <Select
                          defaultValue={ticket.assignedTo || "unassigned"}
                          onValueChange={(value) => onAssigneeChange(ticket.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Unassigned" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        ticket.assignedTo || "Unassigned"
                      )}
                    </TableCell>
                  )}
                  <TableCell>{new Date(ticket.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewTicket(ticket.id)}>
                          <Eye className="mr-2 h-4 w-4" /> View Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TicketTable;
