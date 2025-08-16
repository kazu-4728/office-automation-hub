import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API endpoints
app.use('/api/*', cors())

// Serve static files from public/static directory
app.use('/static/*', serveStatic({ root: './public' }))

// Main application HTML
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub Actions AI Agent Hub - 自動化エージェントシステム</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50 font-sans">
        <!-- Navigation Bar -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <i class="fas fa-robot text-2xl mr-3"></i>
                        <h1 class="text-xl font-bold">AI Agent Hub</h1>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            <a href="#dashboard" class="nav-link px-3 py-2 rounded-md text-sm font-medium bg-blue-700">
                                <i class="fas fa-tachometer-alt mr-2"></i>ダッシュボード
                            </a>
                            <a href="#agent-control" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">
                                <i class="fas fa-robot mr-2"></i>エージェント制御
                            </a>
                            <a href="#task-monitor" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">
                                <i class="fas fa-tasks mr-2"></i>タスク監視
                            </a>
                            <a href="#workflow-history" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">
                                <i class="fas fa-history mr-2"></i>実行履歴
                            </a>
                            <a href="#results-viewer" class="nav-link px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">
                                <i class="fas fa-eye mr-2"></i>結果閲覧
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <!-- Dashboard Section -->
            <div id="dashboard" class="section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">
                        <i class="fas fa-robot text-blue-600 mr-3"></i>
                        AIエージェントダッシュボード
                    </h2>
                    <p class="text-gray-600">GitHub Actionsベースの自動化エージェントシステム</p>
                </div>

                <!-- Agent Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-spider text-indigo-600 text-2xl"></i>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">スクレイピング実行数</dt>
                                        <dd class="text-lg font-medium text-gray-900" id="scraping-count">0</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-file-pdf text-green-600 text-2xl"></i>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">PDF処理数</dt>
                                        <dd class="text-lg font-medium text-gray-900" id="pdf-processed-count">0</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-presentation text-yellow-600 text-2xl"></i>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">スライド生成数</dt>
                                        <dd class="text-lg font-medium text-gray-900" id="slides-generated-count">0</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-robot text-red-600 text-2xl"></i>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">アクティブエージェント</dt>
                                        <dd class="text-lg font-medium text-gray-900" id="active-agents-count">1</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white shadow rounded-lg p-6 mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">クイックアクション</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button onclick="showSection('csv-tools')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md text-sm font-medium transition">
                            <i class="fas fa-file-csv mr-2"></i>CSV処理を開始
                        </button>
                        <button onclick="showSection('email-tools')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-medium transition">
                            <i class="fas fa-envelope mr-2"></i>メール送信
                        </button>
                        <button onclick="showSection('file-tools')" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-md text-sm font-medium transition">
                            <i class="fas fa-folder mr-2"></i>ファイル整理
                        </button>
                        <button onclick="showSection('report-tools')" class="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md text-sm font-medium transition">
                            <i class="fas fa-chart-bar mr-2"></i>レポート作成
                        </button>
                    </div>
                </div>

                <!-- Activity Chart -->
                <div class="bg-white shadow rounded-lg p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">自動化アクティビティ</h3>
                    <canvas id="activityChart" width="400" height="200"></canvas>
                </div>
            </div>

            <!-- CSV Tools Section -->
            <div id="csv-tools" class="section hidden">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">
                        <i class="fas fa-file-csv text-indigo-600 mr-3"></i>
                        CSV処理自動化
                    </h2>
                    <p class="text-gray-600">CSVファイルの読み込み、変換、統計処理を自動化</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- CSV Upload -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <i class="fas fa-upload mr-2"></i>CSVファイルアップロード
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">CSVファイルを選択</label>
                                <input type="file" id="csv-file-input" accept=".csv" 
                                       class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                            </div>
                            <button onclick="processCsvFile()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                <i class="fas fa-cogs mr-2"></i>CSV処理開始
                            </button>
                        </div>
                    </div>

                    <!-- CSV Preview -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <i class="fas fa-eye mr-2"></i>データプレビュー
                        </h3>
                        <div id="csv-preview" class="overflow-x-auto">
                            <p class="text-gray-500 text-center py-8">CSVファイルをアップロードしてください</p>
                        </div>
                    </div>
                </div>

                <!-- CSV Statistics -->
                <div class="bg-white shadow rounded-lg p-6 mt-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        <i class="fas fa-chart-line mr-2"></i>データ統計
                    </h3>
                    <div id="csv-stats" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <p class="text-gray-500 text-center py-8 col-span-3">データを処理すると統計が表示されます</p>
                    </div>
                </div>
            </div>

            <!-- Email Tools Section -->
            <div id="email-tools" class="section hidden">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">
                        <i class="fas fa-envelope text-green-600 mr-3"></i>
                        メール自動送信
                    </h2>
                    <p class="text-gray-600">一括メール送信とテンプレート管理</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Email Compose -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <i class="fas fa-edit mr-2"></i>メール作成
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">件名</label>
                                <input type="text" id="email-subject" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                       placeholder="メールの件名を入力">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">本文</label>
                                <textarea id="email-body" rows="6" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                          placeholder="メール本文を入力してください&#10;&#10;変数を使用できます：&#10;{{名前}} - 受信者の名前&#10;{{会社名}} - 受信者の会社名"></textarea>
                            </div>
                            <button onclick="previewEmail()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                <i class="fas fa-eye mr-2"></i>プレビュー
                            </button>
                        </div>
                    </div>

                    <!-- Recipients -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <i class="fas fa-users mr-2"></i>送信先管理
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">受信者CSV</label>
                                <input type="file" id="recipients-file-input" accept=".csv"
                                       class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100">
                                <p class="text-sm text-gray-500 mt-1">必要列: メールアドレス, 名前, 会社名</p>
                            </div>
                            <div id="recipients-preview" class="max-h-48 overflow-y-auto">
                                <p class="text-gray-500 text-center py-4">CSVファイルをアップロードしてください</p>
                            </div>
                            <button onclick="sendBulkEmail()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                <i class="fas fa-paper-plane mr-2"></i>一括送信実行
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- File Tools Section -->
            <div id="file-tools" class="section hidden">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">
                        <i class="fas fa-folder text-yellow-600 mr-3"></i>
                        ファイル管理自動化
                    </h2>
                    <p class="text-gray-600">ファイル整理、リネーム、バックアップの自動化</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- File Organization -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <i class="fas fa-sort-amount-up mr-2"></i>ファイル整理
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">整理ルール</label>
                                <select id="organize-rule" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                    <option value="extension">拡張子別</option>
                                    <option value="date">作成日別</option>
                                    <option value="size">サイズ別</option>
                                    <option value="name">名前別（A-Z）</option>
                                </select>
                            </div>
                            <button onclick="organizeFiles()" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                <i class="fas fa-magic mr-2"></i>自動整理開始
                            </button>
                        </div>
                    </div>

                    <!-- File Rename -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <i class="fas fa-i-cursor mr-2"></i>一括リネーム
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">リネームパターン</label>
                                <input type="text" id="rename-pattern" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                       placeholder="例: 会議資料_{date}_{number}">
                                <p class="text-sm text-gray-500 mt-1">使用可能: {date}, {number}, {original}</p>
                            </div>
                            <button onclick="renameFiles()" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                <i class="fas fa-edit mr-2"></i>一括リネーム実行
                            </button>
                        </div>
                    </div>
                </div>

                <!-- File Status -->
                <div class="bg-white shadow rounded-lg p-6 mt-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        <i class="fas fa-list mr-2"></i>処理状況
                    </h3>
                    <div id="file-status" class="space-y-2">
                        <p class="text-gray-500 text-center py-4">処理を開始すると状況が表示されます</p>
                    </div>
                </div>
            </div>

            <!-- Report Tools Section -->
            <div id="report-tools" class="section hidden">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">
                        <i class="fas fa-chart-bar text-red-600 mr-3"></i>
                        レポート自動生成
                    </h2>
                    <p class="text-gray-600">データからPDF・Excelレポートを自動生成</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Report Config -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <i class="fas fa-cog mr-2"></i>レポート設定
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">レポート種類</label>
                                <select id="report-type" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                                    <option value="sales">売上レポート</option>
                                    <option value="attendance">勤怠レポート</option>
                                    <option value="inventory">在庫レポート</option>
                                    <option value="custom">カスタムレポート</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">出力形式</label>
                                <div class="flex space-x-4">
                                    <label class="inline-flex items-center">
                                        <input type="radio" name="output-format" value="pdf" class="form-radio text-red-600" checked>
                                        <span class="ml-2">PDF</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input type="radio" name="output-format" value="excel" class="form-radio text-red-600">
                                        <span class="ml-2">Excel</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input type="radio" name="output-format" value="csv" class="form-radio text-red-600">
                                        <span class="ml-2">CSV</span>
                                    </label>
                                </div>
                            </div>
                            <button onclick="generateReport()" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                <i class="fas fa-file-alt mr-2"></i>レポート生成
                            </button>
                        </div>
                    </div>

                    <!-- Report Preview -->
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <i class="fas fa-eye mr-2"></i>プレビュー
                        </h3>
                        <div id="report-preview" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <i class="fas fa-file-alt text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-500">レポートを生成するとプレビューが表示されます</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Notification Toast -->
        <div id="notification" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hidden transform transition-transform duration-300">
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span id="notification-message">操作が完了しました</span>
            </div>
        </div>

        <!-- Loading Spinner -->
        <div id="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <div class="flex items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    <span class="text-gray-700">処理中...</span>
                </div>
            </div>
        </div>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// API Routes for automation tools

// CSV Processing API
app.post('/api/csv/process', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ error: 'ファイルが選択されていません' }, 400)
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    const rows = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim())
    )

    // Generate basic statistics
    const stats = {
      totalRows: rows.length,
      totalColumns: headers.length,
      headers: headers,
      sampleData: rows.slice(0, 5),
      summary: {}
    }

    // Calculate column statistics for numeric columns
    headers.forEach((header, index) => {
      const values = rows.map(row => row[index]).filter(val => val && !isNaN(Number(val)))
      if (values.length > 0) {
        const numbers = values.map(Number)
        stats.summary[header] = {
          count: numbers.length,
          min: Math.min(...numbers),
          max: Math.max(...numbers),
          avg: numbers.reduce((a, b) => a + b, 0) / numbers.length
        }
      }
    })

    return c.json({
      success: true,
      data: stats,
      message: 'CSV処理が完了しました'
    })

  } catch (error) {
    return c.json({ error: 'CSV処理中にエラーが発生しました: ' + error.message }, 500)
  }
})

// Email Sending API (Mock implementation)
app.post('/api/email/send', async (c) => {
  try {
    const { subject, body, recipients } = await c.req.json()
    
    // Mock email sending - in real implementation, integrate with email service
    const results = recipients.map((recipient, index) => ({
      email: recipient.email,
      name: recipient.name,
      status: Math.random() > 0.1 ? 'success' : 'failed', // 90% success rate
      sent_at: new Date().toISOString()
    }))

    const successCount = results.filter(r => r.status === 'success').length
    
    return c.json({
      success: true,
      data: {
        total: recipients.length,
        sent: successCount,
        failed: recipients.length - successCount,
        results: results
      },
      message: `${successCount}件のメールを送信しました`
    })

  } catch (error) {
    return c.json({ error: 'メール送信中にエラーが発生しました: ' + error.message }, 500)
  }
})

// File Organization API (Mock implementation)
app.post('/api/files/organize', async (c) => {
  try {
    const { rule } = await c.req.json()
    
    // Mock file organization
    const mockFiles = [
      'document1.pdf', 'image1.jpg', 'spreadsheet1.xlsx', 
      'document2.pdf', 'image2.png', 'presentation1.pptx'
    ]
    
    const organized = mockFiles.map(file => ({
      original: file,
      newLocation: `${rule}/${file}`,
      status: 'moved'
    }))

    return c.json({
      success: true,
      data: {
        rule: rule,
        filesProcessed: organized.length,
        results: organized
      },
      message: `${organized.length}個のファイルを整理しました`
    })

  } catch (error) {
    return c.json({ error: 'ファイル整理中にエラーが発生しました: ' + error.message }, 500)
  }
})

// Report Generation API (Mock implementation)
app.post('/api/reports/generate', async (c) => {
  try {
    const { type, format } = await c.req.json()
    
    // Mock report generation
    const reportData = {
      type: type,
      format: format,
      generated_at: new Date().toISOString(),
      filename: `${type}_report_${Date.now()}.${format}`,
      size: Math.floor(Math.random() * 1000) + 100 // KB
    }

    return c.json({
      success: true,
      data: reportData,
      message: `${type}レポートを生成しました`
    })

  } catch (error) {
    return c.json({ error: 'レポート生成中にエラーが発生しました: ' + error.message }, 500)
  }
})

// Statistics API
app.get('/api/stats', (c) => {
  // Mock statistics - in real implementation, get from database
  return c.json({
    csvProcessed: Math.floor(Math.random() * 100) + 50,
    emailsSent: Math.floor(Math.random() * 500) + 200,
    filesOrganized: Math.floor(Math.random() * 200) + 100,
    reportsGenerated: Math.floor(Math.random() * 50) + 25
  })
})

export default app
