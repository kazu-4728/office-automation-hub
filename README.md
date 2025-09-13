# 🤖 GitHub Actions AI Agent Hub

## 概要
GitHub Actions 上で常駐する AI エージェント群を用いて、スクレイピングからデータ処理、PDF/OCR、スライド生成までを自動化するプロジェクトです。

## 主な特徴
- **常駐エージェント**: GitHub Actions を利用した 24/7 自動実行
- **動的ツール管理**: 必要な依存を実行時に取得
- **完全パイプライン**: スクレイピング → PDF/OCR → スライド生成
- **多様なトリガー**: Issue、PR、Webhook、スケジュール、手動実行

## 使い方
プロジェクトは次の3通りの方法で実行できます。
**Issue**, **Actions**, **API** のいずれかを選び、タスクをキックします。
はじめての方はまず Actions からの実行を試すのがおすすめです。

### Issue から実行
```
# スクレイピング
タイトル: [SCRAPE] 任意の説明
本文: https://example.com

# PDF/OCR
タイトル: [PDF] 任意の説明
本文: PDF の URL
```

### Actions から実行
1. GitHub の Actions タブを開く  
2. 「🤖 AI Agent Main Controller」を選択  
3. 右側の「Run workflow」をクリック  
4. フォームが開いたら必要に応じてパラメータを入力し、再度「Run workflow」で実行  
   - 例: `task_type` に `scraping`、`target_url` に取得したい URL を記入

### API から実行
```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <TOKEN>" \
  https://api.github.com/repos/kazu-4728/office-automation-hub/dispatches \
  -d '{
    "event_type": "agent-task",
    "client_payload": {
      "task_type": "scraping",
      "target_url": "https://example.com"
    }
  }'
## ワークフロー構成
```
.github/workflows/
├── agent-main.yml      # オーケストレーター
├── agent.yml           # OpenAIキー確認・定期実行
├── task-scraping.yml   # スクレイピング
├── task-pdf-ocr.yml    # PDF/OCR
└── task-slide-gen.yml  # スライド生成
```

## 開発とテスト
1. 依存のインストール: `npm install`
2. ビルド: `npm run build`
3. テスト: `npm test`

### agent ワークフローの使い方
- `.github/workflows/agent.yml` は毎時自動実行され、OpenAI のシークレットが存在するかを事前にチェックします。  
- 手動実行する場合は Actions から `agent` を選択し、`Run workflow` をクリックします。  
  - `run_mode` に `housekeeping-only` を選ぶとシークレット不要の掃除処理のみを行います。  
  - `run_mode` を `full`（既定値）のまま実行すると、シークレットが確認できた場合に本処理が走ります。  
- 実行結果は Actions のジョブログから確認できます。

## 出力
```
outputs/
├── scraping/{task-id}/scraped_data.json
├── pdf-processing/{task-id}/processing_results.json
└── slides/{task-id}/presentation_{task-id}.pptx
```

## セキュリティ
- 認証情報は GitHub Secrets で管理
- 実行ログや成果物は必要に応じて削除

## サポート
- [Issues](https://github.com/kazu-4728/office-automation-hub/issues)
- [Discussions](https://github.com/kazu-4728/office-automation-hub/discussions)

## ライセンス
MIT License. 詳細は [LICENSE](./LICENSE) を参照してください。

