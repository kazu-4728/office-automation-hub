# 🚀 GitHub Actions ワークフロー セットアップ手順

## 重要：GitHub Actionsを有効化するための手動セットアップが必要です

GitHub Appの権限制限により、ワークフローファイルを自動的に`.github/workflows/`ディレクトリに配置できません。
以下の手順で手動セットアップを完了してください。

## セットアップ手順

### 方法1: GitHub Web UIを使用（推奨）

1. **GitHubリポジトリにアクセス**
   - https://github.com/kazu-4728/office-automation-hub

2. **新しいファイルを作成**
   - "Add file" → "Create new file" をクリック

3. **各ワークフローファイルを作成**
   
   以下の4つのファイルを`.github/workflows/`ディレクトリに作成してください：

   **ファイル1: `.github/workflows/agent-main.yml`**
   - `workflows-ready/agent-main.yml`の内容をコピー＆ペースト
   
   **ファイル2: `.github/workflows/task-scraping.yml`**
   - `workflows-ready/task-scraping.yml`の内容をコピー＆ペースト
   
   **ファイル3: `.github/workflows/task-pdf-ocr.yml`**
   - `workflows-ready/task-pdf-ocr.yml`の内容をコピー＆ペースト
   
   **ファイル4: `.github/workflows/task-slide-gen.yml`**
   - `workflows-ready/task-slide-gen.yml`の内容をコピー＆ペースト

4. **コミット**
   - 各ファイルを作成後、"Commit new file"をクリック

### 方法2: ローカルで実行（Git CLIを使用）

リポジトリオーナーがローカルで以下のコマンドを実行：

```bash
# リポジトリをクローン
git clone https://github.com/kazu-4728/office-automation-hub.git
cd office-automation-hub

# 最新の変更を取得
git pull origin master

# ワークフローファイルを移動
mkdir -p .github/workflows
cp workflows-ready/* .github/workflows/

# コミットしてプッシュ
git add .github/workflows/
git commit -m "🚀 Activate GitHub Actions workflows"
git push origin master
```

### 方法3: GitHub CLIを使用

```bash
# GitHub CLIでファイルを作成
gh api repos/kazu-4728/office-automation-hub/contents/.github/workflows/agent-main.yml \
  --method PUT \
  --field message="Add agent-main workflow" \
  --field content="$(base64 < workflows-ready/agent-main.yml)"

# 他の3つのファイルも同様に作成
```

## セットアップ後の確認

1. **Actions タブを確認**
   - リポジトリの"Actions"タブにアクセス
   - 4つのワークフローが表示されることを確認

2. **テスト実行**
   - "AI Agent Main Controller"ワークフローを選択
   - "Run workflow"ボタンをクリック
   - パラメータを設定して実行

## ワークフローの使い方

### Issue経由での実行
```markdown
タイトル: [SCRAPE] テストスクレイピング
本文: https://example.com
```

### 手動実行
1. Actions タブを開く
2. ワークフローを選択
3. "Run workflow"をクリック
4. パラメータを入力して実行

### API経由での実行
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/kazu-4728/office-automation-hub/dispatches \
  -d '{"event_type":"agent-task","client_payload":{"task_type":"scraping","target_url":"https://example.com"}}'
```

## トラブルシューティング

### ワークフローが表示されない場合
- `.github/workflows/`ディレクトリが正しく作成されているか確認
- YAMLファイルの構文エラーがないか確認
- GitHub Actionsが有効になっているか確認（Settings → Actions）

### 実行エラーが発生する場合
- Pythonエージェントファイルが`agents/`ディレクトリに存在するか確認
- `requirements.txt`の依存関係が正しいか確認
- ワークフローのログを確認してエラー詳細を特定

## サポート

問題が発生した場合は、Issueを作成してください：
https://github.com/kazu-4728/office-automation-hub/issues