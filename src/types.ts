export enum Priority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum Severity {
  BLOCKER = 'Blocker',
  MAJOR = 'Major',
  MINOR = 'Minor',
  TRIVIAL = 'Trivial'
}

export enum Status {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  QA_TESTING = 'QA Testing',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export interface Defect {
  id: string; // e.g. DEF-1001
  title: string;
  description: string;
  project: string;
  module?: string;
  priority: Priority;
  severity: Severity;
  status: Status;
  assignee: string;
  reporter: string;
  reportedVersion: string; // e.g., v2.4.0
  targetFixVersion: string; // e.g., v2.5.0
  reproductionSteps: string;
  expectedBehavior: string;
  actualBehavior: string;
  rootCauseAnalysis?: string;
  resolutionNotes?: string;
  comments?: string;
  imageUrl?: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface AuditEvent {
  id: string;
  defectId: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  department?: string;
}

// Store state definition
export interface AppState {
  defects: Defect[];
  auditTrail: AuditEvent[];
  users: User[];
  projects: string[];
  currentUser: User | null;
  spreadsheetId: string | null;
  isAuthenticated: boolean;
}
