# Issue作成用テンプレート

以下の内容をコピーして、新しいIssueとして作成してください：

---

**Title**: 🚨 [URGENT] Activate GitHub Actions workflows

**Body**:

## Request
Please help activate GitHub Actions by moving workflow files to the correct location.

## Required Actions
```bash
mkdir -p .github/workflows
cp workflows-ready/agent-main.yml .github/workflows/
cp workflows-ready/task-scraping.yml .github/workflows/
cp workflows-ready/task-pdf-ocr.yml .github/workflows/
cp workflows-ready/task-slide-gen.yml .github/workflows/
git add .github/workflows/
git commit -m "🚀 Activate GitHub Actions workflows"
git push origin master
```

## Files to Move
- `workflows-ready/agent-main.yml` → `.github/workflows/agent-main.yml`
- `workflows-ready/task-scraping.yml` → `.github/workflows/task-scraping.yml`
- `workflows-ready/task-pdf-ocr.yml` → `.github/workflows/task-pdf-ocr.yml`
- `workflows-ready/task-slide-gen.yml` → `.github/workflows/task-slide-gen.yml`

## Why This Is Needed
GitHub App doesn't have workflows permission, so this needs to be done manually or from a local environment.

## Priority
🔴 **URGENT** - GitHub Actions functionality is completely blocked until this is resolved.

---

このIssueを作成すれば、後でPC環境からの対応や、他の協力者による対応が可能になります。