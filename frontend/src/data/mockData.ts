export type ServiceType = "Website" | "Marketing" | "Branding";
export type RequestStatus = "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Completed";
export type WorkItemStatus = "Todo" | "In Progress" | "Review" | "Done";
export type Priority = "Low" | "Medium" | "High";

export interface ServiceRequest {
  id: string;
  clientName: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  preferredDeadline: string;
  status: RequestStatus;
  reviewNote?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  displayId?: string;
}

export interface WorkItem {
  id: string;
  requestId: string;
  title: string;
  assigneeId: string;
  priority: Priority;
  dueDate: string;
  status: WorkItemStatus;
  notes: string[];
  createdAt?: string;
  updatedAt?: string;
  displayId?: string;
}

export const MOCK_REQUESTS: ServiceRequest[] = [
  { id: "SR-001", clientName: "TechFlow Inc.", serviceType: "Website", title: "Corporate Website Redesign", description: "Complete redesign of the corporate website with modern aesthetics and improved UX.", preferredDeadline: "2026-05-15", status: "Approved", createdAt: "2026-03-10", createdBy: "1", reviewNote: "Approved - high priority client." },
  { id: "SR-002", clientName: "GreenLeaf Co.", serviceType: "Branding", title: "Brand Identity Package", description: "Full brand identity including logo, color palette, typography, and brand guidelines.", preferredDeadline: "2026-04-20", status: "Submitted", createdAt: "2026-03-15", createdBy: "2" },
  { id: "SR-003", clientName: "Urban Eats", serviceType: "Marketing", title: "Social Media Campaign", description: "Launch campaign across Instagram, TikTok, and LinkedIn for new menu launch.", preferredDeadline: "2026-04-01", status: "Under Review", createdAt: "2026-03-18", createdBy: "1", reviewNote: "Reviewing scope and timeline." },
  { id: "SR-004", clientName: "NovaFit", serviceType: "Website", title: "E-commerce Platform", description: "Build a fitness equipment e-commerce store with payment integration.", preferredDeadline: "2026-06-01", status: "Draft", createdAt: "2026-03-20", createdBy: "2" },
  { id: "SR-005", clientName: "Bloom Studio", serviceType: "Branding", title: "Logo Refresh", description: "Modernize existing logo while maintaining brand recognition.", preferredDeadline: "2026-04-10", status: "Rejected", createdAt: "2026-03-12", createdBy: "1", reviewNote: "Budget not approved by client." },
  { id: "SR-006", clientName: "DataPulse", serviceType: "Marketing", title: "Email Nurture Sequence", description: "Design and write a 5-part email nurture sequence for SaaS onboarding.", preferredDeadline: "2026-04-25", status: "Approved", createdAt: "2026-03-08", createdBy: "2", reviewNote: "Good scope, proceed." },
];

export const MOCK_WORK_ITEMS: WorkItem[] = [
  { id: "WI-001", requestId: "SR-001", title: "Design Homepage Mockup", assigneeId: "3", priority: "High", dueDate: "2026-04-01", status: "Done", notes: ["Completed initial wireframes", "Client approved the design"] },
  { id: "WI-002", requestId: "SR-001", title: "Develop Frontend Components", assigneeId: "3", priority: "High", dueDate: "2026-04-15", status: "In Progress", notes: ["Header and footer done"] },
  { id: "WI-003", requestId: "SR-001", title: "Backend API Integration", assigneeId: "4", priority: "Medium", dueDate: "2026-04-20", status: "Todo", notes: [] },
  { id: "WI-004", requestId: "SR-006", title: "Write Email Copy", assigneeId: "4", priority: "Medium", dueDate: "2026-04-10", status: "Review", notes: ["Draft ready for review"] },
  { id: "WI-005", requestId: "SR-006", title: "Design Email Templates", assigneeId: "3", priority: "Low", dueDate: "2026-04-12", status: "In Progress", notes: [] },
];
