# 🏗️ 設計フロー：EZ Manual Simplifier

**プロジェクト名**: EZ Manual Simplifier  
**作成日**: 2025-10-04  
**バージョン**: 1.0  
**参照**: `requirements.md`

---

## 📐 1. システムアーキテクチャ

### 1.1 全体構成図（Mermaid）

```mermaid
graph TB
    subgraph "ユーザー層"
        USER[👤 ユーザー]
    end
    
    subgraph "インターフェース層"
        CURSOR[💬 Cursor Chat]
        GITHUB_UI[🐙 GitHub UI]
        CHATGPT[🤖 ChatGPT-5]
    end
    
    subgraph "オーケストレーション層"
        COPILOT_AGENT[🤖 GitHub Copilot Agent<br/>メインオーケストレーター]
        GH_ACTIONS[⚙️ GitHub Actions<br/>タスク実行エンジン]
    end
    
    subgraph "処理層"
        GEMINI_PRO[💎 Gemini Pro<br/>メイン処理]
        GEMINI_FLASH[⚡ Gemini Flash<br/>軽量処理]
        GEMINI_IMAGEN[🎨 Gemini Imagen<br/>画像生成]
    end
    
    subgraph "専門タスク層"
        GH_COPILOT[🔧 GitHub Copilot<br/>コード生成]
        GPT_CODEX[📝 GPT Codex<br/>大規模コード]
        GENSPARK[✨ Gen Spark Pro<br/>デザイン・リサーチ]
        GEMINI_CLI[💻 Gemini CLI<br/>ローカルタスク]
    end
    
    subgraph "MCP ツール層"
        PUPPETEER[🎭 Puppeteer MCP<br/>Webスクレイピング]
        FETCH[📡 Fetch MCP<br/>API取得]
        PDF[📄 PDF Extractor<br/>PDF解析]
        OCR[👁️ OCR Service<br/>画像→テキスト]
        FS[📁 Filesystem MCP<br/>ファイル操作]
    end
    
    subgraph "データ層"
        D1[(Cloudflare D1<br/>メタデータ)]
        R2[☁️ Cloudflare R2<br/>ストレージ]
        GH_REPO[📦 GitHub Repo<br/>コード・設定]
    end
    
    subgraph "フロントエンド層"
        FRONTEND[⚛️ React Frontend<br/>Cloudflare Pages]
    end
    
    USER -->|Chat| CURSOR
    USER -->|Issue/PR| GITHUB_UI
    USER -->|相談| CHATGPT
    
    CURSOR --> COPILOT_AGENT
    GITHUB_UI --> COPILOT_AGENT
    CHATGPT -.->|助言| USER
    
    COPILOT_AGENT -->|タスク委任| GH_ACTIONS
    
    GH_ACTIONS --> GEMINI_PRO
    GH_ACTIONS --> GEMINI_FLASH
    GH_ACTIONS --> GEMINI_IMAGEN
    GH_ACTIONS --> GH_COPILOT
    GH_ACTIONS --> GPT_CODEX
    GH_ACTIONS -->|承認後| GENSPARK
    GH_ACTIONS --> GEMINI_CLI
    
    GH_ACTIONS --> PUPPETEER
    GH_ACTIONS --> FETCH
    GH_ACTIONS --> PDF
    GH_ACTIONS --> OCR
    GH_ACTIONS --> FS
    
    GEMINI_PRO --> D1
    GEMINI_PRO --> R2
    GEMINI_IMAGEN --> R2
    GENSPARK --> R2
    
    GH_ACTIONS --> D1
    GH_ACTIONS --> R2
    GH_ACTIONS --> GH_REPO
    
    FRONTEND --> D1
    FRONTEND --> R2
    
    USER -->|閲覧| FRONTEND
```

### 1.2 レイヤー説明

| レイヤー | 責務 | 技術 |
|---------|------|------|
| **ユーザー層** | 指示出し、結果確認 | 人間 |
| **インターフェース層** | ユーザー入力の受付 | Cursor、GitHub、ChatGPT |
| **オーケストレーション層** | タスク分解・分配・管理 | Copilot Agent、GitHub Actions |
| **処理層** | コンテンツ変換・生成 | Gemini Pro/Flash/Imagen |
| **専門タスク層** | 特殊タスク実行 | Copilot、Codex、Gen Spark、Gemini CLI |
| **MCPツール層** | 外部データ取得・操作 | 各種MCPサーバー |
| **データ層** | 永続化、バージョン管理 | D1、R2、GitHub |
| **フロントエンド層** | UI提供 | React、Cloudflare Pages |

---

## 🔄 2. データフロー

### 2.1 メインフロー：マニュアル変換

```mermaid
sequenceDiagram
    participant U as 👤 ユーザー
    participant C as 💬 Cursor
    participant CA as 🤖 Copilot Agent
    participant GA as ⚙️ GitHub Actions
    participant MCP as 🎭 MCP Tools
    participant GP as 💎 Gemini Pro
    participant GI as 🎨 Gemini Imagen
    participant D1 as 📊 D1 Database
    participant R2 as ☁️ R2 Storage
    
    U->>C: 「GitHub DocsのURLを変換して」
    C->>CA: Issue作成 + タスク委任
    CA->>GA: Workflow起動<br/>(convert-manual.yml)
    
    GA->>D1: プロジェクト作成<br/>status=processing
    
    GA->>MCP: Puppeteer: URLスクレイピング
    MCP-->>GA: HTML + 構造データ
    
    GA->>GP: コンテンツ解析依頼<br/>(構造・重要度)
    GP-->>GA: 解析結果<br/>(見出し・段落・難易度)
    
    GA->>GP: 平易化変換依頼<br/>(チャンク単位)
    GP-->>GA: 変換済みコンテンツ
    
    GA->>GP: 図解プラン作成依頼
    GP-->>GA: Mermaid図解コード
    
    GA->>GA: mermaid-cli実行<br/>PNG/SVG生成
    
    opt 必要な場合のみ
        GA->>GI: イラスト生成依頼
        GI-->>GA: 画像データ
    end
    
    GA->>R2: 画像アップロード
    GA->>D1: コンテンツ保存<br/>+ ハッシュ記録
    
    GA->>D1: status=completed
    
    GA-->>CA: 完了通知
    CA-->>U: Issue更新<br/>結果URL
    
    U->>U: フロントエンドで閲覧
```

### 2.2 承認フロー：Gen Spark使用時

```mermaid
sequenceDiagram
    participant CA as 🤖 Copilot Agent
    participant GA as ⚙️ GitHub Actions
    participant U as 👤 ユーザー
    participant GS as ✨ Gen Spark Pro
    participant R2 as ☁️ R2 Storage
    
    CA->>GA: デザイン生成タスク
    GA->>GA: Gen Spark使用が必要と判断
    
    GA->>U: Issue作成<br/>「Gen Spark使用の承認依頼」
    U->>GA: コメント「approved」
    
    GA->>GS: デザイン生成依頼
    GS-->>GA: デザインファイル
    
    GA->>R2: デザイン保存
    GA->>U: Issue更新<br/>「生成完了」
```

---

## 🔀 3. エージェント連携フロー

### 3.1 エージェント役割マトリクス

| エージェント | GitHub直接 | Cloudflare | API | ローカル | コスト | 主要役割 |
|------------|----------|------------|-----|---------|--------|---------|
| **Copilot Agent** | ✅ | ❌ | ✅ | ❌ | $10/月 | オーケストレーション |
| **GitHub Actions** | ✅ | ✅ | ✅ | ❌ | $0 | タスク実行 |
| **Gemini Pro** | ❌ | ❌ | ✅ | ❌ | $20/月 | メイン処理 |
| **Gemini Flash** | ❌ | ❌ | ✅ | ❌ | $0 | 軽量処理 |
| **Gemini Imagen** | ❌ | ❌ | ✅ | ❌ | $0 | 画像生成 |
| **GitHub Copilot** | ✅ | ❌ | ✅ | ❌ | $10/月 | コード生成 |
| **GPT Codex** | ✅ | ❌ | ✅ | ❌ | 従量 | 大規模コード |
| **Gen Spark Pro** | ✅ | ✅ | ✅ | ❌ | $?/月 | デザイン・リサーチ（承認制） |
| **Gemini CLI** | ❌ | ❌ | ✅ | ✅ | $0 | ローカルタスク |

### 3.2 タスク種別ごとの担当エージェント

```mermaid
graph LR
    subgraph "タスク種別"
        T1[コンテンツ変換]
        T2[図解生成]
        T3[画像生成]
        T4[デザイン生成]
        T5[コード生成]
        T6[Webスクレイピング]
        T7[PDF解析]
        T8[データ保存]
    end
    
    subgraph "担当エージェント"
        A1[Gemini Pro]
        A2[Gemini Pro + mermaid-cli]
        A3[Gemini Imagen]
        A4[Gen Spark Pro<br/>承認制]
        A5[GitHub Copilot]
        A6[Puppeteer MCP]
        A7[PDF Extractor MCP]
        A8[GitHub Actions]
    end
    
    T1 --> A1
    T2 --> A2
    T3 --> A3
    T4 --> A4
    T5 --> A5
    T6 --> A6
    T7 --> A7
    T8 --> A8
```

### 3.3 意思決定フロー

```mermaid
graph TD
    START[ユーザー指示]
    
    START --> CLAUDE{Claudeが理解}
    CLAUDE -->|明確| COPILOT[Copilot Agent]
    CLAUDE -->|不明確| ASK_USER[ユーザーに確認]
    
    ASK_USER --> COPILOT
    
    COPILOT --> DECOMPOSE[タスク分解]
    DECOMPOSE --> JUDGE{タスク種別判定}
    
    JUDGE -->|コンテンツ変換| GEMINI_PRO[Gemini Pro]
    JUDGE -->|図解| MERMAID[Gemini + Mermaid]
    JUDGE -->|画像| IMAGEN[Gemini Imagen]
    JUDGE -->|デザイン| CHECK_APPROVAL{承認済み?}
    JUDGE -->|コード| COPILOT_CODE[GitHub Copilot]
    JUDGE -->|スクレイピング| PUPPETEER[Puppeteer MCP]
    
    CHECK_APPROVAL -->|Yes| GENSPARK[Gen Spark Pro]
    CHECK_APPROVAL -->|No| REQUEST_APPROVAL[承認依頼 Issue]
    REQUEST_APPROVAL -->|承認| GENSPARK
    REQUEST_APPROVAL -->|却下| ALTERNATIVE[代替手段]
    
    GEMINI_PRO --> EXECUTE[GitHub Actions実行]
    MERMAID --> EXECUTE
    IMAGEN --> EXECUTE
    GENSPARK --> EXECUTE
    COPILOT_CODE --> EXECUTE
    PUPPETEER --> EXECUTE
    ALTERNATIVE --> EXECUTE
    
    EXECUTE --> SAVE[D1/R2保存]
    SAVE --> NOTIFY[ユーザー通知]
    NOTIFY --> END[完了]
```

---

## 🗂️ 4. ディレクトリ構成

### 4.1 プロジェクト構造

```
ez-manual/
├── .github/
│   ├── workflows/                    # GitHub Actions
│   │   ├── convert-manual.yml        # メインワークフロー
│   │   ├── deploy-frontend.yml       # フロントエンドデプロイ
│   │   ├── test.yml                  # テスト実行
│   │   └── orchestrator.yml          # オーケストレーター
│   ├── scripts/                      # ヘルパースクリプト
│   │   ├── setup_database.sql        # D1スキーマ
│   │   └── deploy.sh                 # デプロイスクリプト
│   └── ISSUE_TEMPLATE/               # Issueテンプレート
│       ├── conversion-request.md
│       └── genspark-approval.md
│
├── .mcp/                             # MCP設定
│   └── config.json
│
├── docs/                             # ドキュメント
│   ├── requirements.md               # ✅ 要件定義
│   ├── design-flow.md                # ✅ 設計フロー
│   ├── task-checklist.md             # ✅ タスクチェックリスト
│   ├── api-reference.md              # API仕様
│   └── deployment-guide.md           # デプロイ手順
│
├── shared/                           # 共通型定義
│   └── types/
│       ├── project.ts
│       ├── document.ts
│       ├── agent.ts
│       └── index.ts
│
├── frontend/                         # フロントエンド
│   ├── public/
│   ├── src/
│   │   ├── components/               # UIコンポーネント
│   │   ├── pages/                    # ページ
│   │   ├── hooks/                    # カスタムフック
│   │   ├── store/                    # 状態管理（Zustand）
│   │   ├── api/                      # API クライアント
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
│
├── backend/                          # バックエンド（Workers）
│   ├── src/
│   │   ├── index.ts                  # メインエントリ
│   │   ├── routes/                   # APIルート
│   │   ├── services/                 # ビジネスロジック
│   │   ├── db/                       # D1操作
│   │   └── utils/                    # ユーティリティ
│   └── wrangler.toml
│
├── agents/                           # エージェントスクリプト
│   ├── gemini/
│   │   ├── content-converter.ts      # コンテンツ変換
│   │   ├── diagram-generator.ts      # 図解生成
│   │   └── image-generator.ts        # 画像生成
│   ├── mcp/
│   │   ├── puppeteer-client.ts       # Puppeteer MCP
│   │   ├── pdf-client.ts             # PDF MCP
│   │   └── ocr-client.ts             # OCR MCP
│   └── orchestrator/
│       └── task-distributor.ts       # タスク分配
│
├── prompts/                          # プロンプトテンプレート
│   ├── v1.0/                         # バージョン管理
│   │   ├── simplify-content.txt
│   │   ├── generate-diagram.txt
│   │   └── analyze-structure.txt
│   └── README.md
│
├── tests/                            # テスト
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .cursorrules                      # Cursor設定
├── .env.example                      # 環境変数テンプレート
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

### 4.2 出力ディレクトリ構成

```
output/
├── projects/
│   └── {project-id}/                 # プロジェクトごと
│       ├── metadata.json             # メタデータ
│       ├── original/                 # 元データ
│       │   └── content.md
│       ├── converted/                # 変換後
│       │   ├── index.html
│       │   ├── page-1.html
│       │   └── ...
│       ├── images/                   # 生成画像
│       │   ├── diagrams/
│       │   │   ├── flow-1.svg
│       │   │   └── ...
│       │   └── illustrations/
│       │       ├── concept-1.png
│       │       └── ...
│       └── versions/                 # バージョン履歴
│           ├── v1/
│           ├── v2/
│           └── ...
```

---

## 🔐 5. セキュリティ設計

### 5.1 APIキー管理

```mermaid
graph LR
    subgraph "ユーザー側"
        USER[ユーザー]
        BROWSER[ブラウザ localStorage]
    end
    
    subgraph "GitHub"
        SECRETS[GitHub Secrets]
        ACTIONS[GitHub Actions]
    end
    
    subgraph "Cloudflare"
        WORKERS[Workers]
        ENV[Environment Variables]
    end
    
    USER -->|設定| BROWSER
    USER -->|設定| SECRETS
    
    BROWSER -->|送信| WORKERS
    WORKERS -.->|検証のみ| ENV
    
    SECRETS --> ACTIONS
    ACTIONS -->|API呼び出し| EXTERNAL[External APIs]
```

### 5.2 セキュリティレイヤー

| レイヤー | 対策 | 実装 |
|---------|------|------|
| **入力検証** | XSS、インジェクション対策 | Zod、DOMPurify |
| **認証** | APIキー検証 | Custom middleware |
| **認可** | レート制限 | Cloudflare Rate Limiting |
| **通信** | HTTPS強制 | Cloudflare SSL |
| **データ** | 暗号化保存（必要時） | Cloudflare KV encryption |

---

## 📈 6. スケーラビリティ設計

### 6.1 並列処理戦略

```mermaid
graph TD
    INPUT[大規模入力<br/>例: GitHub Docs全体]
    
    INPUT --> SPLIT[コンテンツ分割<br/>チャンク化]
    
    SPLIT --> CHUNK1[チャンク 1]
    SPLIT --> CHUNK2[チャンク 2]
    SPLIT --> CHUNK3[チャンク 3]
    SPLIT --> CHUNKN[チャンク N]
    
    CHUNK1 --> GA1[GitHub Actions 1]
    CHUNK2 --> GA2[GitHub Actions 2]
    CHUNK3 --> GA3[GitHub Actions 3]
    CHUNKN --> GAN[GitHub Actions N]
    
    GA1 --> GEMINI1[Gemini Pro 1]
    GA2 --> GEMINI2[Gemini Pro 2]
    GA3 --> GEMINI3[Gemini Pro 3]
    GAN --> GEMNIN[Gemini Pro N]
    
    GEMINI1 --> MERGE[結果統合]
    GEMINI2 --> MERGE
    GEMINI3 --> MERGE
    GEMNIN --> MERGE
    
    MERGE --> OUTPUT[最終出力]
```

### 6.2 キャッシング戦略

```mermaid
graph LR
    REQUEST[リクエスト]
    
    REQUEST --> HASH{コンテンツハッシュ<br/>計算}
    HASH --> CHECK{キャッシュ存在?}
    
    CHECK -->|Yes| R2[R2から取得]
    CHECK -->|No| PROCESS[Gemini処理]
    
    PROCESS --> SAVE[R2に保存]
    SAVE --> RETURN[結果返却]
    R2 --> RETURN
```

---

## 🔄 7. バージョン管理・再現性設計

### 7.1 再現性確保の仕組み

```yaml
reproducibility_strategy:
  
  input_hash:
    method: SHA-256
    input:
      - 元コンテンツ
      - 変換設定
      - プロンプトバージョン
    output: 決定的ハッシュ
  
  prompt_versioning:
    storage: Git（prompts/v1.0/）
    format: |
      # v1.0 - 2025-10-04
      ## simplify-content.txt
      あなたは...
    
    tracking: |
      versions テーブルに記録
      prompt_version: "v1.0"
  
  model_versioning:
    tracking: |
      使用モデル記録
      model_version: "gemini-1.5-pro-002"
  
  parameters_tracking:
    storage: D1 versions テーブル
    format: JSON
    example:
      temperature: 0.7
      max_tokens: 4096
      target_level: "elementary"
```

### 7.2 バージョン管理フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant S as システム
    participant D1 as D1 Database
    participant R2 as R2 Storage
    
    U->>S: 変換リクエスト
    S->>S: 入力ハッシュ計算
    S->>D1: ハッシュ検索
    
    alt キャッシュヒット
        D1-->>S: バージョン情報
        S->>R2: コンテンツ取得
        R2-->>U: キャッシュ済み結果
    else キャッシュミス
        S->>S: Gemini処理
        S->>D1: 新バージョン作成
        S->>R2: コンテンツ保存
        R2-->>U: 新規生成結果
    end
```

---

## 🚀 8. デプロイメント設計

### 8.1 デプロイフロー

```mermaid
graph LR
    DEV[開発環境<br/>Cursor/VSCode]
    
    DEV -->|git push| GITHUB[GitHub Repository]
    
    GITHUB -->|trigger| GA_TEST[GitHub Actions<br/>Test]
    GA_TEST -->|pass| GA_BUILD[GitHub Actions<br/>Build]
    
    GA_BUILD -->|frontend| CF_PAGES[Cloudflare Pages]
    GA_BUILD -->|backend| CF_WORKERS[Cloudflare Workers]
    GA_BUILD -->|database| CF_D1[Cloudflare D1]
    
    CF_PAGES --> PROD[本番環境]
    CF_WORKERS --> PROD
    CF_D1 --> PROD
```

### 8.2 環境構成

| 環境 | ブランチ | デプロイ先 | 用途 |
|------|---------|-----------|------|
| **開発** | feature/* | ローカル | 機能開発 |
| **ステージング** | develop | Cloudflare Preview | 統合テスト |
| **本番** | main | Cloudflare Production | 本番運用 |

---

## 📊 9. モニタリング・ロギング設計

### 9.1 ログ収集フロー

```mermaid
graph TD
    subgraph "ログソース"
        FRONTEND[Frontend<br/>エラーログ]
        WORKERS[Workers<br/>APIログ]
        ACTIONS[GitHub Actions<br/>実行ログ]
    end
    
    subgraph "ログ保存"
        D1_LOGS[D1 logs テーブル]
        GH_LOGS[GitHub Actions logs]
        CF_ANALYTICS[Cloudflare Analytics]
    end
    
    subgraph "分析"
        DASHBOARD[ダッシュボード]
        ALERTS[アラート]
    end
    
    FRONTEND --> D1_LOGS
    WORKERS --> D1_LOGS
    WORKERS --> CF_ANALYTICS
    ACTIONS --> GH_LOGS
    
    D1_LOGS --> DASHBOARD
    CF_ANALYTICS --> DASHBOARD
    GH_LOGS --> DASHBOARD
    
    DASHBOARD --> ALERTS
```

### 9.2 メトリクス

| カテゴリ | メトリクス | 目標値 |
|---------|-----------|--------|
| **パフォーマンス** | 変換時間 | < 5分（中規模） |
| **成功率** | 変換成功率 | > 95% |
| **コスト** | API使用量 | < $10/月 |
| **品質** | ユーザー評価 | > 4.0/5.0 |

---

## ✅ 10. 次ステップ

1. ✅ この設計フローの承認
2. ⏭️ タスクチェックリスト作成
3. ⏭️ プロジェクト初期化
4. ⏭️ GitHub Actions基本構成
5. ⏭️ Gemini Pro統合

---

**この設計フローに対するフィードバックをお願いします。**  
**修正・追加が必要な箇所があればお知らせください。**
