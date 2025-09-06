# 🚀 GitHub Actions ワークフロー有効化スクリプト

## ⚠️ 重要: GitHub Appの権限制限について

GitHub Appには`workflows`権限がないため、サンドボックスから直接ワークフローファイルをプッシュすることができません。
以下の手順でローカル環境から実行してください。

## 📝 ローカル環境での実行手順

### 1. リポジトリをクローン（既にある場合はスキップ）
```bash
git clone https://github.com/kazu-4728/office-automation-hub.git
cd office-automation-hub
```

### 2. 最新の変更を取得
```bash
git pull origin master
```

### 3. ワークフローファイルを移動するスクリプト

以下のコマンドをコピーして実行してください：

```bash
#!/bin/bash

# ワークフローディレクトリを作成
mkdir -p .github/workflows

# ワークフローファイルをコピー
echo "📁 Copying workflow files..."
cp workflows-ready/agent-main.yml .github/workflows/
cp workflows-ready/task-scraping.yml .github/workflows/
cp workflows-ready/task-pdf-ocr.yml .github/workflows/
cp workflows-ready/task-slide-gen.yml .github/workflows/

# 確認
echo "✅ Workflow files copied:"
ls -la .github/workflows/

# Git操作
git add .github/workflows/
git commit -m "🚀 Activate GitHub Actions workflows - Move from workflows-ready to .github/workflows"

# プッシュ
git push origin master

echo "🎉 Workflows activated successfully!"
```

### 4. または手動で一つずつ実行

```bash
# ディレクトリ作成
mkdir -p .github/workflows

# ファイルをコピー
cp workflows-ready/agent-main.yml .github/workflows/
cp workflows-ready/task-scraping.yml .github/workflows/
cp workflows-ready/task-pdf-ocr.yml .github/workflows/
cp workflows-ready/task-slide-gen.yml .github/workflows/

# Git操作
git add .github/workflows/
git commit -m "🚀 Activate GitHub Actions workflows"
git push origin master
```

## 🔍 実行後の確認

1. **GitHub Actionsタブを確認**
   - https://github.com/kazu-4728/office-automation-hub/actions
   - 4つのワークフローが表示されるはずです

2. **ワークフローのテスト**
   - "AI Agent Main Controller"を選択
   - "Run workflow"ボタンをクリック
   - テスト実行

## 📌 注意事項

- ブランチ保護がある場合は、PRを作成してマージする必要があります
- その場合は`master`の代わりに別ブランチにプッシュしてPRを作成してください

## 🆘 トラブルシューティング

### ブランチ保護エラーの場合
```bash
git checkout -b activate-workflows
git push origin activate-workflows
# その後GitHub UIでPRを作成
```

### 権限エラーの場合
- Personal Access Tokenを使用
- またはSSH認証を設定

## 📄 ワークフローファイルの確認

移動されるファイル：
1. `agent-main.yml` - メインコントローラー
2. `task-scraping.yml` - スクレイピングエンジン  
3. `task-pdf-ocr.yml` - PDF/OCR処理エンジン
4. `task-slide-gen.yml` - スライド生成エンジン

これらは`workflows-ready/`ディレクトリから`.github/workflows/`ディレクトリに移動されます。