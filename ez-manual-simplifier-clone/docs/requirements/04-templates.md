# テンプレート設計

## テンプレート化の目的
- 毎回同じ構造で出力
- デザインの統一性
- 再利用性の向上
- デバッグの容易さ

## HTMLテンプレート構造

### ページテンプレート (`templates/page.html`)
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>{{PAGE_TITLE}} - {{PROJECT_NAME}}</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="stylesheet" href="../assets/css/theme.css">
</head>
<body>
  <!-- ナビゲーション -->
  <nav class="sidebar">
    {{NAVIGATION}}
  </nav>
  
  <!-- メインコンテンツ -->
  <main class="content">
    <h1>{{PAGE_TITLE}}</h1>
    <div class="meta">
      <span class="level">対象: {{TARGET_LEVEL}}</span>
      <span class="reading-time">読了時間: {{READING_TIME}}分</span>
    </div>
    
    <!-- セクション -->
    {{SECTIONS}}
    
    <!-- ナビゲーション（前後） -->
    <nav class="page-nav">
      <a href="{{PREV_PAGE}}">← 前へ</a>
      <a href="{{NEXT_PAGE}}">次へ →</a>
    </nav>
  </main>
  
  <script src="../assets/js/main.js"></script>
</body>
</html>
```

### セクションテンプレート (`templates/section.html`)
```html
<section id="{{SECTION_ID}}" class="content-section">
  <h2>{{SECTION_TITLE}}</h2>
  
  <!-- 簡単な説明 -->
  <div class="simple-explanation">
    <p class="label">🌟 簡単に言うと</p>
    {{SIMPLE_EXPLANATION}}
  </div>
  
  <!-- 詳細説明 -->
  <div class="detailed-explanation">
    {{DETAILED_CONTENT}}
  </div>
  
  <!-- 図解（あれば） -->
  {{#if HAS_DIAGRAM}}
  <div class="diagram">
    <img src="{{DIAGRAM_URL}}" alt="{{DIAGRAM_ALT}}">
    <p class="caption">{{DIAGRAM_CAPTION}}</p>
  </div>
  {{/if}}
  
  <!-- 具体例 -->
  {{#if HAS_EXAMPLE}}
  <div class="example">
    <p class="label">💡 具体例</p>
    {{EXAMPLE_CONTENT}}
  </div>
  {{/if}}
</section>
```

## CSS設計

### 共通スタイル (`assets/css/style.css`)
```css
/* 基本レイアウト */
body {
  font-family: 'Noto Sans JP', sans-serif;
  line-height: 1.6;
  color: #333;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

.content {
  margin-left: 250px;
  padding: 2rem;
  max-width: 800px;
}

/* セクションスタイル */
.content-section {
  margin-bottom: 3rem;
}

.simple-explanation {
  background: #e8f5e8;
  padding: 1rem;
  border-left: 4px solid #28a745;
  margin: 1rem 0;
}

.diagram {
  text-align: center;
  margin: 2rem 0;
}

.example {
  background: #fff3cd;
  padding: 1rem;
  border-left: 4px solid #ffc107;
  margin: 1rem 0;
}
```

## JavaScript機能

### ナビゲーション (`assets/js/main.js`)
```javascript
// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// 読了時間計算
function calculateReadingTime() {
  const text = document.querySelector('.content').innerText;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  document.querySelector('.reading-time').textContent = `${readingTime}分`;
}
```

## 出力ディレクトリ構造

```
output/[project-name]/
├── index.html                     # トップページ
├── pages/                         # コンテンツページ
│   ├── 01-introduction.html
│   ├── 02-getting-started.html
│   └── ...
├── assets/                        # 静的ファイル
│   ├── css/
│   │   ├── style.css              # 共通スタイル
│   │   └── theme.css              # テーマ
│   ├── js/
│   │   ├── main.js                # 共通JS
│   │   └── navigation.js          # ナビゲーション
│   └── images/
│       ├── diagrams/              # 図解
│       └── illustrations/         # イラスト
└── metadata.json                  # メタデータ
```

## テンプレート変数

### ページレベル
- `{{PAGE_TITLE}}` - ページタイトル
- `{{PROJECT_NAME}}` - プロジェクト名
- `{{TARGET_LEVEL}}` - 対象レベル
- `{{READING_TIME}}` - 読了時間

### セクションレベル
- `{{SECTION_TITLE}}` - セクションタイトル
- `{{SIMPLE_EXPLANATION}}` - 簡単な説明
- `{{DETAILED_CONTENT}}` - 詳細内容
- `{{DIAGRAM_URL}}` - 図解URL
- `{{EXAMPLE_CONTENT}}` - 具体例