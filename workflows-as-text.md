# GitHub Actions Workflow Files (Text Format)

iPhoneから直接GitHub Web UIでファイルを作成できるように、各ワークフローファイルの内容をテキスト形式で提供します。

## 手順

1. GitHub.comをiPhoneのブラウザで開く
2. リポジトリにアクセス: https://github.com/kazu-4728/office-automation-hub
3. "Create new file" ボタンをタップ
4. ファイル名に `.github/workflows/[ファイル名].yml` を入力
5. 下記の内容をコピー＆ペースト
6. "Commit new file" をタップ

## ワークフローファイル

### 1. `.github/workflows/agent-main.yml`

ファイル名を入力: `.github/workflows/agent-main.yml`

以下の内容をコピー:

```yaml
name: 🤖 AI Agent Main Controller

on:
  issues:
    types: [opened, edited, labeled]
  pull_request:
    types: [opened, edited, labeled]
  repository_dispatch:
    types: [agent-task, scrape-request, pdf-process, slide-generate]
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:
    inputs:
      task_type:
        description: 'Task Type'
        required: true
        default: 'status'
        type: choice
        options:
        - status
        - scraping
        - pdf-ocr
        - slide-generation
        - data-processing
        - full-pipeline
      target_url:
        description: 'Target URL (for scraping)'
        required: false
        type: string

jobs:
  orchestrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Run Agent Orchestrator
        env:
          TASK_TYPE: ${{ github.event.inputs.task_type }}
          TARGET_URL: ${{ github.event.inputs.target_url }}
        run: |
          python agents/orchestrator.py
```

### 2. `.github/workflows/task-scraping.yml`

ファイル名を入力: `.github/workflows/task-scraping.yml`

内容は長いので、workflows-ready/task-scraping.yml から直接コピーしてください。

### 3. `.github/workflows/task-pdf-ocr.yml`

ファイル名を入力: `.github/workflows/task-pdf-ocr.yml`

内容は長いので、workflows-ready/task-pdf-ocr.yml から直接コピーしてください。

### 4. `.github/workflows/task-slide-gen.yml`

ファイル名を入力: `.github/workflows/task-slide-gen.yml`

内容は長いので、workflows-ready/task-slide-gen.yml から直接コピーしてください。

---

## 💡 ヒント

iPhoneのSafariで作業する場合:
1. デスクトップサイトを要求すると操作しやすくなります
2. ファイル作成時、パスに`.github/workflows/`を含めると自動的にディレクトリが作成されます
3. 各ファイルを個別にコミットしても問題ありません