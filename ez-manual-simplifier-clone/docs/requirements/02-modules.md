# モジュール設計詳細

## 00-cost-estimator/ - コスト管理

### 責務
- 作業前のコスト見積もり
- 予算管理・警告
- 実際のコスト記録

### 主要ファイル
- `estimator.ts` - コスト計算
- `budget-tracker.ts` - 予算管理
- `free-or-paid.ts` - 無料/有料判定

### 判断基準
- 単一ページ → Claude（$0）
- 50ページ以上 → Gemini API検討
- キャッシュ済み → $0

## 01-input/url-handler/ - 入力処理

### 責務
- URLからコンテンツ取得
- HTML解析・構造化
- サイト別最適化

### 主要ファイル
- `scrapers/selector.ts` - スクレイピング方法選択
- `scrapers/fetch-scraper.ts` - 静的サイト用
- `scrapers/puppeteer-scraper.ts` - 動的サイト用
- `parsers/generic-parser.ts` - 汎用パーサー

### 対応サイト
- GitHub Docs（優先）
- React Docs
- その他ドキュメントサイト

## 02-converter/claude-converter/ - 変換処理

### 責務
- テキストの平易化
- 構造の整理
- 図解・具体例生成

### 主要ファイル
- `text-simplifier.ts` - テキスト変換
- `structure-analyzer.ts` - 構造解析
- `diagram-planner.ts` - Mermaid図解
- `example-generator.ts` - 具体例作成
- `template-filler.ts` - テンプレート適用

### 変換例
```
専門用語: "API" → "プログラム同士が会話する仕組み"
複雑な文: "非同期処理により..." → "時間のかかる作業を待たずに..."
```

## 03-output/ - 出力処理

### 責務
- HTMLテンプレート適用
- ディレクトリ構造生成
- 静的ファイル配置

### 出力構造
```
output/[project-name]/
├── index.html
├── pages/
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── templates/
```

## 04-storage/ - ストレージ

### 責務
- キャッシュ管理
- ファイル保存
- メタデータ記録

### キャッシュ戦略
- 同じURL → 即座に返す（$0）
- 設定違い → 元データから再構成（$0）
- プロンプト違い → 差分のみAPI（$0.01~）