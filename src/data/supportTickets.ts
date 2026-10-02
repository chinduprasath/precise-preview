export type DetailStatus =
  | "Submitted"
  | "Under Review"
  | "In Progress"
  | "Waiting for User"
  | "Resolved"
  | "Closed"
  | "Escalated";

export type DetailPriority = "Low" | "Medium" | "High" | "Critical";

export interface DetailAttachment {
  name: string;
  size: number; // bytes
  type: string;
  url: string;
  uploadedAt: string;
}

export interface DetailMessage {
  id: string;
  sender: "user" | "agent";
  name: string;
  role: string;
  createdAt: string;
  message: string;
  attachments?: DetailAttachment[];
  status?: "Sent" | "Delivered" | "Read";
}

export interface DetailActivity {
  id: string;
  createdAt: string;
  label: string;
  kind: "created" | "assigned" | "reply" | "status" | "closed" | "reopened" | "attachment";
}

export interface DetailNote {
  id: string;
  author: string;
  role: string;
  createdAt: string;
  content: string;
  type?: "update" | "action_required" | "info" | "resolution";
}

export interface SupportTicketDetail {
  id: string;
  subject: string;
  status: DetailStatus;
  priority: DetailPriority;
  category: string;
  subcategory?: string;
  createdAt: string;
  lastUpdated: string;
  lastStatusChange: string;
  assignedTo?: string;
  agent?: string;
  expectedResponse?: string;
  chatEnabled: boolean;
  supportOnline: boolean;
  issue: {
    description: string;
    affectedService?: string;
    referenceNumber?: string;
    transactionDate?: string;
    amount?: number;
  };
  resolution?: string;
  messages: DetailMessage[];
  notes?: DetailNote[];
  activity: DetailActivity[];
  relatedIds: string[];
}

const d = (s: string) => new Date(s).toISOString();

export const SUPPORT_TICKETS: SupportTicketDetail[] = [
  {
    id: "T1001",
    subject: "Payment processing issue",
    status: "In Progress",
    priority: "High",
    category: "Payments",
    subcategory: "Payment Processing",
    createdAt: d("2026-10-02T10:15:00"),
    lastUpdated: d("2026-10-02T10:45:00"),
    lastStatusChange: d("2026-10-02T10:45:00"),
    assignedTo: "Support Team",
    agent: "Alex Johnson",
    expectedResponse: "Within 4 hours",
    chatEnabled: true,
    supportOnline: true,
    issue: {
      description:
        "I made a payment but the transaction is still showing as pending. The amount has been deducted from my account.",
      affectedService: "Payments",
      referenceNumber: "PAY-8493021",
      transactionDate: d("2026-10-02T09:58:00"),
      amount: 2499,
    },
    messages: [
      {
        id: "m1",
        sender: "user",
        name: "You",
        role: "Customer",
        createdAt: d("2026-10-02T10:15:00"),
        message:
          "I made a payment but the transaction is still showing as pending. The amount has been deducted from my account.",
        status: "Read",
        attachments: [
          { name: "payment_receipt.pdf", size: 250880, type: "application/pdf", url: "/placeholder.svg", uploadedAt: d("2026-10-02T10:15:00") },
          { name: "payment_screenshot.png", size: 1258291, type: "image/png", url: "/placeholder.svg", uploadedAt: d("2026-10-02T10:15:00") },
        ],
      },
      {
        id: "m2",
        sender: "agent",
        name: "Alex Johnson",
        role: "Support Agent",
        createdAt: d("2026-10-02T10:32:00"),
        message:
          "Hi, thanks for contacting support. We are checking the transaction status with our payment processor. We'll update you shortly.",
      },
      {
        id: "m3",
        sender: "user",
        name: "You",
        role: "Customer",
        createdAt: d("2026-10-02T10:40:00"),
        message: "Okay, thank you.",
        status: "Read",
      },
    ],
    notes: [
      {
        id: "n1",
        author: "Alex Johnson",
        role: "Support Admin",
        createdAt: d("2026-10-02T10:45:00"),
        content: "Gateway reconciliation in progress with Razorpay operations for transaction ID PAY-8493021. Expected resolution time is 2-4 hours. In case of auto-reversal, funds will reflect back in source account in 24-48 business hours.",
        type: "update",
      },
      {
        id: "n2",
        author: "Finance Operations",
        role: "Admin Team",
        createdAt: d("2026-10-02T10:25:00"),
        content: "Customer's payment attempt was debited at banking switch. Webhook response was delayed due to gateway queue. No manual refund required at this stage.",
        type: "info",
      },
    ],
    activity: [
      { id: "a4", createdAt: d("2026-10-02T10:45:00"), label: "Ticket status changed to In Progress", kind: "status" },
      { id: "a3", createdAt: d("2026-10-02T10:32:00"), label: "Support agent replied to the ticket", kind: "reply" },
      { id: "a2", createdAt: d("2026-10-02T10:20:00"), label: "Ticket assigned to Support Team", kind: "assigned" },
      { id: "a1", createdAt: d("2026-10-02T10:15:00"), label: "Ticket created", kind: "created" },
    ],
    relatedIds: ["T0998", "T0987"],
  },
  {
    id: "T1002",
    subject: "Account verification",
    status: "Waiting for User",
    priority: "Medium",
    category: "Account Issue",
    subcategory: "Verification",
    createdAt: d("2026-10-01T09:00:00"),
    lastUpdated: d("2026-10-01T21:00:00"),
    lastStatusChange: d("2026-10-01T21:00:00"),
    assignedTo: "Verification Team",
    agent: "Priya Sharma",
    expectedResponse: "Within 24 hours",
    chatEnabled: true,
    supportOnline: false,
    issue: {
      description: "I uploaded my verification documents yesterday but haven't received any updates.",
      affectedService: "Account",
    },
    messages: [
      { id: "m1", sender: "user", name: "You", role: "Customer", createdAt: d("2026-10-01T09:00:00"), message: "I uploaded my verification documents yesterday but haven't received any updates.", status: "Read" },
      { id: "m2", sender: "agent", name: "Priya Sharma", role: "Support Agent", createdAt: d("2026-10-01T21:00:00"), message: "Thanks for waiting. The ID proof you uploaded is blurry. Could you please upload a clearer copy of the front side?" },
    ],
    activity: [
      { id: "a3", createdAt: d("2026-10-01T21:00:00"), label: "Ticket status changed to Waiting for User", kind: "status" },
      { id: "a2", createdAt: d("2026-10-01T09:10:00"), label: "Ticket assigned to Verification Team", kind: "assigned" },
      { id: "a1", createdAt: d("2026-10-01T09:00:00"), label: "Ticket created", kind: "created" },
    ],
    relatedIds: ["T0987"],
  },
  {
    id: "T1003",
    subject: "Feature request",
    status: "Resolved",
    priority: "Low",
    category: "Other",
    createdAt: d("2026-09-30T11:00:00"),
    lastUpdated: d("2026-10-01T11:00:00"),
    lastStatusChange: d("2026-10-01T11:00:00"),
    assignedTo: "Product Team",
    agent: "Alex Johnson",
    expectedResponse: "Within 48 hours",
    chatEnabled: true,
    supportOnline: true,
    issue: { description: "I would like to suggest a new feature that allows bulk editing of campaigns." },
    resolution: "Your suggestion has been added to our feature backlog and will be considered in an upcoming release.",
    messages: [
      { id: "m1", sender: "user", name: "You", role: "Customer", createdAt: d("2026-09-30T11:00:00"), message: "I would like to suggest a new feature that allows bulk editing of campaigns.", status: "Read" },
      { id: "m2", sender: "agent", name: "Alex Johnson", role: "Support Agent", createdAt: d("2026-10-01T11:00:00"), message: "Thank you for the suggestion! We've added it to our feature backlog and will consider it for future updates." },
    ],
    activity: [
      { id: "a3", createdAt: d("2026-10-01T11:00:00"), label: "Ticket marked as Resolved", kind: "status" },
      { id: "a2", createdAt: d("2026-10-01T11:00:00"), label: "Support agent replied to the ticket", kind: "reply" },
      { id: "a1", createdAt: d("2026-09-30T11:00:00"), label: "Ticket created", kind: "created" },
    ],
    relatedIds: [],
  },
  {
    id: "T0998",
    subject: "Payment verification",
    status: "Resolved",
    priority: "Medium",
    category: "Payments",
    subcategory: "Verification",
    createdAt: d("2026-09-26T14:00:00"),
    lastUpdated: d("2026-09-28T12:00:00"),
    lastStatusChange: d("2026-09-28T12:00:00"),
    assignedTo: "Support Team",
    agent: "Alex Johnson",
    chatEnabled: false,
    supportOnline: false,
    issue: { description: "Please verify my last payment of ₹1,200.", amount: 1200, affectedService: "Payments" },
    resolution: "The payment status has been successfully synchronized and the transaction is now completed.",
    messages: [
      { id: "m1", sender: "user", name: "You", role: "Customer", createdAt: d("2026-09-26T14:00:00"), message: "Please verify my last payment of ₹1,200.", status: "Read" },
      { id: "m2", sender: "agent", name: "Alex Johnson", role: "Support Agent", createdAt: d("2026-09-28T12:00:00"), message: "Your payment has been verified and credited." },
    ],
    activity: [
      { id: "a2", createdAt: d("2026-09-28T12:00:00"), label: "Ticket marked as Resolved", kind: "status" },
      { id: "a1", createdAt: d("2026-09-26T14:00:00"), label: "Ticket created", kind: "created" },
    ],
    relatedIds: ["T1001"],
  },
  {
    id: "T0987",
    subject: "Refund pending",
    status: "Closed",
    priority: "High",
    category: "Payments",
    subcategory: "Refunds",
    createdAt: d("2026-09-15T10:00:00"),
    lastUpdated: d("2026-09-20T10:00:00"),
    lastStatusChange: d("2026-09-20T10:00:00"),
    assignedTo: "Billing Team",
    agent: "Priya Sharma",
    chatEnabled: false,
    supportOnline: false,
    issue: { description: "My refund for a cancelled order hasn't arrived yet.", referenceNumber: "REF-55120", amount: 3500 },
    messages: [
      { id: "m1", sender: "user", name: "You", role: "Customer", createdAt: d("2026-09-15T10:00:00"), message: "My refund for a cancelled order hasn't arrived yet.", status: "Read" },
      { id: "m2", sender: "agent", name: "Priya Sharma", role: "Support Agent", createdAt: d("2026-09-18T10:00:00"), message: "The refund has been processed and should reflect within 2 business days." },
    ],
    activity: [
      { id: "a3", createdAt: d("2026-09-20T10:00:00"), label: "Ticket closed", kind: "closed" },
      { id: "a2", createdAt: d("2026-09-18T10:00:00"), label: "Support agent replied to the ticket", kind: "reply" },
      { id: "a1", createdAt: d("2026-09-15T10:00:00"), label: "Ticket created", kind: "created" },
    ],
    relatedIds: ["T1001", "T0998"],
  },
];

const STORAGE_KEY = "influex_support_tickets_v2";

export const getSupportTickets = (): SupportTicketDetail[] => {
  if (typeof window === "undefined") return SUPPORT_TICKETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SUPPORT_TICKETS));
      return SUPPORT_TICKETS;
    }
    const parsed = JSON.parse(raw);
    return parsed.map((t: SupportTicketDetail) => ({
      ...t,
      notes: t.notes || [],
      chatEnabled: t.chatEnabled ?? true,
    }));
  } catch (e) {
    console.error("Failed to load tickets from localStorage:", e);
    return SUPPORT_TICKETS;
  }
};

export const getSupportTicket = (id?: string): SupportTicketDetail | undefined => {
  const tickets = getSupportTickets();
  return tickets.find((t) => t.id.toLowerCase() === (id || "").toLowerCase());
};

export const saveSupportTicket = (ticket: SupportTicketDetail): void => {
  if (typeof window === "undefined") return;
  try {
    const tickets = getSupportTickets();
    const idx = tickets.findIndex((t) => t.id.toLowerCase() === ticket.id.toLowerCase());
    if (idx >= 0) {
      tickets[idx] = ticket;
    } else {
      tickets.unshift(ticket);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error("Failed to save ticket to localStorage:", e);
  }
};

export const addSupportTicket = (ticket: SupportTicketDetail): void => {
  saveSupportTicket(ticket);
};

export const resetSupportTickets = (): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SUPPORT_TICKETS));
};

