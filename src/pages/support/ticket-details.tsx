import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileText,
  Flag,
  Hash,
  Headphones,
  Image as ImageIcon,
  Lock,
  MoreHorizontal,
  Paperclip,
  Plus,
  Printer,
  RotateCcw,
  SendHorizontal,
  Smile,
  Star,
  Tag,
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
  DetailStatus,
  SupportTicketDetail,
  getSupportTicket,
} from "@/data/supportTickets";

const STAGES: DetailStatus[] = ["Submitted", "Under Review", "In Progress", "Waiting for User", "Resolved", "Closed"];

const STATUS_STYLE: Record<DetailStatus, string> = {
  Submitted: "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  "Waiting for User": "bg-purple-50 text-purple-700 border-purple-200",
  Resolved: "bg-green-50 text-green-700 border-green-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-200",
  Escalated: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_DESC: Record<DetailStatus, string> = {
  Submitted: "Your ticket has been received and is in the queue.",
  "Under Review": "Our team is reviewing the details of your request.",
  "In Progress": "Our support team is currently working on this issue.",
  "Waiting for User": "We need more information from you to continue.",
  Resolved: "Our support team has marked this issue as resolved.",
  Closed: "This ticket is closed. You can reopen it if needed.",
  Escalated: "This ticket has been escalated to a senior specialist.",
};

const PRIORITY_STYLE: Record<string, string> = {
  Low: "bg-slate-50 text-slate-700 border-slate-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const fmtDateTime = (iso: string) => `${fmtDate(iso)}, ${fmtTime(iso)}`;
const fmtSize = (b: number) =>
  b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const StatusBadge = ({ status }: { status: DetailStatus }) => (
  <Badge variant="outline" className={cn("font-medium", STATUS_STYLE[status])}>{status}</Badge>
);

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
  const fileRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTicket(getSupportTicket(ticketId));
    setRating(0);
    setFeedback("");
    setFeedbackSent(false);
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
  const addActivity = (t: SupportTicketDetail, label: string, kind: DetailActivity["kind"]) => ({
    ...t,
    activity: [{ id: `a${Date.now()}${Math.random()}`, createdAt: now(), label, kind }, ...t.activity],
  });

  const setStatus = (status: DetailStatus, label: string, kind: DetailActivity["kind"] = "status") => {
    setTicket((t) =>
      t ? addActivity({ ...t, status, lastUpdated: now(), lastStatusChange: now() }, label, kind) : t
    );
  };

  const canChat = ticket.chatEnabled && ticket.status !== "Closed";
  const waiting = ticket.status === "Waiting for User";

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
    setTicket((t) => {
      if (!t) return t;
      let next: SupportTicketDetail = { ...t, messages: [...t.messages, msg], lastUpdated: now() };
      if (newAttachments.length) next = addActivity(next, `${newAttachments.length} attachment(s) added`, "attachment");
      next = addActivity(next, "You replied to the ticket", "reply");
      if (t.status === "Waiting for User" || t.status === "Resolved") {
        next = addActivity({ ...next, status: "In Progress", lastStatusChange: now() }, "Ticket status changed to In Progress", "status");
      }
      return next;
    });
    if (newAttachments.length)
      toast({ title: "Attachment Uploaded", description: "Attachment uploaded successfully." });
    toast({ title: "Message Sent", description: "Your message has been sent successfully." });
    setMessage("");
    setFiles([]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
  };

  const closeTicket = () => {
    setStatus("Closed", "Ticket closed by you", "closed");
    setCloseOpen(false);
    toast({ title: "Ticket Closed", description: `Ticket #${ticket.id} has been closed.` });
  };
  const reopenTicket = () => {
    setTicket((t) =>
      t ? addActivity({ ...t, status: "In Progress", chatEnabled: true, lastUpdated: now(), lastStatusChange: now() }, "Ticket reopened", "reopened") : t
    );
    toast({ title: "Ticket Reopened", description: `Ticket #${ticket.id} has been reopened.` });
  };
  const confirmResolution = () => {
    setStatus("Closed", "Resolution confirmed — ticket closed", "closed");
    toast({ title: "Status Updated", description: "Ticket status updated successfully." });
  };

  const focusComposer = () => {
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const downloadDetails = () => {
    const lines = [
      `Ticket #${ticket.id}`,
      `Subject: ${ticket.subject}`,
      `Status: ${ticket.status}`,
      `Priority: ${ticket.priority}`,
      `Category: ${ticket.category}${ticket.subcategory ? ` / ${ticket.subcategory}` : ""}`,
      `Created: ${fmtDateTime(ticket.createdAt)}`,
      "",
      "Conversation:",
      ...ticket.messages.map((m) => `[${fmtDateTime(m.createdAt)}] ${m.name}: ${m.message}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ticket-${ticket.id}.txt`;
    a.click();
  };

  const downloadFile = (f: DetailAttachment) => {
    const a = document.createElement("a");
    a.href = f.url;
    a.download = f.name;
    a.click();
  };

  const related = ticket.relatedIds.map((id) => getSupportTicket(id)).filter(Boolean) as SupportTicketDetail[];

  const currentIdx = STAGES.indexOf(ticket.status);

  const issueFields = [
    { label: "Subject", value: ticket.subject },
    { label: "Description", value: ticket.issue.description },
    { label: "Affected Service", value: ticket.issue.affectedService },
    { label: "Reference Number", value: ticket.issue.referenceNumber },
    { label: "Transaction Date", value: ticket.issue.transactionDate && fmtDate(ticket.issue.transactionDate) },
    { label: "Amount", value: ticket.issue.amount != null ? fmtINR(ticket.issue.amount) : undefined },
  ].filter((f) => f.value);

  const infoRows = [
    { icon: Hash, label: "Ticket ID", value: `#${ticket.id}` },
    { icon: Activity, label: "Status", value: <StatusBadge status={ticket.status} /> },
    { icon: Flag, label: "Priority", value: <Badge variant="outline" className={PRIORITY_STYLE[ticket.priority]}>{ticket.priority}</Badge> },
    { icon: Tag, label: "Category", value: ticket.category },
    { icon: Tag, label: "Subcategory", value: ticket.subcategory },
    { icon: CalendarClock, label: "Created", value: fmtDateTime(ticket.createdAt) },
    { icon: Clock, label: "Last Updated", value: fmtDateTime(ticket.lastUpdated) },
    { icon: Users, label: "Assigned To", value: ticket.assignedTo },
    { icon: UserCheck, label: "Support Agent", value: ticket.agent },
    { icon: Headphones, label: "Expected Response", value: ticket.expectedResponse },
  ].filter((r) => r.value);

  const activityIcon = (k: DetailActivity["kind"]) =>
    ({ created: Plus, assigned: UserPlus, reply: MessageSquare, status: Activity, closed: XCircle, reopened: RotateCcw, attachment: Paperclip }[k]);

  const AttachmentChip = ({ f }: { f: DetailAttachment }) => (
    <div className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs">
      {f.type.startsWith("image") ? <ImageIcon className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
      <span className="max-w-[160px] truncate font-medium">{f.name}</span>
      <span className="text-muted-foreground">{fmtSize(f.size)}</span>
      <button aria-label={`Preview ${f.name}`} onClick={() => setPreview(f)} className="text-muted-foreground hover:text-foreground"><Eye className="h-3.5 w-3.5" /></button>
      <button aria-label={`Download ${f.name}`} onClick={() => downloadFile(f)} className="text-muted-foreground hover:text-foreground"><Download className="h-3.5 w-3.5" /></button>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl py-6 pb-32 lg:pb-10 space-y-6 overflow-x-hidden">
        {/* Header */}
        <div className="space-y-3">
          <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" onClick={() => navigate("/support")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Support Tickets
          </Button>
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/support" className="hover:text-foreground">Support</Link>
            <span className="mx-2">/</span>
            <Link to="/support" className="hover:text-foreground">My Tickets</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{ticket.id}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight break-words">{ticket.subject}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Ticket #{ticket.id} • Created on {fmtDate(ticket.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={ticket.status} />
              <Badge variant="outline" className={PRIORITY_STYLE[ticket.priority]}>{ticket.priority} priority</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Ticket actions"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={downloadDetails}><Download className="h-4 w-4 mr-2" /> Download Ticket Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" /> Print Ticket</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {ticket.status !== "Closed" ? (
                    <DropdownMenuItem onClick={() => setCloseOpen(true)} className="text-destructive"><XCircle className="h-4 w-4 mr-2" /> Close Ticket</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={reopenTicket}><RotateCcw className="h-4 w-4 mr-2" /> Reopen Ticket</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ticket Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <ol className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
              {STAGES.map((stage, i) => {
                const done = i < currentIdx || (ticket.status === "Closed" && i <= currentIdx);
                const current = i === currentIdx && ticket.status !== "Closed";
                return (
                  <li key={stage} className="flex md:flex-1 items-center gap-2 md:gap-0 md:flex-col md:relative">
                    {i > 0 && (
                      <span className={cn("hidden md:block absolute top-4 right-1/2 w-full h-0.5 -z-0", i <= currentIdx ? "bg-primary" : "bg-border")} />
                    )}
                    <span
                      className={cn(
                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold bg-background",
                        done && "bg-primary border-primary text-primary-foreground",
                        current && "border-primary text-primary ring-4 ring-primary/15",
                        !done && !current && "border-border text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : current ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : i + 1}
                    </span>
                    <span className={cn("text-sm md:mt-2 md:text-center md:text-xs", (done || current) ? "font-medium text-foreground" : "text-muted-foreground")}>
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="rounded-lg border bg-muted/40 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{ticket.status}</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{STATUS_DESC[ticket.status]}</p>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right space-y-0.5">
                <p>Last status change: {fmtDateTime(ticket.lastStatusChange)}</p>
                <p>Last updated: {fmtDateTime(ticket.lastUpdated)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {waiting && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-purple-900">Action Required</p>
                <p className="text-sm text-purple-800">Our support team needs additional information from you to continue resolving this issue.</p>
              </div>
            </div>
            <Button size="sm" onClick={focusComposer}>Respond now</Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left */}
          <div className="lg:col-span-8 space-y-6 min-w-0">
            {ticket.status === "Resolved" && (
              <Card className="border-green-200">
                <CardContent className="p-5 space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <p className="font-semibold">Issue Resolved</p>
                      <p className="text-sm text-muted-foreground">Our support team has marked this issue as resolved.</p>
                    </div>
                  </div>
                  {ticket.resolution && (
                    <div className="rounded-md bg-green-50 border border-green-100 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-800 mb-1">Resolution</p>
                      <p className="text-sm text-green-900">{ticket.resolution}</p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={confirmResolution}><CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Resolution</Button>
                    <Button variant="outline" onClick={reopenTicket}><RotateCcw className="h-4 w-4 mr-2" /> Reopen Ticket</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {ticket.status === "Closed" && (
              <Card>
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Ticket Closed</p>
                      <p className="text-sm text-muted-foreground">This ticket has been successfully closed. If you experience the same issue again, you can reopen this ticket or create a new support request.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Button variant="outline" onClick={reopenTicket}><RotateCcw className="h-4 w-4 mr-2" /> Reopen Ticket</Button>
                    <Button onClick={() => navigate("/support")}><Plus className="h-4 w-4 mr-2" /> Create New Ticket</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conversation */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                <CardTitle className="text-base">Ticket Conversation</CardTitle>
                <span className="text-xs text-muted-foreground">{ticket.messages.length} messages</span>
              </CardHeader>
              <CardContent className="space-y-5">
                {ticket.messages.map((m) => {
                  const mine = m.sender === "user";
                  return (
                    <div key={m.id} className={cn("flex gap-3", mine && "flex-row-reverse")}>
                      <div className={cn("h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold", mine ? "bg-primary text-primary-foreground" : "bg-accent text-primary")}>
                        {mine ? "Y" : <Headphones className="h-4 w-4" />}
                      </div>
                      <div className={cn("max-w-[85%] min-w-0", mine && "items-end text-right")}>
                        <div className={cn("flex flex-wrap items-baseline gap-x-2 text-sm", mine && "justify-end")}>
                          <span className="font-semibold">{m.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {!mine && `${m.role} • `}{fmtDate(m.createdAt)} • {fmtTime(m.createdAt)}
                          </span>
                        </div>
                        {m.message && (
                          <div className={cn("mt-1.5 rounded-lg px-4 py-3 text-sm whitespace-pre-wrap text-left break-words", mine ? "bg-primary/10 border border-primary/15" : "bg-muted/60 border")}>
                            {m.message}
                          </div>
                        )}
                        {m.attachments && (
                          <div className={cn("mt-2 flex flex-wrap gap-2", mine && "justify-end")}>
                            {m.attachments.map((f, i) => <AttachmentChip key={i} f={f} />)}
                          </div>
                        )}
                        {mine && m.status && <p className="mt-1 text-[11px] text-muted-foreground">{m.status}</p>}
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </CardContent>

              {canChat ? (
                <div className={cn("border-t p-4 bg-card rounded-b-lg fixed lg:sticky bottom-0 left-0 right-0 z-20 lg:z-auto shadow-[0_-4px_12px_-6px_hsl(var(--foreground)/0.1)] lg:shadow-none", waiting && "ring-2 ring-purple-300 lg:ring-inset")}>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", ticket.supportOnline ? "bg-green-500" : "bg-muted-foreground/50")} />
                    {ticket.supportOnline ? "Support is online" : "Typically replies within 2 hours"}
                  </p>
                  {files.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs">
                          {f.type.startsWith("image") ? <ImageIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                          <span className="max-w-[140px] truncate">{f.name}</span>
                          <span className="text-muted-foreground">{fmtSize(f.size)}</span>
                          <button aria-label="Preview attachment" onClick={() => setPreview({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f), uploadedAt: now() })}><Eye className="h-3.5 w-3.5" /></button>
                          <button aria-label="Remove attachment" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) setFiles((p) => [...p, ...Array.from(e.target.files!)]); e.target.value = ""; }} />
                    <Button variant="ghost" size="icon" aria-label="Attach file" onClick={() => fileRef.current?.click()}><Paperclip className="h-4 w-4" /></Button>
                    <Textarea
                      ref={composerRef}
                      rows={1}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Type your message to the support team..."
                      className="min-h-[40px] max-h-32 resize-none"
                    />
                    <Button variant="ghost" size="icon" aria-label="Add emoji" onClick={() => setMessage((m) => m + "🙂")}><Smile className="h-4 w-4" /></Button>
                    <Button onClick={sendMessage} disabled={!message.trim() && files.length === 0} aria-label="Send message">
                      <SendHorizontal className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Send</span>
                    </Button>
                  </div>
                </div>
              ) : ticket.status !== "Closed" ? (
                <div className="border-t p-4">
                  <div className="rounded-lg bg-muted/50 border p-4 flex gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Messaging unavailable</p>
                      <p className="text-sm text-muted-foreground">Replies are currently disabled for this ticket. You will receive a notification when the support team updates your ticket.</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>

            {isActive(ticket.status) && (
              <div className="flex flex-col sm:flex-row gap-2">
                {canChat && <Button variant="outline" onClick={focusComposer}><MessageSquare className="h-4 w-4 mr-2" /> Reply</Button>}
                {canChat && <Button variant="outline" onClick={() => fileRef.current?.click()}><Paperclip className="h-4 w-4 mr-2" /> Add Attachment</Button>}
                <Button variant="outline" className="sm:ml-auto text-destructive hover:text-destructive" onClick={() => setCloseOpen(true)}><XCircle className="h-4 w-4 mr-2" /> Close Ticket</Button>
              </div>
            )}

            {!isActive(ticket.status) && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">How was your support experience?</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {feedbackSent ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> Thanks for your feedback!</p>
                  ) : (
                    <>
                      <div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button key={n} aria-label={`${n} star`} onClick={() => setRating(n)}>
                              <Star className={cn("h-7 w-7 transition-colors", n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40 hover:text-amber-300")} />
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1 max-w-[180px]">
                          <span>Very Dissatisfied</span><span>Very Satisfied</span>
                        </div>
                      </div>
                      <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell us more about your experience..." />
                      <Button disabled={!rating} onClick={() => { setFeedbackSent(true); toast({ title: "Feedback submitted", description: "Thank you for rating your support experience." }); }} className="w-full sm:w-auto">
                        Submit Feedback
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right */}
          <aside className="lg:col-span-4 space-y-6 min-w-0">
            <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                    <CardTitle className="text-base">Ticket Information</CardTitle>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", infoOpen && "rotate-180")} />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="divide-y">
                    {infoRows.map((r) => (
                      <div key={r.label} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground"><r.icon className="h-4 w-4" />{r.label}</span>
                        <span className="font-medium text-right">{r.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Issue Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {issueFields.map((f) => (
                  <div key={f.label}>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{f.label}</p>
                    <p className="text-sm mt-0.5 break-words">{f.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {attachments.length > 0 && (
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Attachments ({attachments.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {attachments.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md border p-2.5">
                      <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center shrink-0">
                        {f.type.startsWith("image") ? <ImageIcon className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{fmtSize(f.size)} • {fmtDate(f.uploadedAt)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Preview ${f.name}`} onClick={() => setPreview(f)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Download ${f.name}`} onClick={() => downloadFile(f)}><Download className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Collapsible open={activityOpen} onOpenChange={setActivityOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                    <CardTitle className="text-base">Ticket Activity</CardTitle>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", activityOpen && "rotate-180")} />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <ol className="relative border-l border-border ml-3 space-y-4">
                      {ticket.activity.map((a) => {
                        const Icon = activityIcon(a.kind);
                        return (
                          <li key={a.id} className="ml-5">
                            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border bg-background">
                              <Icon className="h-3 w-3 text-muted-foreground" />
                            </span>
                            <p className="text-xs text-muted-foreground">{fmtDate(a.createdAt)} • {fmtTime(a.createdAt)}</p>
                            <p className="text-sm font-medium">{a.label}</p>
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

        {related.length > 0 && (
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Related Support Tickets</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="hidden sm:grid grid-cols-12 px-6 py-2 text-xs font-medium text-muted-foreground border-y bg-muted/30">
                <span className="col-span-2">Ticket</span><span className="col-span-5">Subject</span><span className="col-span-2">Status</span><span className="col-span-3 text-right">Last Updated</span>
              </div>
              {related.map((r) => (
                <button key={r.id} onClick={() => navigate(`/support/tickets/${r.id}`)} className="w-full grid grid-cols-2 sm:grid-cols-12 gap-1 px-6 py-3 text-sm text-left border-b last:border-b-0 hover:bg-muted/40 transition-colors">
                  <span className="sm:col-span-2 font-medium text-primary">#{r.id}</span>
                  <span className="sm:col-span-5 truncate">{r.subject}</span>
                  <span className="sm:col-span-2"><StatusBadge status={r.status} /></span>
                  <span className="sm:col-span-3 text-right text-muted-foreground">{fmtDate(r.lastUpdated)}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={closeOpen} onOpenChange={setCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this ticket?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close this support ticket? You can reopen it later if the issue has not been fully resolved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={closeTicket} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Close Ticket</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="truncate pr-6">{preview?.name}</DialogTitle></DialogHeader>
          {preview && (
            preview.type.startsWith("image") ? (
              <img src={preview.url} alt={preview.name} className="w-full max-h-[60vh] object-contain rounded-md border bg-muted" />
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
                <FileText className="h-12 w-12" />
                <p className="text-sm">{fmtSize(preview.size)} • Preview not available for this file type</p>
              </div>
            )
          )}
          {preview && <Button onClick={() => downloadFile(preview)} className="w-full sm:w-auto sm:ml-auto"><Download className="h-4 w-4 mr-2" /> Download</Button>}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TicketDetailsPage;
