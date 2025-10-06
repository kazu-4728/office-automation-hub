# ez-manual-simplifier

技術マニュアル簡単化ツール - AI駆動、コスト最適化

## 概要

複雑な技術マニュアルを分かりやすく変換するAI駆動ツールです。専門用語を平易な日本語に変換し、図解・具体例を自動生成して、テンプレート化されたHTMLサイトとして出力します。

## 主な特徴

- **AI駆動変換**: Claude（メイン）+ Gemini API（補助）
- **コスト最適化**: 月額$2以下での運用
- **テンプレート化**: 安定した出力構造
- **モジュール設計**: 独立した機能で拡張性確保
- **キャッシング**: API使用を最小化

## 対応サイト

- GitHub Docs（優先）
- React Docs
- その他ドキュメントサイト

## 技術スタック

- **変換**: Claude（無料）+ Gemini API（必要時のみ）
- **レビュー**: Codex
- **出力**: HTML + CSS + JavaScript
- **ホスティング**: Cloudflare Pages

## クイックスタート

```bash
# リポジトリクローン
git clone https://github.com/YOUR_USERNAME/ez-manual-simplifier.git
cd ez-manual-simplifier

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

## 使用方法

### 基本的な変換

```bash
# URLを指定して変換
npm run convert -- --url "https://docs.github.com/ja/get-started/quickstart"

# オプション指定
npm run convert -- --url "https://react.dev/learn" --level "中学生" --detail "詳細"
```

### コスト見積もり

```bash
# 変換前にコストを確認
npm run estimate -- --url "https://docs.github.com/ja"
```

## プロジェクト構造

```
ez-manual-simplifier/
├── modules/                    # 機能モジュール
│   ├── 00-cost-estimator/     # コスト管理
│   ├── 01-input/              # 入力処理
│   ├── 02-converter/          # 変換処理
│   ├── 03-output/             # 出力処理
│   └── 04-storage/            # ストレージ
├── templates/                 # HTMLテンプレート
├── docs/                     # ドキュメント
└── output/                   # 生成結果
```

## ドキュメント

詳細な設計・使用方法については `docs/` フォルダを参照してください。

- [プロジェクト概要](docs/requirements/00-overview.md)
- [アーキテクチャ設計](docs/requirements/01-architecture.md)
- [モジュール設計](docs/requirements/02-modules.md)
- [コスト戦略](docs/requirements/03-cost-strategy.md)
- [テンプレート設計](docs/requirements/04-templates.md)
- [作業フロー](docs/requirements/05-workflow.md)
- [エージェント役割](docs/requirements/06-agent-roles.md)
- [引き継ぎガイド](docs/requirements/07-handoff-guide.md)

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## サポート

問題が発生した場合は、[Issues](https://github.com/YOUR_USERNAME/ez-manual-simplifier/issues) で報告してください。