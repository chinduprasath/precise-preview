
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import { Ticket, TicketMessage, TicketStatus } from "@/types/ticket";
import { Separator } from "@/components/ui/separator";

interface TicketDetailProps {
  ticket: Ticket | null;
  isAdmin: boolean;
  onClose: () => void;
  onReply: (ticketId: string, message: string, isInternal: boolean, attachments: File[]) => void;
  onStatusChange?: (ticketId: string, status: TicketStatus) => void;
  onAssigneeChange?: (ticketId: string, assigneeId: string) => void;
  teamMembers?: { id: string; name: string }[];
}

const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  isAdmin,
  onClose,
  onReply,
  onStatusChange,
  onAssigneeChange,
  teamMembers = [],
}) => {
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!ticket) return null;
  
  const handleReply = () => {
    if (!message.trim()) return;
    onReply(ticket.id, message, isInternal, selectedFiles);
    setMessage("");
    setSelectedFiles([]);
    setIsInternal(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  
  const getStatusBadgeColor = (status: TicketStatus) => {
    switch (status) {
      case "New": return "bg-blue-500";
      case "In Progress": return "bg-yellow-500";
      case "Resolved": return "bg-green-500";
      case "Closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };
  
  const getMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <Dialog open={!!ticket} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>Ticket: {ticket.subject}</span>
            <Badge className={getStatusBadgeColor(ticket.status)}>{ticket.status}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-4 py-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Created by</p>
            <p>{ticket.userName} ({ticket.userType})</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Date</p>
            <p>{new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Category</p>
            <p>{ticket.category}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Priority</p>
            <p>{ticket.priority}</p>
          </div>
          {isAdmin && (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                {onStatusChange ? (
                  <Select
                    defaultValue={ticket.status}
                    onValueChange={(value) => onStatusChange(ticket.id, value as TicketStatus)}
                  >
                    <SelectTrigger className="w-32 h-8">
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
                  <p>{ticket.status}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Assigned To</p>
                {onAssigneeChange ? (
                  <Select
                    defaultValue={ticket.assignedTo || ""}
                    onValueChange={(value) => onAssigneeChange(ticket.id, value)}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{ticket.assignedTo || "Unassigned"}</p>
                )}
              </div>
            </>
          )}
        </div>
        
        <Separator />
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {ticket.messages.map((msg) => (
            <Card
              key={msg.id}
              className={`${
                msg.isInternal ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
              } ${
                msg.userType === "admin" ? "border-l-4 border-l-blue-500" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{msg.userName}</span>
                    <Badge variant="outline">{msg.userType}</Badge>
                    {msg.isInternal && (
                      <Badge className="bg-yellow-500">Internal Note</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getMessageDate(msg.createdAt)}
                  </span>
                </div>
                <div className="mt-2 whitespace-pre-wrap">{msg.message}</div>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.attachments.map((file, index) => (
                        <a
                          key={index}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 p-1 border rounded hover:bg-muted"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span className="text-xs">{file.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {ticket.status !== "Closed" && (
          <>
            <Separator />
            
            <div className="pt-4">
              <Textarea
                placeholder="Type your reply..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
              
              {selectedFiles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 p-1 bg-muted rounded"
                    >
                      <span className="text-xs">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach Files
                  </Button>
                  
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsInternal(!isInternal)}
                      className={isInternal ? "bg-yellow-100 border-yellow-300" : ""}
                    >
                      {isInternal ? "Public Reply" : "Internal Note"}
                    </Button>
                  )}
                </div>
                
                <Button onClick={handleReply} disabled={!message.trim()}>
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetail;
