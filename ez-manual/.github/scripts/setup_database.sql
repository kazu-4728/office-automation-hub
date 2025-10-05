-- EZ Manual Simplifier - Database Schema
-- Cloudflare D1 (SQLite)

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  input_type TEXT NOT NULL CHECK (input_type IN ('url', 'file', 'video', 'image')),
  input_source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'error', 'cancelled')),
  settings TEXT NOT NULL,  -- JSON
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER,
  error_message TEXT,
  result_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sections TEXT NOT NULL,  -- JSON
  content_hash TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT NOT NULL,  -- JSON
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_content_hash ON documents(content_hash);

-- Versions Table
CREATE TABLE IF NOT EXISTS versions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  model_version TEXT NOT NULL,
  parameters TEXT NOT NULL,  -- JSON
  created_at INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  comment TEXT,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  UNIQUE (document_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_versions_document_id ON versions(document_id);
CREATE INDEX IF NOT EXISTS idx_versions_content_hash ON versions(content_hash);

-- Cache Table
CREATE TABLE IF NOT EXISTS cache (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cache_key ON cache(key);
CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache(expires_at);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  event_type TEXT NOT NULL,
  event_data TEXT,  -- JSON
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_project_id ON analytics(project_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp DESC);

-- Logs Table
CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
  message TEXT NOT NULL,
  context TEXT,  -- JSON
  timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC);
