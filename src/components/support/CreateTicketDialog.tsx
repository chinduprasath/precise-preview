
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paperclip, Plus, X } from "lucide-react";
import { TicketCategory, TicketPriority, UserType } from "@/types/ticket";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    userId: string,
    userName: string,
    userType: UserType,
    subject: string,
    category: TicketCategory,
    priority: TicketPriority,
    message: string,
    attachments: File[]
  ) => Promise<void>;
  users: { id: string; name: string; type: UserType }[];
}

const CreateTicketDialog: React.FC<CreateTicketDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  users,
}) => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Technical");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedUser || !subject.trim() || !message.trim()) return;

    const user = users.find((u) => u.id === selectedUser);
    if (!user) return;

    setIsSubmitting(true);
    try {
      await onSubmit(
        user.id,
        user.name,
        user.type,
        subject,
        category,
        priority,
        message,
        selectedFiles
      );
      
      // Reset form
      setSubject("");
      setCategory("Technical");
      setPriority("Medium");
      setMessage("");
      setSelectedFiles([]);
      setSelectedUser("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select
              value={selectedUser}
              onValueChange={setSelectedUser}
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Enter ticket subject"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as TicketCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Collaboration">Collaboration</SelectItem>
                  <SelectItem value="Account Issue">Account Issue</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as TicketPriority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter ticket details"
              className="min-h-[150px]"
            />
          </div>
          
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </Button>
            
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
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedUser || !subject.trim() || !message.trim()}
          >
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
