export interface Version {
  id: string;
  documentId: string;
  versionNumber: number;
  content: string;
  contentHash: string;
  promptVersion: string;
  modelVersion: string;
  parameters: VersionParameters;
  createdAt: Date;
  createdBy: string;          // 'user' | 'auto-regenerate'
  comment?: string;
}

export interface VersionParameters {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  targetLevel: string;
  detailLevel: string;
  seed?: number;              // 再現性用（可能な場合）
}

export interface VersionDiff {
  versionFrom: number;
  versionTo: number;
  addedSections: string[];
  removedSections: string[];
  modifiedSections: string[];
  charDiff: number;           // 文字数の差分
}
