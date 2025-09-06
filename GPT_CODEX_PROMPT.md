# GitHub Actions ワークフロー有効化依頼

## 🎯 重要：これが唯一必要な作業です

## タスク
GitHub ActionsのワークフローファイルをGitHubリポジトリの正しい位置に配置してください。

## リポジトリ情報
- **リポジトリURL**: https://github.com/kazu-4728/office-automation-hub
- **対象ブランチ**: `complete-implementation`

## 現在の問題
ワークフローファイルが間違った場所にあるため、GitHub Actionsが機能していません。

## 現在のファイル位置（間違い）
```
copy_to_github/.github/workflows/
├── agent-main.yml
├── task-scraping.yml
├── task-pdf-ocr.yml
└── task-slide-gen.yml
```

## 必要な配置（正しい位置）
```
.github/workflows/
├── agent-main.yml
├── task-scraping.yml
├── task-pdf-ocr.yml
└── task-slide-gen.yml
```

## 実行してほしいコマンド
```bash
# 1. リポジトリをクローン
git clone https://github.com/kazu-4728/office-automation-hub.git
cd office-automation-hub

# 2. ブランチを切り替え
git checkout complete-implementation

# 3. 最新の変更を取得
git pull origin complete-implementation

# 4. ワークフローディレクトリを作成
mkdir -p .github/workflows

# 5. ファイルを正しい位置にコピー
cp copy_to_github/.github/workflows/agent-main.yml .github/workflows/
cp copy_to_github/.github/workflows/task-scraping.yml .github/workflows/
cp copy_to_github/.github/workflows/task-pdf-ocr.yml .github/workflows/
cp copy_to_github/.github/workflows/task-slide-gen.yml .github/workflows/

# 6. 不要なフォルダを削除（オプション）
rm -rf copy_to_github

# 7. 変更をステージング
git add .github/workflows/
git add -A  # copy_to_githubを削除した場合

# 8. コミット
git commit -m "🚀 Activate GitHub Actions workflows - Move files to correct location"

# 9. プッシュ
git push origin complete-implementation

# 10. Pull Requestを作成（masterへのマージ用）
# GitHub UIで complete-implementation → master のPRを作成
```

## 確認事項
1. `.github/workflows/` ディレクトリに4つのYAMLファイルが配置されたか
2. GitHub Actionsタブでワークフローが表示されるか
3. 各ワークフローが実行可能になったか

## 重要な注意点
- **権限**: リポジトリへの書き込み権限が必要です
- **認証**: GitHubの認証情報（トークンまたはSSH）が必要です
- **ブランチ**: `complete-implementation`ブランチで作業してください

## 成功の確認方法
1. https://github.com/kazu-4728/office-automation-hub/actions にアクセス
2. 以下の4つのワークフローが表示されること：
   - 🤖 AI Agent Main Controller
   - 🕷️ Scraping Task Processor
   - 📄 PDF/OCR Task Processor
   - 🎨 Slide Generation Processor

## トラブルシューティング
- **権限エラーの場合**: Personal Access Tokenを使用してください
- **ブランチ保護の場合**: Pull Request経由でマージしてください
- **ファイルが見つからない場合**: `git pull`で最新を取得してください

よろしくお願いします！