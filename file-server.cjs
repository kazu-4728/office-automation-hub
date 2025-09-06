const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const FILE_PATH = path.join(__dirname, 'github_workflows.zip');

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Workflows ZIP Download</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 10px;
        }
        .emoji {
            font-size: 48px;
            text-align: center;
            margin-bottom: 20px;
        }
        .download-btn {
            display: block;
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .download-btn:hover {
            transform: scale(1.05);
        }
        .info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .steps {
            background: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .steps ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .steps li {
            margin: 8px 0;
        }
        code {
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">📦</div>
        <h1>GitHub Actions Workflows</h1>
        
        <div class="info">
            <strong>ファイル名:</strong> github_workflows.zip<br>
            <strong>サイズ:</strong> 19 KB<br>
            <strong>内容:</strong> 4つのワークフローファイル
        </div>
        
        <a href="/download" class="download-btn">
            ⬇️ ZIPファイルをダウンロード
        </a>
        
        <div class="steps">
            <h3>📱 iPhoneでの使用方法:</h3>
            <ol>
                <li>上のボタンをタップしてダウンロード</li>
                <li>「ファイル」アプリで保存</li>
                <li>GitHub Codespacesを開く</li>
                <li>ZIPをアップロード</li>
                <li>以下のコマンドを実行:</li>
            </ol>
            <code>unzip github_workflows.zip && git add . && git commit -m "🚀 Activate workflows" && git push</code>
        </div>
        
        <div class="steps">
            <h3>📁 ZIPファイルの内容:</h3>
            <ul style="list-style: none; padding-left: 0;">
                <li>📄 .github/workflows/agent-main.yml</li>
                <li>📄 .github/workflows/task-scraping.yml</li>
                <li>📄 .github/workflows/task-pdf-ocr.yml</li>
                <li>📄 .github/workflows/task-slide-gen.yml</li>
            </ul>
        </div>
    </div>
</body>
</html>
    `);
  } else if (req.url === '/download') {
    if (fs.existsSync(FILE_PATH)) {
      const stat = fs.statSync(FILE_PATH);
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="github_workflows.zip"'
      });
      const readStream = fs.createReadStream(FILE_PATH);
      readStream.pipe(res);
    } else {
      res.writeHead(404);
      res.end('File not found');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`File server running on http://0.0.0.0:${PORT}`);
  console.log(`Download URL: http://0.0.0.0:${PORT}/download`);
});