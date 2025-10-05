export interface DocumentSection {
  id: string;
  title: string;
  level: number;              // 見出しレベル (1-6)
  content: string;            // 変換後のコンテンツ
  originalContent: string;    // 元のコンテンツ
  order: number;              // 順序
  images: DocumentImage[];
  diagrams: DocumentDiagram[];
}

export interface DocumentImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  type: 'illustration' | 'screenshot' | 'icon' | 'photo';
  generatedBy?: 'gemini-imagen' | 'genspark' | 'user-upload';
}

export interface DocumentDiagram {
  id: string;
  title: string;
  type: 'flowchart' | 'sequence' | 'gantt' | 'mindmap' | 'er' | 'other';
  mermaidCode: string;
  imageUrl: string;           // Rendered PNG/SVG URL
  description?: string;
}

export interface Document {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  sections: DocumentSection[];
  contentHash: string;        // SHA-256ハッシュ（再現性用）
  version: number;
  metadata: DocumentMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentMetadata {
  originalUrl?: string;
  originalFileName?: string;
  originalFileSize?: number;
  wordCount: number;
  estimatedReadingTime: number;  // 分
  complexity: 'low' | 'medium' | 'high';
  topics: string[];
  promptVersion: string;
  modelVersion: string;
  processingTime: number;     // 秒
}

export interface CreateDocumentInput {
  projectId: string;
  title: string;
  description?: string;
  originalContent: string;
}
