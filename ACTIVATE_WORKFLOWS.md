# 🚀 GitHub Actions ワークフロー有効化手順

## 必要な作業（1つだけ）

`workflows-ready`フォルダ内のファイルを`.github/workflows`に移動するだけです。

## コマンド

```bash
# リポジトリをクローン
git clone https://github.com/kazu-4728/office-automation-hub.git
cd office-automation-hub

# ブランチを切り替え
git checkout complete-implementation

# ワークフローディレクトリを作成
mkdir -p .github/workflows

# ファイルを移動（重要：これがメインタスク）
cp workflows-ready/*.yml .github/workflows/

# 変更をコミット
git add .github/workflows/
git commit -m "Activate GitHub Actions workflows"

# プッシュ
git push origin complete-implementation
```

## 移動するファイル

- `workflows-ready/agent-main.yml` → `.github/workflows/agent-main.yml`
- `workflows-ready/task-scraping.yml` → `.github/workflows/task-scraping.yml`
- `workflows-ready/task-pdf-ocr.yml` → `.github/workflows/task-pdf-ocr.yml`
- `workflows-ready/task-slide-gen.yml` → `.github/workflows/task-slide-gen.yml`

## 成功確認

https://github.com/kazu-4728/office-automation-hub/actions でワークフローが表示されれば成功です。