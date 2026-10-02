import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  CalendarClock,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Eye,
  FileText,
  Flag,
  Hash,
  Headphones,
  Image as ImageIcon,
  Info,
  Lock,
  MoreHorizontal,
  Paperclip,
  Plus,
  RotateCcw,
  SendHorizontal,
  Shield,
  Smile,
  Star,
  StickyNote,
  Tag,
  User,
  UserCheck,
  Users,
  X,
  XCircle,
  Activity,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import {
  DetailActivity,
  DetailAttachment,
  DetailMessage,
  DetailNote,
  DetailStatus,
  SupportTicketDetail,
  getSupportTicket,
  saveSupportTicket,
} from "@/data/supportTickets";

const STAGES: DetailStatus[] = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Waiting for User",
  "Resolved",
  "Closed",
];

const STATUS_STYLE: Record<DetailStatus, { badge: string; dot: string; border: string; text: string }> = {
  Submitted: {
    badge: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    dot: "bg-blue-600",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  "Under Review": {
    badge: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    dot: "bg-blue-600",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  "In Progress": {
    badge: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    dot: "bg-amber-500",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  "Waiting for User": {
    badge: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    dot: "bg-purple-600",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  Resolved: {
    badge: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    dot: "bg-green-600",
    border: "border-green-200",
    text: "text-green-700",
  },
  Closed: {
    badge: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
    dot: "bg-slate-500",
    border: "border-slate-200",
    text: "text-slate-700",
  },
  Escalated: {
    badge: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    dot: "bg-red-600",
    border: "border-red-200",
    text: "text-red-700",
  },
};

const STATUS_DESC: Record<DetailStatus, string> = {
  Submitted: "Your ticket has been received and added to our support queue.",
  "Under Review": "Our support team is reviewing the details of your request.",
  "In Progress": "Our support team is currently working on this issue.",
  "Waiting for User": "Our support team needs additional information from you to continue resolving this issue.",
  Resolved: "Our support team has marked this issue as resolved.",
  Closed: "This ticket has been successfully closed. You can reopen it if needed.",
  Escalated: "This ticket has been escalated to a senior support specialist for priority resolution.",
};

const PRIORITY_STYLE: Record<string, string> = {
  Low: "bg-slate-50 text-slate-700 border-slate-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};

const EMOJI_LIST = ["👍", "👋", "🙏", "😊", "🙂", "🎉", "❓", "💡", "📎", "⚠️"];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const fmtDateTime = (iso: string) => `${fmtDate(iso)}, ${fmtTime(iso)}`;
const fmtSize = (b: number) =>
  b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const StatusBadge = ({ status }: { status: DetailStatus }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Submitted;
  return (
    <Badge variant="outline" className={cn("font-medium transition-colors", s.badge)}>
      {status}
    </Badge>
  );
};

const isActive = (s: DetailStatus) => !["Resolved", "Closed"].includes(s);

const TicketDetailsPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<SupportTicketDetail | undefined>(() => getSupportTicket(ticketId));
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [closeOpen, setCloseOpen] = useState(false);
  const [preview, setPreview] = useState<DetailAttachment | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [infoOpen, setInfoOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(true);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("notes");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<DetailNote["type"]>("update");
  const fileRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = getSupportTicket(ticketId);
    setTicket(loaded);
    setRating(0);
    setFeedback("");
    setFeedbackSent(false);
    setActiveTab("notes");
    window.scrollTo(0, 0);
  }, [ticketId]);

  const attachments = useMemo(
    () => (ticket?.messages.flatMap((m) => m.attachments || []) ?? []),
    [ticket]
  );

  if (!ticket) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center space-y-4">
          <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Ticket not found</h1>
          <p className="text-muted-foreground">We couldn't find ticket "{ticketId}".</p>
          <Button onClick={() => navigate("/support")}>Back to Support Tickets</Button>
        </div>
      </Layout>
    );
  }

  const now = () => new Date().toISOString();

  const updateAndPersist = (updater: (prev: SupportTicketDetail) => SupportTicketDetail) => {
    setTicket((prev) => {
      if (!prev) return prev;
      const updated = updater(prev);
      saveSupportTicket(updated);
      return updated;
    });
  };

  const addActivity = (t: SupportTicketDetail, label: string, kind: DetailActivity["kind"]): SupportTicketDetail => ({
    ...t,
    activity: [
      { id: `a${Date.now()}_${Math.random().toString(36).substring(7)}`, createdAt: now(), label, kind },
      ...t.activity,
    ],
  });

  const toggleAdminChat = () => {
    updateAndPersist((t) => {
      const nextChat = !t.chatEnabled;
      const updated = addActivity(
        { ...t, chatEnabled: nextChat, lastUpdated: now() },
        nextChat ? "Support admin enabled chat" : "Support admin disabled chat",
        "status"
      );
      toast({
        title: nextChat ? "Chat Enabled by Admin" : "Chat Disabled by Admin",
        description: nextChat
          ? "User and support agents can now chat."
          : "Live chat disabled. Official updates will be shared in Notes.",
      });
      return updated;
    });
  };

  const postAdminNote = () => {
    if (!noteContent.trim()) return;
    const newNote: DetailNote = {
      id: `n${Date.now()}`,
      author: ticket?.agent ? `${ticket.agent} (Admin)` : "Support Admin",
      role: "Support Admin",
      createdAt: now(),
      content: noteContent.trim(),
      type: noteType,
    };

    updateAndPersist((t) => {
      const currentNotes = t.notes || [];
      return addActivity(
        {
          ...t,
          notes: [newNote, ...currentNotes],
          lastUpdated: now(),
        },
        "Admin posted an official note",
        "reply"
      );
    });

    setNoteContent("");
    setIsAddingNote(false);
    toast({
      title: "Note Posted",
      description: "Official note published to user.",
    });
  };

  const setStatus = (status: DetailStatus, label: string, kind: DetailActivity["kind"] = "status") => {
    updateAndPersist((t) =>
      addActivity({ ...t, status, lastUpdated: now(), lastStatusChange: now() }, label, kind)
    );
  };

  const canChat = ticket.chatEnabled && ticket.status !== "Closed";
  const isWaitingForUser = ticket.status === "Waiting for User";

  const sendMessage = () => {
    if (!message.trim() && files.length === 0) return;

    const newAttachments: DetailAttachment[] = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
      uploadedAt: now(),
    }));

    const msg: DetailMessage = {
      id: `m${Date.now()}`,
      sender: "user",
      name: "You",
      role: "Customer",
      createdAt: now(),
      message: message.trim(),
      attachments: newAttachments.length ? newAttachments : undefined,
      status: "Sent",
    };

    updateAndPersist((t) => {
      let next: SupportTicketDetail = {
        ...t,
        messages: [...t.messages, msg],
        lastUpdated: now(),
      };
      if (newAttachments.length) {
        next = addActivity(next, `${newAttachments.length} attachment(s) added`, "attachment");
      }
      next = addActivity(next, "You replied to the ticket", "reply");

      if (t.status === "Waiting for User" || t.status === "Resolved") {
        next = addActivity(
          { ...next, status: "In Progress", lastStatusChange: now() },
          "Ticket status changed to In Progress",
          "status"
        );
      }
      return next;
    });

    if (newAttachments.length > 0) {
      toast({
        title: "Attachment Uploaded",
        description: "Attachment uploaded successfully.",
      });
    }
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });

    setMessage("");
    setFiles([]);
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  const closeTicket = () => {
    setStatus("Closed", "Ticket closed by you", "closed");
    setCloseOpen(false);
    toast({
      title: "Ticket Closed",
      description: `Ticket #${ticket.id} has been closed.`,
    });
  };

  const reopenTicket = () => {
    updateAndPersist((t) =>
      addActivity(
        {
          ...t,
          status: "In Progress",
          chatEnabled: true,
          lastUpdated: now(),
          lastStatusChange: now(),
        },
        "Ticket reopened",
        "reopened"
      )
    );
    toast({
      title: "Ticket Reopened",
      description: `Ticket #${ticket.id} has been reopened.`,
    });
  };

  const confirmResolution = () => {
    setStatus("Closed", "Resolution confirmed — ticket closed", "closed");
    toast({
      title: "Status Updated",
      description: "Ticket status updated successfully.",
    });
  };

  const focusComposer = () => {
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };

  const downloadDetails = () => {
    const lines = [
      `Support Ticket #${ticket.id}`,
      `==================================`,
      `Subject: ${ticket.subject}`,
      `Status: ${ticket.status}`,
      `Priority: ${ticket.priority}`,
      `Category: ${ticket.category}${ticket.subcategory ? ` / ${ticket.subcategory}` : ""}`,
      `Created: ${fmtDateTime(ticket.createdAt)}`,
      `Last Updated: ${fmtDateTime(ticket.lastUpdated)}`,
      `Assigned To: ${ticket.assignedTo || "Support Team"}`,
      `Support Agent: ${ticket.agent || "Unassigned"}`,
      "",
      `Issue Description:`,
      ticket.issue.description,
      ...(ticket.issue.referenceNumber ? [`Reference: ${ticket.issue.referenceNumber}`] : []),
      ...(ticket.issue.amount ? [`Amount: ${fmtINR(ticket.issue.amount)}`] : []),
      ...(ticket.resolution ? [`Resolution: ${ticket.resolution}`] : []),
      "",
      `Conversation History:`,
      `----------------------------------`,
      ...ticket.messages.map(
        (m) =>
          `[${fmtDateTime(m.createdAt)}] ${m.name} (${m.role}):\n${m.message || "[Attachment]"}\n`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ticket-${ticket.id}.txt`;
    a.click();
    toast({
      title: "Downloaded",
      description: `Ticket #${ticket.id} details downloaded.`,
    });
  };

  const downloadFile = (f: DetailAttachment) => {
    const a = document.createElement("a");
    a.href = f.url;
    a.download = f.name;
    a.click();
  };

  const currentIdx = STAGES.indexOf(ticket.status);

  const infoRows = [
    { icon: Hash, label: "Ticket ID", value: `#${ticket.id}`, copyable: true, raw: ticket.id },
    { icon: Activity, label: "Status", value: <StatusBadge status={ticket.status} /> },
    {
      icon: Flag,
      label: "Priority",
      value: (
        <Badge variant="outline" className={cn("font-medium", PRIORITY_STYLE[ticket.priority])}>
          {ticket.priority}
        </Badge>
      ),
    },
    { icon: Tag, label: "Category", value: ticket.category },
    { icon: Tag, label: "Subcategory", value: ticket.subcategory },
    { icon: CalendarClock, label: "Created", value: fmtDateTime(ticket.createdAt) },
    { icon: Clock, label: "Last Updated", value: fmtDateTime(ticket.lastUpdated) },
    { icon: Users, label: "Assigned To", value: ticket.assignedTo },
    { icon: UserCheck, label: "Support Agent", value: ticket.agent },
    { icon: Headphones, label: "Expected Response", value: ticket.expectedResponse },
  ].filter((r) => r.value);

  const activityIcon = (k: DetailActivity["kind"]) => {
    switch (k) {
      case "created":
        return Plus;
      case "assigned":
        return UserPlus;
      case "reply":
        return MessageSquare;
      case "status":
        return Activity;
      case "closed":
        return XCircle;
      case "reopened":
        return RotateCcw;
      case "attachment":
        return Paperclip;
      default:
        return Activity;
    }
  };

  const handleRatingSubmit = () => {
    setFeedbackSent(true);
    toast({
      title: "Feedback submitted",
      description: "Thank you for rating your support experience.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-28 lg:pb-12 space-y-5 sm:space-y-6 overflow-x-hidden">
        {/* ========================================================= */}
        {/* Section 1: Page Header */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            onClick={() => navigate("/support")}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Support Tickets
          </Button>

          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/support" className="hover:text-foreground transition-colors">
              Support
            </Link>
            <span className="mx-2 text-muted-foreground/60">/</span>
            <Link to="/support?tab=active" className="hover:text-foreground transition-colors">
              My Tickets
            </Link>
            <span className="mx-2 text-muted-foreground/60">/</span>
            <span className="text-foreground font-medium">{ticket.id}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pt-1">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground break-words">
                {ticket.subject}
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2">
                <span>Ticket #{ticket.id}</span>
                <span>•</span>
                <span>Created on {fmtDate(ticket.createdAt)}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <StatusBadge status={ticket.status} />
              <Badge variant="outline" className={cn("font-medium", PRIORITY_STYLE[ticket.priority])}>
                {ticket.priority} priority
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Ticket actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => window.location.reload()}>
                    <Eye className="h-4 w-4 mr-2" /> View Ticket
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadDetails}>
                    <Download className="h-4 w-4 mr-2" /> Download Ticket Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {ticket.status !== "Closed" ? (
                    <DropdownMenuItem
                      onClick={() => setCloseOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Close Ticket
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={reopenTicket}>
                      <RotateCcw className="h-4 w-4 mr-2" /> Reopen Ticket
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Section 2: Ticket Status Progress Card (Compact Redesign) */}
        {/* ========================================================= */}
        <Card className="shadow-xs border-border/80 bg-card overflow-hidden">
          <CardContent className="p-3.5 sm:p-4 space-y-3">
            {/* Top Compact Status Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-xs sm:text-sm">Lifecycle Progress:</span>
                <StatusBadge status={ticket.status} />
                <span className="text-muted-foreground hidden md:inline truncate max-w-lg">
                  • {STATUS_DESC[ticket.status] || "Your ticket is being handled by support."}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground shrink-0 text-[11px] sm:text-xs">
                <span className="font-medium text-foreground/80">Stage {currentIdx + 1} of {STAGES.length}</span>
                <span>•</span>
                <span>Updated {fmtTime(ticket.lastUpdated)}</span>
              </div>
            </div>

            {/* Stepper Timeline (Compact 24px circles & low height) */}
            <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
              <ol className="flex items-center justify-between min-w-[560px] relative px-3">
                {STAGES.map((stage, i) => {
                  const isDone = i < currentIdx || (ticket.status === "Closed" && i <= currentIdx);
                  const isCurrent = i === currentIdx && ticket.status !== "Closed";
                  const stageStyle = STATUS_STYLE[stage] || STATUS_STYLE.Submitted;

                  return (
                    <li
                      key={stage}
                      className="flex-1 flex flex-col items-center relative text-center group"
                    >
                      {/* Connecting Line to next item */}
                      {i < STAGES.length - 1 && (
                        <div
                          className={cn(
                            "absolute top-3 left-1/2 w-full h-[2px] -z-0 transition-colors",
                            i < currentIdx ? "bg-primary" : "bg-border/80"
                          )}
                        />
                      )}

                      {/* Step Circle Indicator (24px) */}
                      <div
                        className={cn(
                          "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold bg-background transition-all",
                          isDone && "bg-primary border-primary text-primary-foreground shadow-2xs",
                          isCurrent && cn("bg-background border-2 shadow-2xs ring-3 ring-offset-1 ring-amber-500/25", stageStyle.text, stageStyle.border),
                          !isDone && !isCurrent && "border-muted-foreground/30 text-muted-foreground/50 bg-muted/20"
                        )}
                      >
                        {isDone ? (
                          <Check className="h-3 w-3 stroke-[2.5]" />
                        ) : isCurrent ? (
                          <span className={cn("h-2 w-2 rounded-full animate-pulse", stageStyle.dot)} />
                        ) : (
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        )}
                      </div>

                      {/* Stage Label */}
                      <span
                        className={cn(
                          "mt-1.5 text-[11px] transition-colors whitespace-nowrap",
                          isDone && "font-medium text-foreground",
                          isCurrent && cn("font-bold", stageStyle.text),
                          !isDone && !isCurrent && "text-muted-foreground/80"
                        )}
                      >
                        {stage}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Mobile description line */}
            <p className="text-[11px] text-muted-foreground md:hidden pt-0.5 border-t border-border/50">
              {STATUS_DESC[ticket.status]}
            </p>
          </CardContent>
        </Card>

        {/* ========================================================= */}
        {/* Section 14: Waiting for User State Banner */}
        {/* ========================================================= */}
        {isWaitingForUser && (
          <div className="rounded-xl border border-purple-200 bg-purple-50/80 dark:bg-purple-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex gap-3.5">
              <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 text-purple-700">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-purple-950 dark:text-purple-200 text-base">Action Required</p>
                <p className="text-sm text-purple-800 dark:text-purple-300 mt-0.5">
                  Our support team needs additional information from you to continue resolving this issue.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-purple-700 hover:bg-purple-800 text-white shrink-0 self-start sm:self-center"
              onClick={focusComposer}
            >
              Respond now
            </Button>
          </div>
        )}

        {/* ========================================================= */}
        {/* Section 3: Main Page Layout (Two Columns) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================= */}
          {/* LEFT COLUMN: Conversation, Attachments & Activity (68%) */}
          {/* ======================================================= */}
          <div className="lg:col-span-8 space-y-6 min-w-0">
            {/* Section 13: Resolved Banner */}
            {ticket.status === "Resolved" && (
              <Card className="border-green-200 bg-green-50/40 dark:bg-green-950/15 shadow-xs">
                <CardContent className="p-5 space-y-4">
                  <div className="flex gap-3.5">
                    <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-base">Issue Resolved</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Our support team has marked this issue as resolved.
                      </p>
                    </div>
                  </div>

                  {ticket.resolution && (
                    <div className="rounded-lg bg-green-50/90 dark:bg-green-950/40 border border-green-200/80 p-3.5 space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-green-800 dark:text-green-300">
                        Resolution Summary
                      </p>
                      <p className="text-sm text-green-900 dark:text-green-100">{ticket.resolution}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <Button
                      onClick={confirmResolution}
                      className="bg-green-600 hover:bg-green-700 text-white shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Resolution
                    </Button>
                    <Button variant="outline" onClick={reopenTicket}>
                      <RotateCcw className="h-4 w-4 mr-2" /> Reopen Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Closed Banner */}
            {ticket.status === "Closed" && (
              <Card className="border-slate-200 bg-slate-50/50 dark:bg-slate-900/20 shadow-xs">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-3.5">
                    <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-base">Ticket Closed</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        This ticket has been successfully closed. If you experience the same issue again, you can
                        reopen this ticket or create a new support request.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button variant="outline" onClick={reopenTicket}>
                      <RotateCcw className="h-4 w-4 mr-2" /> Reopen Ticket
                    </Button>
                    <Button onClick={() => navigate("/support?tab=new")}>
                      <Plus className="h-4 w-4 mr-2" /> Create New Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ===================================================== */}
            {/* Section 8: Issue Details Card */}
            {/* ===================================================== */}
            <Card className="shadow-xs border-border/80 bg-card overflow-hidden">
              <CardHeader className="py-3.5 px-6 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm sm:text-base font-semibold text-foreground">Issue Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-6">
                {ticket.issue.description && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap rounded-lg bg-muted/20 p-3.5 border border-border/60">
                      {ticket.issue.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ===================================================== */}
            {/* Section 4: Ticket Conversation & Notes Tabs Card */}
            {/* ===================================================== */}
            <Card className="shadow-xs border-border/80 overflow-hidden bg-card">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="py-3 px-4 sm:px-6 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Tabs List */}
                  <TabsList className="bg-background/80 border p-1 rounded-xl h-10 w-full sm:w-auto grid grid-cols-2 shadow-2xs">
                    <TabsTrigger
                      value="notes"
                      className="rounded-lg text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      <StickyNote className="h-3.5 w-3.5" />
                      <span>Notes</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center rounded-full font-semibold",
                          activeTab === "notes"
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {(ticket.notes || []).length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="chats"
                      className="rounded-lg text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chats</span>
                      {ticket.chatEnabled ? (
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full bg-green-500 shrink-0",
                            activeTab === "chats" ? "ring-1 ring-white/60" : ""
                          )}
                          title="Chat Enabled"
                        />
                      ) : (
                        <Ban
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            activeTab === "chats" ? "text-rose-200" : "text-rose-500"
                          )}
                          title="Chat Disabled"
                        />
                      )}
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center rounded-full font-semibold",
                          activeTab === "chats"
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {ticket.messages.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  {/* Header Status & Admin Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
                    {activeTab === "chats" ? (
                      <>
                        {ticket.chatEnabled ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40 border border-green-200/80 py-1 px-2.5 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-medium">Chat Enabled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 py-1 px-2.5 rounded-full">
                            <Lock className="h-3 w-3" />
                            <span className="font-medium">Chat Disabled by Admin</span>
                          </span>
                        )}

                        {/* Admin Mode Toggle Switch / Button for testing */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleAdminChat}
                          className="h-8 text-xs text-muted-foreground hover:text-foreground border border-dashed hover:border-solid hover:bg-muted/50 px-2.5 gap-1.5"
                          title="Toggle admin chat enablement"
                        >
                          <Shield className="h-3.5 w-3.5 text-primary" />
                          <span>Admin: {ticket.chatEnabled ? "Disable Chat" : "Enable Chat"}</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingNote((v) => !v)}
                        className="h-8 text-xs gap-1.5 border-dashed hover:border-solid"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{isAddingNote ? "Cancel" : "Add Note"}</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>

                {/* =================================================== */}
                {/* TAB 1: CHATS */}
                {/* =================================================== */}
                <TabsContent value="chats" className="mt-0 focus-visible:outline-none">

              {/* Message List */}
              <CardContent className="p-4 sm:p-6 space-y-6 bg-muted/5">
                {ticket.messages.map((m) => {
                  const isUser = m.sender === "user";

                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-3 sm:gap-3.5",
                        isUser ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold shadow-2xs",
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-indigo-600 text-white"
                        )}
                      >
                        {isUser ? "You" : <Headphones className="h-4 w-4" />}
                      </div>

                      {/* Content block */}
                      <div
                        className={cn(
                          "flex flex-col max-w-[85%] sm:max-w-[78%]",
                          isUser ? "items-end text-right" : "items-start text-left"
                        )}
                      >
                        {/* Header metadata */}
                        <div
                          className={cn(
                            "flex items-center gap-2 text-xs mb-1.5",
                            isUser ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <span className="font-semibold text-foreground">{m.name}</span>
                          {!isUser && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] py-0 px-1.5 font-medium bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300"
                            >
                              Support Agent
                            </Badge>
                          )}
                          <span className="text-muted-foreground text-[11px]">
                            {fmtDate(m.createdAt)} • {fmtTime(m.createdAt)}
                          </span>
                        </div>

                        {/* Speech Bubble / Card */}
                        {m.message && (
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-2xs inline-block text-left",
                              isUser
                                ? "bg-primary/10 border border-primary/20 text-foreground rounded-tr-xs"
                                : "bg-card border border-border/80 text-foreground rounded-tl-xs"
                            )}
                          >
                            {m.message}
                          </div>
                        )}

                        {/* Attached Files inside Message */}
                        {m.attachments && m.attachments.length > 0 && (
                          <div
                            className={cn(
                              "flex flex-wrap gap-2 mt-2",
                              isUser ? "justify-end" : "justify-start"
                            )}
                          >
                            {m.attachments.map((f, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-xs shadow-2xs hover:border-primary/40 transition-colors"
                              >
                                {f.type?.startsWith("image") ? (
                                  <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                                ) : (
                                  <FileText className="h-4 w-4 text-primary shrink-0" />
                                )}
                                <span className="max-w-[150px] truncate font-medium text-foreground">
                                  {f.name}
                                </span>
                                <span className="text-muted-foreground text-[11px]">
                                  {fmtSize(f.size)}
                                </span>
                                <div className="flex items-center gap-1 border-l pl-2 ml-1">
                                  <button
                                    type="button"
                                    aria-label={`Preview ${f.name}`}
                                    onClick={() => setPreview(f)}
                                    className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={`Download ${f.name}`}
                                    onClick={() => downloadFile(f)}
                                    className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* User delivery receipt */}
                        {isUser && m.status && (
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                            <CheckCheck className="h-3.5 w-3.5 text-primary/70" />
                            <span>{m.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </CardContent>

              {/* =================================================== */}
              {/* Section 5: Chat Composer */}
              {/* =================================================== */}
              {canChat ? (
                <div
                  className={cn(
                    "border-t bg-card p-4 transition-all",
                    "fixed lg:static bottom-0 left-0 right-0 z-30 lg:z-auto shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:shadow-none",
                    isWaitingForUser && "ring-2 ring-purple-300 lg:ring-purple-300/80"
                  )}
                >
                  {/* Status header above composer */}
                  <div className="flex items-center justify-end pb-2 text-xs text-muted-foreground">
                    <span className="hidden sm:inline text-muted-foreground/70">
                      Press <kbd className="px-1.5 py-0.5 text-[10px] bg-muted border rounded">Enter ↵</kbd> to send
                    </span>
                  </div>

                  {/* Attachment chips preview drawer */}
                  {files.length > 0 && (
                    <div className="mb-2.5 flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-muted/40 rounded-lg border">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-md bg-background px-2.5 py-1 text-xs border shadow-2xs"
                        >
                          {f.type.startsWith("image") ? (
                            <ImageIcon className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <FileText className="h-3.5 w-3.5 text-primary" />
                          )}
                          <span className="max-w-[140px] truncate font-medium">{f.name}</span>
                          <span className="text-muted-foreground">{fmtSize(f.size)}</span>
                          <button
                            type="button"
                            aria-label="Remove"
                            onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                            className="text-muted-foreground hover:text-destructive p-0.5 ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input controls row */}
                  <div className="flex items-end gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setFiles((p) => [...p, ...Array.from(e.target.files!)]);
                        }
                        e.target.value = "";
                      }}
                    />

                    {/* Attachment button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label="Attach files"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    {/* Emoji picker popover */}
                    <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
                          aria-label="Add emoji"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2" align="start" side="top">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5 px-1">Quick Emojis</p>
                        <div className="grid grid-cols-5 gap-1 text-center">
                          {EMOJI_LIST.map((emo) => (
                            <button
                              key={emo}
                              type="button"
                              className="h-8 w-8 text-base rounded hover:bg-muted transition-colors flex items-center justify-center"
                              onClick={() => {
                                setMessage((m) => m + emo);
                                setEmojiOpen(false);
                                composerRef.current?.focus();
                              }}
                            >
                              {emo}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Textarea */}
                    <Textarea
                      ref={composerRef}
                      rows={1}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type your message to the support team..."
                      className="min-h-[42px] max-h-36 resize-none py-2.5 px-3 text-sm focus-visible:ring-primary rounded-xl"
                    />

                    {/* Send button */}
                    <Button
                      type="button"
                      onClick={sendMessage}
                      disabled={!message.trim() && files.length === 0}
                      className="h-10 px-4 shrink-0 shadow-xs"
                      aria-label="Send message"
                    >
                      <SendHorizontal className="h-4 w-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </div>
                </div>
                  ) : !ticket.chatEnabled ? (
                    /* Chat Disabled by Admin State */
                    <div className="border-t p-4 sm:p-5 bg-muted/20">
                      <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 dark:bg-amber-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-3.5 items-start">
                          <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300">
                            <Lock className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-sm text-foreground">Live Chat is Disabled by Support Admin</p>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              Real-time messaging is temporarily disabled for this ticket by the administrator. Please refer to the <strong>Notes</strong> tab for official updates, instructions, and progress notes.
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("notes")}
                          className="shrink-0 self-start sm:self-center bg-background border-amber-300 text-amber-900 hover:bg-amber-100/50 dark:text-amber-200"
                        >
                          <StickyNote className="h-3.5 w-3.5 mr-1.5" /> View Admin Notes
                        </Button>
                      </div>
                    </div>
                  ) : ticket.status === "Closed" ? (
                    <div className="border-t p-4 text-center text-xs text-muted-foreground bg-muted/10">
                      This ticket has been closed. Real-time replies are disabled.
                    </div>
                  ) : null}
                </TabsContent>

                {/* =================================================== */}
                {/* TAB 2: NOTES */}
                {/* =================================================== */}
                <TabsContent value="notes" className="mt-0 focus-visible:outline-none">
                  <div className="p-4 sm:p-6 space-y-5 bg-card">
                    {/* Expandable Form to Post a Note */}
                    {isAddingNote && (
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <StickyNote className="h-3.5 w-3.5 text-primary" /> Note
                          </span>
                        </div>

                        <Textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Write official note or instructions for the user..."
                          rows={3}
                          className="text-xs sm:text-sm bg-background resize-none rounded-lg"
                        />

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAddingNote(false)}
                            className="h-8 text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            disabled={!noteContent.trim()}
                            onClick={postAdminNote}
                            className="h-8 text-xs shadow-xs"
                          >
                            Send note
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Notes List */}
                    {(!ticket.notes || ticket.notes.length === 0) ? (
                      <div className="py-12 text-center space-y-2 border rounded-xl bg-muted/10 p-6">
                        <StickyNote className="h-8 w-8 mx-auto text-muted-foreground/60" />
                        <p className="text-sm font-semibold text-foreground">No Admin Notes Yet</p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          When support administrators or engineers review this ticket, official updates and instructions will be posted here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {ticket.notes.map((note) => {
                          const isAction = note.type === "action_required";
                          const isResolution = note.type === "resolution";
                          const isUpdate = note.type === "update";

                          return (
                            <div
                              key={note.id}
                              className={cn(
                                "rounded-xl border p-4 sm:p-5 space-y-3 transition-all shadow-2xs",
                                isAction && "border-amber-200 bg-amber-50/40 dark:bg-amber-950/15",
                                isResolution && "border-green-200 bg-green-50/40 dark:bg-green-950/15",
                                isUpdate && "border-blue-200 bg-blue-50/30 dark:bg-blue-950/15",
                                !isAction && !isResolution && !isUpdate && "border-border bg-card"
                              )}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/50 pb-2.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <Shield className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs sm:text-sm font-semibold text-foreground">{note.author}</span>
                                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-medium bg-muted">
                                        {note.role}
                                      </Badge>
                                      {isAction && (
                                        <Badge className="bg-amber-600 text-white text-[10px] py-0 px-1.5">
                                          Action Required
                                        </Badge>
                                      )}
                                      {isResolution && (
                                        <Badge className="bg-green-600 text-white text-[10px] py-0 px-1.5">
                                          Resolution Note
                                        </Badge>
                                      )}
                                      {isUpdate && (
                                        <Badge className="bg-blue-600 text-white text-[10px] py-0 px-1.5">
                                          Official Update
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[11px] text-muted-foreground shrink-0">
                                  {fmtDateTime(note.createdAt)}
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                {note.content}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* ===================================================== */}
            {/* Section 15: Feedback Section (After Resolved / Closed) */}
            {/* ===================================================== */}
            {!isActive(ticket.status) && (
              <Card className="shadow-xs border-border/80 bg-card">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                    <CardTitle className="text-base font-semibold text-foreground">
                      How was your support experience?
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Help us improve our service by rating your support interaction
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  {feedbackSent ? (
                    <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 p-4 flex items-center gap-3 text-green-800 dark:text-green-200">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      <p className="text-sm font-medium">Thanks for your feedback! We appreciate your input.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                              onClick={() => setRating(n)}
                              className="p-1 rounded-sm hover:scale-110 transition-transform focus:outline-hidden"
                            >
                              <Star
                                className={cn(
                                  "h-7 w-7 transition-colors",
                                  n <= rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30 hover:text-amber-300"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground max-w-[210px] px-1 font-medium">
                          <span>Very Dissatisfied</span>
                          <span>Very Satisfied</span>
                        </div>
                      </div>

                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tell us more about your experience..."
                        rows={3}
                        className="text-sm resize-none rounded-xl"
                      />

                      <Button
                        type="button"
                        disabled={!rating}
                        onClick={handleRatingSubmit}
                        className="w-full sm:w-auto"
                      >
                        Submit Feedback
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: Sidebar (32%) */}
          {/* ======================================================= */}
          <aside className="lg:col-span-4 space-y-6 min-w-0">
            {/* Section 7: Ticket Information Card */}
            <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
              <Card className="shadow-xs border-border/80 bg-card overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 cursor-pointer hover:bg-muted/30 transition-colors select-none border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm sm:text-base font-semibold text-foreground">
                        Ticket Information
                      </CardTitle>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        infoOpen && "rotate-180"
                      )}
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-1 pb-3 px-5 divide-y divide-border/60">
                    {infoRows.map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center justify-between gap-3 py-2.5 text-sm"
                      >
                        <span className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                          <r.icon className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                          {r.label}
                        </span>
                        <div className="font-medium text-right text-xs sm:text-sm flex items-center gap-1.5 text-foreground">
                          {r.value}
                          {r.copyable && (
                            <button
                              type="button"
                              aria-label={`Copy ${r.label}`}
                              onClick={() => copyToClipboard(r.raw || String(r.value), r.label)}
                              className="text-muted-foreground hover:text-foreground p-0.5 ml-0.5 rounded hover:bg-muted"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* ===================================================== */}
            {/* Section 9: Attachments Card */}
            {/* ===================================================== */}
            <Card className="shadow-xs border-border/80 bg-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm sm:text-base font-semibold text-foreground">
                    Attachments ({attachments.length})
                  </CardTitle>
                </div>
                {canChat && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2 gap-1"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4">
                {attachments.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3 text-center">
                    No attachments uploaded yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                    {attachments.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5 shadow-2xs hover:border-primary/40 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center shrink-0 border">
                          {f.type?.startsWith("image") ? (
                            <ImageIcon className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground truncate">{f.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {fmtSize(f.size)} • {fmtDate(f.uploadedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            aria-label={`Preview ${f.name}`}
                            onClick={() => setPreview(f)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            aria-label={`Download ${f.name}`}
                            onClick={() => downloadFile(f)}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ===================================================== */}
            {/* Section 10: Ticket Activity Timeline Card */}
            {/* ===================================================== */}
            <Collapsible open={activityOpen} onOpenChange={setActivityOpen}>
              <Card className="shadow-xs border-border/80 bg-card overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 cursor-pointer hover:bg-muted/30 transition-colors select-none border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm sm:text-base font-semibold text-foreground">
                        Ticket Activity Timeline
                      </CardTitle>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        activityOpen && "rotate-180"
                      )}
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-4 pb-4 px-5">
                    <ol className="relative border-l border-border/80 ml-3 space-y-3.5">
                      {ticket.activity.map((a) => {
                        const Icon = activityIcon(a.kind);
                        return (
                          <li key={a.id} className="ml-4 relative">
                            <span className="absolute -left-[23px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-2xs">
                              <Icon className="h-2.5 w-2.5" />
                            </span>
                            <p className="text-[10px] text-muted-foreground">
                              {fmtDate(a.createdAt)} • {fmtTime(a.createdAt)}
                            </p>
                            <p className="text-xs font-semibold text-foreground mt-0.5 leading-snug">{a.label}</p>
                          </li>
                        );
                      })}
                    </ol>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </aside>
        </div>

      </div>

      {/* ========================================================= */}
      {/* Section 12: Close Ticket Confirmation Modal */}
      {/* ========================================================= */}
      <AlertDialog open={closeOpen} onOpenChange={setCloseOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">Close this ticket?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to close this support ticket? You can reopen it later if the issue has not
              been fully resolved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={closeTicket}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg"
            >
              Close Ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ========================================================= */}
      {/* Preview Dialog Modal */}
      {/* ========================================================= */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-6 text-base font-semibold">
              {preview?.name}
            </DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="space-y-4">
              {preview.type?.startsWith("image") ? (
                <div className="rounded-xl border bg-muted/30 p-2 flex items-center justify-center">
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="max-h-[60vh] max-w-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-xl border bg-muted/20 text-muted-foreground">
                  <FileText className="h-16 w-16 text-primary/70" />
                  <p className="text-sm font-medium">{preview.name}</p>
                  <p className="text-xs">{fmtSize(preview.size)} • Preview not available for this document format</p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreview(null)} className="rounded-lg">
                  Close
                </Button>
                <Button onClick={() => downloadFile(preview)} className="rounded-lg">
                  <Download className="h-4 w-4 mr-2" /> Download File
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TicketDetailsPage;

