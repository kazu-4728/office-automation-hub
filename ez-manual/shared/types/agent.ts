export type AgentType = 
  | 'copilot-agent'
  | 'github-actions'
  | 'gemini-pro'
  | 'gemini-flash'
  | 'gemini-imagen'
  | 'github-copilot'
  | 'gpt-codex'
  | 'genspark-pro'
  | 'gemini-cli';

export type TaskType = 
  | 'content-analysis'
  | 'content-conversion'
  | 'diagram-generation'
  | 'image-generation'
  | 'design-generation'
  | 'code-generation'
  | 'web-scraping'
  | 'pdf-extraction'
  | 'ocr'
  | 'data-storage';

export type TaskStatus = 
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface AgentTask {
  id: string;
  type: TaskType;
  assignedTo: AgentType;
  status: TaskStatus;
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  retryCount: number;
  maxRetries: number;
}

export interface AgentCapabilities {
  name: AgentType;
  canAccessGitHub: boolean;
  canAccessCloudflare: boolean;
  canAccessLocalFiles: boolean;
  cost: 'free' | 'paid' | 'usage-based';
  strengths: string[];
  weaknesses: string[];
  requiresApproval: boolean;
}

export interface TaskDistribution {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  tasks: AgentTask[];
  startedAt: Date;
  estimatedCompletion?: Date;
}
