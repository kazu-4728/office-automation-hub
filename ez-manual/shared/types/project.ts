export type InputType = 'url' | 'file' | 'video' | 'image';

export type ProjectStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'error' 
  | 'cancelled';

export type TargetLevel = 
  | 'elementary'      // 小学生
  | 'junior-high'     // 中学生
  | 'beginner'        // 初心者
  | 'intermediate';   // 中級者

export type DetailLevel = 
  | 'concise'         // 簡潔版
  | 'standard'        // 標準版
  | 'detailed';       // 詳細版

export type OutputFormat = 
  | 'html' 
  | 'pdf' 
  | 'epub' 
  | 'markdown';

export interface ConversionSettings {
  targetLevel: TargetLevel;
  detailLevel: DetailLevel;
  outputFormat: OutputFormat;
  theme: 'light' | 'dark' | 'colorful';
  language: 'ja' | 'en';
  includeImages: boolean;
  includeDiagrams: boolean;
  maxPages?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  inputType: InputType;
  inputSource: string;
  status: ProjectStatus;
  settings: ConversionSettings;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  resultUrl?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  inputType: InputType;
  inputSource: string;
  settings?: Partial<ConversionSettings>;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  errorMessage?: string;
  resultUrl?: string;
}
