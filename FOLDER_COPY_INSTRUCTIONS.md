# 📁 フォルダコピー方式でのセットアップ

## ✅ 準備完了！

GitHubリポジトリに`copy_to_github`フォルダを作成しました。
この中に正しいフォルダ構造でワークフローファイルが配置されています。

## 📱 iPhoneでの手順

### 方法1: GitHub Web UIでフォルダ内容をコピー

1. **以下のURLを開く**:
   https://github.com/kazu-4728/office-automation-hub/tree/complete-implementation/copy_to_github

2. **`.github`フォルダを確認**
   - `.github` → `workflows` と進む
   - 4つのYAMLファイルが表示される

3. **各ファイルを個別にコピー**
   - 各ファイルを開く
   - 「Raw」ボタンをタップ
   - 全文をコピー
   - リポジトリのルートで「Add file」→「Create new file」
   - パス: `.github/workflows/ファイル名.yml`
   - ペーストして保存

### 方法2: GitHub Desktop/他のGitクライアント

1. `copy_to_github`フォルダの内容をダウンロード
2. `.github`フォルダをリポジトリのルートにコピー
3. コミット＆プッシュ

## 📂 フォルダ構造

```
copy_to_github/
└── .github/
    └── workflows/
        ├── agent-main.yml      (メインコントローラー)
        ├── task-scraping.yml   (スクレイピングエンジン)
        ├── task-pdf-ocr.yml    (PDF/OCR処理エンジン)
        └── task-slide-gen.yml  (スライド生成エンジン)
```

## 🔗 直接リンク

**フォルダ全体を見る**:
https://github.com/kazu-4728/office-automation-hub/tree/complete-implementation/copy_to_github/.github/workflows

ここから各ファイルを個別に開いてコピーできます。

## ⏱️ 所要時間
- 4ファイルのコピー: 約10分

## 💡 ポイント
- フォルダ構造が正しく保たれているので、そのままコピーすれば動作します
- `.github/workflows/`というパスが重要です（この通りに作成してください）