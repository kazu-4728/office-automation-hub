# 📚 EZ Manual Simplifier

技術マニュアルを初心者や小学生でも理解できるように、**分かりやすく画像付きで変換**するWebアプリケーション

## 🎯 プロジェクト概要

GitHub Docsなどの技術マニュアルは専門用語が多く、初心者には理解困難です。このプロジェクトは、AIを活用して以下を実現します：

- ✅ 専門用語を平易な日本語に変換
- ✅ 複雑な概念を視覚的な図解で説明
- ✅ 理解しやすい順序に再構成
- ✅ 具体例を豊富に追加

## 📐 アーキテクチャ

### 技術スタック
- **フロントエンド**: React 18, TypeScript, Vite, Tailwind CSS
- **バックエンド**: Cloudflare Workers, Hono
- **データベース**: Cloudflare D1 (SQLite)
- **ストレージ**: Cloudflare R2
- **AI**: Gemini Pro/Flash/Imagen
- **CI/CD**: GitHub Actions

### エージェント構成
- **GitHub Copilot Agent**: メインオーケストレーター
- **Gemini Pro**: コンテンツ変換・解析
- **Gemini Imagen**: 画像生成（$0）
- **Gen Spark Pro**: デザイン生成（承認制）
- **MCP**: Webスクレイピング、PDF解析、OCR

## 🚀 セットアップ

### 前提条件
- Node.js 20+
- npm 10+
- Cloudflareアカウント
- Gemini Pro API キー

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-username/ez-manual.git
cd ez-manual

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env を編集してAPIキーを設定

# Cloudflare D1 データベース作成
npm run db:create
npm run db:migrate

# Cloudflare R2 バケット作成
npm run r2:create
```

### 開発サーバー起動

```bash
# フロントエンド
npm run dev

# バックエンド（別ターミナル）
npm run dev:backend
```

フロントエンド: http://localhost:3000  
バックエンド: http://localhost:8787

## 📖 使い方

### エンドユーザー向け

1. ホーム画面で入力形式を選択（URL / ファイル / 動画）
2. 変換設定を選択（対象レベル、詳細度など）
3. 変換を開始
4. 結果をプレビュー・ダウンロード

### 開発者向け

```bash
# テスト実行
npm test

# リント
npm run lint

# フォーマット
npm run format

# ビルド
npm run build

# デプロイ
npm run deploy:frontend
npm run deploy:backend
```

## 📂 プロジェクト構造

```
ez-manual/
├── docs/                    # ドキュメント
│   ├── requirements.md      # 要件定義
│   ├── design-flow.md       # 設計フロー
│   └── task-checklist.md    # タスクチェックリスト
├── frontend/                # Reactフロントエンド
├── backend/                 # Cloudflare Workers
├── agents/                  # AIエージェントスクリプト
├── shared/                  # 共通型定義
├── prompts/                 # プロンプトテンプレート
└── .github/workflows/       # CI/CD
```

## 🤖 AIエージェント統合

### ワークフロー

```
ユーザー（Cursor Chat）
  ↓
Claude（Issue作成）
  ↓
GitHub Copilot Agent（タスク分解）
  ↓
GitHub Actions（実行）
  ├─ Gemini Pro（コンテンツ変換）
  ├─ Gemini Imagen（画像生成）
  ├─ Gen Spark Pro（デザイン・承認制）
  └─ MCP Tools（スクレイピング等）
  ↓
Cloudflare D1/R2（保存）
  ↓
ユーザー通知
```

## 💰 コスト

- **固定費**: $50/月（Gemini Pro、GitHub Copilot等）
- **変動費**: $0-10/月（API使用量）
- **画像生成**: $0（Gemini Imagen + Gen Spark）
- **ホスティング**: $0（Cloudflare無料枠）

## 📝 ドキュメント

- [要件定義](docs/requirements.md)
- [設計フロー](docs/design-flow.md)
- [タスクチェックリスト](docs/task-checklist.md)
- API リファレンス（実装中）
- デプロイガイド（実装中）

## 🧪 テスト

```bash
# ユニットテスト
npm test

# E2Eテスト
npm run test:e2e

# カバレッジ
npm test -- --coverage
```

## 🚢 デプロイ

### 本番環境

```bash
# フロントエンド（Cloudflare Pages）
npm run deploy:frontend

# バックエンド（Cloudflare Workers）
npm run deploy:backend
```

GitHub Actionsで自動デプロイ設定済み（`main` ブランチへのプッシュ時）

## 🤝 コントリビューション

1. Issueを作成（機能要求・バグ報告）
2. ブランチを作成（`feature/your-feature`）
3. 変更をコミット
4. PRを作成

## 📄 ライセンス

MIT License

## 🙏 謝辞

- Gemini Pro by Google
- Cloudflare Workers/Pages
- GitHub Copilot
- React, Vite, Tailwind CSS

---

**現在のステータス**: 🚧 開発中（Phase 1: 基盤構築完了）

**次のステップ**: Phase 2 - Cloudflare統合
