# 🔧 GitHub Actions ワークフロー有効化ガイド

## 状況説明

現在、GitHub Actions のワークフローファイルは `workflows-ready/` ディレクトリに準備済みです。
GitHub App の権限制限により、自動的に `.github/workflows/` にデプロイできないため、手動での有効化が必要です。

## 🚀 クイックセットアップ（推奨）

### オプション1: セットアップスクリプトを使用

```bash
# リポジトリをクローン
git clone https://github.com/kazu-4728/office-automation-hub.git
cd office-automation-hub

# セットアップスクリプトを実行
chmod +x setup-workflows.sh
./setup-workflows.sh

# 変更をコミット＆プッシュ
git add .github/workflows/
git commit -m "🚀 Activate GitHub Actions workflows"
git push origin master
```

### オプション2: 手動でファイルをコピー

```bash
# ディレクトリを作成
mkdir -p .github/workflows

# ワークフローファイルをコピー
cp workflows-ready/agent-main.yml .github/workflows/
cp workflows-ready/task-scraping.yml .github/workflows/
cp workflows-ready/task-pdf-ocr.yml .github/workflows/
cp workflows-ready/task-slide-gen.yml .github/workflows/

# 変更をコミット＆プッシュ
git add .github/workflows/
git commit -m "🚀 Activate GitHub Actions workflows"
git push origin master
```

## 📝 ワークフローファイル一覧

以下の4つのワークフローが利用可能です：

1. **agent-main.yml**
   - メインオーケストレーター
   - 全体的なタスク管理と制御
   - Issue/PR/手動トリガー対応

2. **task-scraping.yml**
   - Webスクレイピングエンジン
   - BeautifulSoupベースの実装
   - 複数URL対応

3. **task-pdf-ocr.yml**
   - PDF/OCR処理エンジン
   - テキスト抽出、表抽出、画像抽出
   - 日本語・英語OCR対応

4. **task-slide-gen.yml**
   - スライド自動生成エンジン
   - 複数テンプレート対応
   - データからのプレゼンテーション作成

## ✅ 有効化の確認

ワークフローが正しく有効化されたか確認する方法：

1. **GitHubリポジトリの Actions タブを開く**
   - https://github.com/kazu-4728/office-automation-hub/actions

2. **ワークフローが表示されることを確認**
   - 「AI Agent Main Controller」
   - 「Scraping Task Engine」
   - 「PDF/OCR Processing Engine」
   - 「Slide Generation Engine」

3. **テスト実行**
   - 任意のワークフローを選択
   - 「Run workflow」ボタンをクリック
   - パラメータを設定して実行

## 🎯 使用方法

### Issue経由でタスクを実行

```markdown
タイトル: [SCRAPE] ウェブサイトのデータ収集
本文: 
対象URL: https://example.com
出力形式: JSON
```

### GitHub Actions UIから手動実行

1. Actions タブを開く
2. ワークフローを選択
3. 「Run workflow」をクリック
4. パラメータを入力
5. 「Run workflow」ボタンをクリック

### API経由でトリガー

```bash
curl -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/kazu-4728/office-automation-hub/dispatches \
  -d '{
    "event_type": "agent-task",
    "client_payload": {
      "task_type": "scraping",
      "target_url": "https://example.com"
    }
  }'
```

## 🔍 トラブルシューティング

### ワークフローが動作しない場合

1. **Python依存関係の確認**
   ```bash
   pip install -r requirements.txt
   ```

2. **権限の確認**
   - Settings → Actions → General
   - 「Workflow permissions」を確認

3. **シークレットの設定**
   - 必要に応じてGITHUB_TOKENなどを設定

### エラーログの確認

- Actions タブでワークフロー実行を選択
- 失敗したジョブをクリック
- ログを確認してエラー詳細を特定

## 📚 関連ドキュメント

- [README.md](README.md) - プロジェクト概要
- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - 詳細なセットアップ手順
- [requirements.txt](requirements.txt) - Python依存関係

## 💡 ヒント

- ワークフローは段階的にテストすることをお勧めします
- まず単純なタスクから始めて、徐々に複雑なパイプラインを実行
- ログを活用してデバッグを行う

---

準備が整ったら、上記の手順でワークフローを有効化してください！