export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  memberRole: "admin" | "member";
  totalTasks: number;
  doneTasks: number;
};

export type ProjectMember = {
  userId: string;
  role: "admin" | "member";
  user: { id: string; name: string; email: string };
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  projectId: string;
  project?: { id: string; name: string } | null;
  assignedTo: string | null;
  createdBy: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: { id: string; name: string; email: string } | null;
  creator?: { id: string; name: string; email: string } | null;
};

export type DashboardResponse = {
  kpis: {
    total: number;
    done: number;
    overdue: number;
  };
  myTasks: Task[];
  overdue: Task[];
};
