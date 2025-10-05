export type MCPServerType = 
  | 'puppeteer'
  | 'fetch'
  | 'filesystem'
  | 'pdf-extractor'
  | 'ocr-service';

export interface MCPToolCall {
  server: MCPServerType;
  tool: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

// Puppeteer MCP
export interface PuppeteerScreenshotArgs {
  url: string;
  selector?: string;
  fullPage?: boolean;
  viewport?: {
    width: number;
    height: number;
  };
}

export interface PuppeteerNavigateArgs {
  url: string;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
}

export interface PuppeteerScrapeArgs {
  url: string;
  selectors: Record<string, string>;
  waitForSelector?: string;
}

// Fetch MCP
export interface FetchArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
}

// Filesystem MCP
export interface FilesystemReadArgs {
  path: string;
  encoding?: 'utf8' | 'base64';
}

export interface FilesystemWriteArgs {
  path: string;
  content: string;
  encoding?: 'utf8' | 'base64';
}

// PDF Extractor MCP (仮想)
export interface PDFExtractArgs {
  file: string;              // Base64 or file path
  extractImages?: boolean;
  extractTables?: boolean;
}

export interface PDFExtractResult {
  text: string;
  pages: number;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
  };
  images?: Array<{
    page: number;
    image: string;            // Base64
  }>;
}

// OCR Service MCP (仮想)
export interface OCRArgs {
  image: string;              // Base64 or URL
  language?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  blocks: Array<{
    text: string;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}
