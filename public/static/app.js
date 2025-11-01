// Office Automation Hub - Main JavaScript

// ユーティリティ関数: デバウンス
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ユーティリティ関数: スロットル
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

class OfficeAutomationHub {
    constructor() {
        this.currentSection = 'dashboard';
        this.apiBase = '/api';
        this.eventHandlers = []; // イベントリスナーの追跡
        this.chatState = {
            messages: [],
            lastUpdate: null
        };
        this.init();
    }

    init() {
        // 保存された状態を復元
        this.restoreState();
        this.loadStats();
        this.initChart();
        this.setupEventListeners();
        this.setupMobileOptimizations();
        this.setupErrorHandling();
        this.setupStatePersistence();
        this.showSection('dashboard');
    }

    // 状態の永続化（チャット復旧用）
    setupStatePersistence() {
        // ページが閉じられる前に状態を保存
        const saveState = () => {
            try {
                const state = {
                    currentSection: this.currentSection,
                    chatState: this.chatState,
                    timestamp: Date.now()
                };
                localStorage.setItem('appState', JSON.stringify(state));
            } catch (e) {
                console.warn('状態の保存に失敗しました:', e);
            }
        };

        // beforeunloadイベントで保存
        const beforeUnloadHandler = (e) => {
            saveState();
            // モバイルでは beforeunload が動作しない場合があるため、
            // visibilitychange も使用
        };
        
        this.addEventListener(window, 'beforeunload', beforeUnloadHandler);

        // ページがバックグラウンドに移行する際にも保存
        const visibilityChangeHandler = () => {
            if (document.visibilityState === 'hidden') {
                saveState();
            } else if (document.visibilityState === 'visible') {
                // 復元チェック（5分以内の状態のみ）
                this.restoreState();
            }
        };
        
        this.addEventListener(document, 'visibilitychange', visibilityChangeHandler, { passive: true });

        // 定期的な自動保存（30秒ごと）
        setInterval(saveState, 30000);
    }

    restoreState() {
        try {
            const savedState = localStorage.getItem('appState');
            if (savedState) {
                const state = JSON.parse(savedState);
                // 5分以内の状態のみ復元
                if (Date.now() - state.timestamp < 5 * 60 * 1000) {
                    this.currentSection = state.currentSection || 'dashboard';
                    if (state.chatState) {
                        this.chatState = state.chatState;
                    }
                    console.log('状態を復元しました');
                } else {
                    // 古い状態は削除
                    localStorage.removeItem('appState');
                }
            }
        } catch (e) {
            console.warn('状態の復元に失敗しました:', e);
        }
    }

    // モバイル向け最適化
    setupMobileOptimizations() {
        // スクロールイベントの最適化（パッシブ + スロットル）
        const handleScroll = throttle(() => {
            // スクロール時の処理があればここに
        }, 100);

        this.addEventListener(window, 'scroll', handleScroll, { passive: true });

        // リサイズイベントの最適化（デバウンス）
        const handleResize = debounce(() => {
            // リサイズ時の処理（チャートの再描画など）
            if (this.chart) {
                this.chart.resize();
            }
        }, 250);

        this.addEventListener(window, 'resize', handleResize, { passive: true });

        // タッチイベントの最適化（誤タップ防止）
        let touchStartTime = 0;
        const touchStartHandler = (e) => {
            touchStartTime = Date.now();
        };

        const touchEndHandler = (e) => {
            const touchDuration = Date.now() - touchStartTime;
            // 300ms未満のタッチは誤タップの可能性がある
            if (touchDuration < 300) {
                // 必要に応じて処理をスキップ
            }
        };

        document.addEventListener('touchstart', touchStartHandler, { passive: true });
        document.addEventListener('touchend', touchEndHandler, { passive: true });
    }

    // グローバルエラーハンドリング
    setupErrorHandling() {
        // 未処理のエラーをキャッチ
        const errorHandler = (event) => {
            console.error('未処理のエラー:', event.error);
            // チャットがクラッシュしないように、エラーをログに記録するだけ
            // 必要に応じてエラー通知を表示
            try {
                if (typeof this.showNotification === 'function') {
                    this.showNotification('エラーが発生しましたが、作業は継続できます', 'error');
                }
            } catch (e) {
                // エラー通知自体が失敗した場合は何もしない
                console.warn('エラー通知の表示に失敗:', e);
            }
            // 状態を保存して復旧可能にする（直接saveStateを呼び出し）
            try {
                const state = {
                    currentSection: this.currentSection,
                    chatState: this.chatState,
                    timestamp: Date.now()
                };
                localStorage.setItem('appState', JSON.stringify(state));
            } catch (e) {
                console.warn('エラー時の状態保存に失敗:', e);
            }
        };

        this.addEventListener(window, 'error', errorHandler);
        this.addEventListener(window, 'unhandledrejection', (event) => {
            console.error('未処理のPromise拒否:', event.reason);
            errorHandler({ error: event.reason });
        });
    }

    // イベントリスナーの追加（追跡付き）
    addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        this.eventHandlers.push({ element, event, handler, options });
    }

    // すべてのイベントリスナーをクリーンアップ
    cleanup() {
        this.eventHandlers.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventHandlers = [];
    }

    // Navigation
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('bg-blue-700');
            link.classList.add('hover:bg-blue-500');
        });

        const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('bg-blue-700');
            activeLink.classList.remove('hover:bg-blue-500');
        }

        this.currentSection = sectionId;
    }

    // Load dashboard statistics（自動再接続機能付き）
    async loadStats(retryCount = 0) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒タイムアウト

            const response = await fetch(`${this.apiBase}/stats`, {
                signal: controller.signal,
                // モバイルでの接続品質を考慮
                cache: 'no-cache'
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const stats = await response.json();

            // DOM要素の存在確認
            const csvCountEl = document.getElementById('csv-processed-count');
            const emailCountEl = document.getElementById('email-sent-count');
            const filesCountEl = document.getElementById('files-organized-count');
            const reportsCountEl = document.getElementById('reports-generated-count');

            if (csvCountEl) csvCountEl.textContent = stats.csvProcessed || 0;
            if (emailCountEl) emailCountEl.textContent = stats.emailsSent || 0;
            if (filesCountEl) filesCountEl.textContent = stats.filesOrganized || 0;
            if (reportsCountEl) reportsCountEl.textContent = stats.reportsGenerated || 0;

            // 成功したらリトライカウントをリセット
            retryCount = 0;
        } catch (error) {
            console.error('統計データの読み込みに失敗しました:', error);
            
            // ネットワークエラーの場合、自動リトライ（最大3回）
            if (retryCount < 3 && (error.name === 'TypeError' || error.name === 'AbortError')) {
                setTimeout(() => {
                    this.loadStats(retryCount + 1);
                }, Math.pow(2, retryCount) * 1000); // 指数バックオフ: 1秒, 2秒, 4秒
            }
        }
    }

    // Initialize activity chart
    initChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['月', '火', '水', '木', '金', '土', '日'],
                datasets: [{
                    label: 'CSV処理',
                    data: [12, 19, 8, 15, 22, 8, 12],
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4
                }, {
                    label: 'メール送信',
                    data: [5, 12, 15, 8, 25, 12, 18],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4
                }, {
                    label: 'ファイル整理',
                    data: [8, 15, 12, 20, 18, 15, 10],
                    borderColor: 'rgb(234, 179, 8)',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Event listeners setup
    setupEventListeners() {
        // Navigation links（パッシブオプションは不要、クリックイベントなので）
        document.querySelectorAll('.nav-link').forEach(link => {
            const clickHandler = (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.showSection(sectionId);
            };
            this.addEventListener(link, 'click', clickHandler);
        });

        // CSV file input
        const csvFileInput = document.getElementById('csv-file-input');
        if (csvFileInput) {
            const changeHandler = (e) => {
                if (e.target.files.length > 0) {
                    this.previewCsvFile(e.target.files[0]);
                }
            };
            this.addEventListener(csvFileInput, 'change', changeHandler);
        }

        // Recipients file input
        const recipientsFileInput = document.getElementById('recipients-file-input');
        if (recipientsFileInput) {
            const changeHandler = (e) => {
                if (e.target.files.length > 0) {
                    this.previewRecipientsFile(e.target.files[0]);
                }
            };
            this.addEventListener(recipientsFileInput, 'change', changeHandler);
        }
    }

    // CSV Processing
    async previewCsvFile(file) {
        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            const rows = lines.slice(1, 6).map(line => line.split(',').map(cell => cell.trim()));

            let html = '<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr>';
            headers.forEach(header => {
                html += `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`;
            });
            html += '</tr></thead><tbody class="bg-white divide-y divide-gray-200">';
            
            rows.forEach((row, index) => {
                html += `<tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">`;
                row.forEach(cell => {
                    html += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cell}</td>`;
                });
                html += '</tr>';
            });
            
            html += '</tbody></table></div>';
            document.getElementById('csv-preview').innerHTML = html;
        } catch (error) {
            console.error('CSVプレビューエラー:', error);
            this.showNotification('CSVファイルの読み込みに失敗しました', 'error');
        }
    }

    async processCsvFile() {
        const fileInput = document.getElementById('csv-file-input');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showNotification('CSVファイルを選択してください', 'error');
            return;
        }

        this.showLoading();
        
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.apiBase}/csv/process`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayCsvStats(result.data);
                this.showNotification(result.message, 'success');
                this.loadStats(); // Refresh dashboard stats
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('CSV処理エラー:', error);
            this.showNotification('CSV処理中にエラーが発生しました', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayCsvStats(data) {
        let html = '';
        
        // Basic stats
        html += `
            <div class="bg-white p-4 rounded-lg border">
                <h4 class="font-medium text-gray-900 mb-2">基本情報</h4>
                <p class="text-sm text-gray-600">行数: ${data.totalRows}</p>
                <p class="text-sm text-gray-600">列数: ${data.totalColumns}</p>
            </div>
        `;

        // Column statistics
        if (Object.keys(data.summary).length > 0) {
            html += '<div class="bg-white p-4 rounded-lg border"><h4 class="font-medium text-gray-900 mb-2">数値列統計</h4>';
            Object.entries(data.summary).forEach(([column, stats]) => {
                html += `
                    <div class="mb-2">
                        <p class="text-sm font-medium text-gray-700">${column}</p>
                        <p class="text-xs text-gray-500">
                            最小: ${stats.min} | 最大: ${stats.max} | 平均: ${stats.avg.toFixed(2)}
                        </p>
                    </div>
                `;
            });
            html += '</div>';
        }

        document.getElementById('csv-stats').innerHTML = html;
    }

    // Email Functions
    async previewRecipientsFile(file) {
        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            const rows = lines.slice(1, 6).map(line => line.split(',').map(cell => cell.trim()));

            let html = '<div class="text-sm"><p class="font-medium mb-2">受信者プレビュー (最大5件)</p>';
            html += '<div class="space-y-1">';
            
            rows.forEach(row => {
                html += `<div class="flex justify-between py-1 border-b border-gray-200">`;
                html += `<span>${row[1] || 'N/A'}</span>`; // Name
                html += `<span class="text-gray-500">${row[0] || 'N/A'}</span>`; // Email
                html += `</div>`;
            });
            
            html += '</div></div>';
            document.getElementById('recipients-preview').innerHTML = html;
        } catch (error) {
            console.error('受信者ファイルプレビューエラー:', error);
            this.showNotification('受信者ファイルの読み込みに失敗しました', 'error');
        }
    }

    async previewEmail() {
        const subject = document.getElementById('email-subject').value;
        const body = document.getElementById('email-body').value;
        
        if (!subject || !body) {
            this.showNotification('件名と本文を入力してください', 'error');
            return;
        }

        // Simple template preview with sample data
        const sampleData = { 名前: '田中太郎', 会社名: '株式会社サンプル' };
        let previewBody = body;
        
        Object.entries(sampleData).forEach(([key, value]) => {
            previewBody = previewBody.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        alert(`件名: ${subject}\n\n本文:\n${previewBody}`);
    }

    async sendBulkEmail() {
        const subject = document.getElementById('email-subject').value;
        const body = document.getElementById('email-body').value;
        const fileInput = document.getElementById('recipients-file-input');
        
        if (!subject || !body) {
            this.showNotification('件名と本文を入力してください', 'error');
            return;
        }

        if (!fileInput.files[0]) {
            this.showNotification('受信者CSVファイルを選択してください', 'error');
            return;
        }

        this.showLoading();

        try {
            // Parse recipients file
            const text = await fileInput.files[0].text();
            const lines = text.split('\n').filter(line => line.trim());
            const recipients = lines.slice(1).map(line => {
                const [email, name, company] = line.split(',').map(cell => cell.trim());
                return { email, name, company };
            });

            const response = await fetch(`${this.apiBase}/email/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, body, recipients })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification(result.message, 'success');
                this.loadStats(); // Refresh dashboard stats
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('メール送信エラー:', error);
            this.showNotification('メール送信中にエラーが発生しました', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // File Management Functions
    async organizeFiles() {
        const rule = document.getElementById('organize-rule').value;
        
        this.showLoading();

        try {
            const response = await fetch(`${this.apiBase}/files/organize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rule })
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayFileStatus(result.data.results);
                this.showNotification(result.message, 'success');
                this.loadStats(); // Refresh dashboard stats
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('ファイル整理エラー:', error);
            this.showNotification('ファイル整理中にエラーが発生しました', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async renameFiles() {
        const pattern = document.getElementById('rename-pattern').value;
        
        if (!pattern) {
            this.showNotification('リネームパターンを入力してください', 'error');
            return;
        }

        this.showLoading();

        // Mock rename operation
        try {
            const mockFiles = ['file1.txt', 'file2.txt', 'file3.txt'];
            const results = mockFiles.map((file, index) => {
                const newName = pattern
                    .replace('{date}', new Date().toISOString().split('T')[0])
                    .replace('{number}', String(index + 1).padStart(3, '0'))
                    .replace('{original}', file.split('.')[0]);
                
                return {
                    original: file,
                    newName: newName + '.' + file.split('.')[1],
                    status: 'renamed'
                };
            });

            this.displayFileStatus(results);
            this.showNotification(`${results.length}個のファイルをリネームしました`, 'success');
        } catch (error) {
            console.error('ファイルリネームエラー:', error);
            this.showNotification('ファイルリネーム中にエラーが発生しました', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayFileStatus(results) {
        let html = '<div class="space-y-2">';
        results.forEach(result => {
            html += `
                <div class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    <span class="text-sm">${result.original}</span>
                    <span class="text-xs text-gray-500">${result.status}</span>
                </div>
            `;
        });
        html += '</div>';
        document.getElementById('file-status').innerHTML = html;
    }

    // Report Generation
    async generateReport() {
        const type = document.getElementById('report-type').value;
        const format = document.querySelector('input[name="output-format"]:checked').value;
        
        this.showLoading();

        try {
            const response = await fetch(`${this.apiBase}/reports/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, format })
            });

            const result = await response.json();
            
            if (result.success) {
                this.displayReportPreview(result.data);
                this.showNotification(result.message, 'success');
                this.loadStats(); // Refresh dashboard stats
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('レポート生成エラー:', error);
            this.showNotification('レポート生成中にエラーが発生しました', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayReportPreview(data) {
        const html = `
            <div class="text-center">
                <i class="fas fa-file-alt text-4xl text-green-600 mb-4"></i>
                <h4 class="text-lg font-medium text-gray-900 mb-2">${data.filename}</h4>
                <p class="text-sm text-gray-600 mb-2">種類: ${data.type}</p>
                <p class="text-sm text-gray-600 mb-4">サイズ: ${data.size}KB</p>
                <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                    <i class="fas fa-download mr-2"></i>ダウンロード
                </button>
            </div>
        `;
        document.getElementById('report-preview').innerHTML = html;
    }

    // UI Utilities
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageElement = document.getElementById('notification-message');
        
        messageElement.textContent = message;
        
        // Set color based on type
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
}

// Global functions for onclick handlers
let automationHub;

function showSection(sectionId) {
    automationHub.showSection(sectionId);
}

function processCsvFile() {
    automationHub.processCsvFile();
}

function previewEmail() {
    automationHub.previewEmail();
}

function sendBulkEmail() {
    automationHub.sendBulkEmail();
}

function organizeFiles() {
    automationHub.organizeFiles();
}

function renameFiles() {
    automationHub.renameFiles();
}

function generateReport() {
    automationHub.generateReport();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        automationHub = new OfficeAutomationHub();
    } catch (error) {
        console.error('初期化エラー:', error);
        // エラーが発生しても基本的な機能は動作するように
        // 必要に応じて最小限の初期化を行う
    }
});

// ページアンロード時にクリーンアップ
window.addEventListener('beforeunload', () => {
    if (automationHub && typeof automationHub.cleanup === 'function') {
        automationHub.cleanup();
    }
});