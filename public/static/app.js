// Office Automation Hub - Main JavaScript
class OfficeAutomationHub {
    constructor() {
        this.currentSection = 'dashboard';
        this.apiBase = '/api';
        this.init();
    }

    init() {
        this.loadStats();
        this.initChart();
        this.setupEventListeners();
        this.showSection('dashboard');
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

    // Load dashboard statistics
    async loadStats() {
        try {
            const response = await fetch(`${this.apiBase}/stats`);
            const stats = await response.json();

            document.getElementById('csv-processed-count').textContent = stats.csvProcessed;
            document.getElementById('email-sent-count').textContent = stats.emailsSent;
            document.getElementById('files-organized-count').textContent = stats.filesOrganized;
            document.getElementById('reports-generated-count').textContent = stats.reportsGenerated;
        } catch (error) {
            console.error('統計データの読み込みに失敗しました:', error);
        }
    }

    // Initialize activity chart
    initChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        const chart = new Chart(ctx, {
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
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.showSection(sectionId);
            });
        });

        // CSV file input
        const csvFileInput = document.getElementById('csv-file-input');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.previewCsvFile(e.target.files[0]);
                }
            });
        }

        // Recipients file input
        const recipientsFileInput = document.getElementById('recipients-file-input');
        if (recipientsFileInput) {
            recipientsFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.previewRecipientsFile(e.target.files[0]);
                }
            });
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
    automationHub = new OfficeAutomationHub();
});