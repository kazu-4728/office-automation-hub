# 📱 iPhone用 GitHub Actions ワークフロー有効化手順

## 🎯 最も簡単な方法: GitHub Web UIから4つのファイルを作成

### 📝 手順

#### ステップ1: GitHubリポジトリにアクセス
1. Safariで開く: https://github.com/kazu-4728/office-automation-hub
2. 右上の「Sign in」でログイン（既にログイン済みならスキップ）

#### ステップ2: ワークフローファイルを一つずつ作成

**重要**: 以下の4つのファイルを順番に作成します。

---

### 📄 ファイル1: agent-main.yml

1. リポジトリページで「Add file」→「Create new file」をタップ
2. ファイル名入力欄に: `.github/workflows/agent-main.yml`
3. 以下のURLから内容をコピー:
   - https://github.com/kazu-4728/office-automation-hub/blob/master/workflows-ready/agent-main.yml
   - 「Raw」ボタンをタップして生のテキストを表示
   - 全選択してコピー
4. GitHubの編集画面にペースト
5. 下部の「Commit new file」をタップ
6. コミットメッセージ: `Add agent-main workflow`
7. 「Commit directly to the master branch」を選択
8. 「Commit new file」をタップ

---

### 📄 ファイル2: task-scraping.yml

1. 再度「Add file」→「Create new file」をタップ
2. ファイル名: `.github/workflows/task-scraping.yml`
3. 内容をコピー元:
   - https://github.com/kazu-4728/office-automation-hub/blob/master/workflows-ready/task-scraping.yml
4. 同様にコピー＆ペースト
5. コミットメッセージ: `Add task-scraping workflow`
6. コミット

---

### 📄 ファイル3: task-pdf-ocr.yml

1. 「Add file」→「Create new file」
2. ファイル名: `.github/workflows/task-pdf-ocr.yml`
3. 内容をコピー元:
   - https://github.com/kazu-4728/office-automation-hub/blob/master/workflows-ready/task-pdf-ocr.yml
4. コピー＆ペースト
5. コミットメッセージ: `Add task-pdf-ocr workflow`
6. コミット

---

### 📄 ファイル4: task-slide-gen.yml

1. 「Add file」→「Create new file」
2. ファイル名: `.github/workflows/task-slide-gen.yml`
3. 内容をコピー元:
   - https://github.com/kazu-4728/office-automation-hub/blob/master/workflows-ready/task-slide-gen.yml
4. コピー＆ペースト
5. コミットメッセージ: `Add task-slide-gen workflow`
6. コミット

---

## ✅ 確認方法

すべてのファイルを作成したら:

1. リポジトリの「Actions」タブをタップ
2. 以下の4つのワークフローが表示されるはず:
   - 🤖 AI Agent Main Controller
   - 🕷️ Scraping Task Processor
   - 📄 PDF/OCR Task Processor
   - 🎨 Slide Generation Processor

## 💡 iPhone操作のコツ

### コピー＆ペーストのコツ:
1. 「Raw」ボタンでプレーンテキスト表示
2. 画面を長押し→「すべてを選択」
3. 「コピー」
4. 編集画面で長押し→「ペースト」

### 画面が見づらい場合:
- 横向きにすると作業しやすい
- ピンチアウトで拡大可能
- デスクトップ版サイトを要求（Safariの「AA」ボタン）

## 🚀 簡易版: 一括作成用PR

もし個別作成が大変な場合、以下の方法も可能:

1. このIssueを作成:
   - タイトル: `[URGENT] Activate GitHub Actions workflows`
   - 本文: `Please move all files from workflows-ready/ to .github/workflows/`
   
2. 後でPCアクセス可能な時に対応

## ⏱️ 所要時間

- 個別ファイル作成: 約10-15分
- 慣れれば5分程度で完了

## 🆘 トラブルシューティング

### ファイル作成時にエラーが出る場合:
- ブランチ保護がある可能性
- 新しいブランチを作成してPRを作る

### コピーがうまくいかない場合:
- 「Desktop version」を要求
- 別のブラウザアプリを試す（Chrome等）

---

準備完了です！この手順で実行してください。