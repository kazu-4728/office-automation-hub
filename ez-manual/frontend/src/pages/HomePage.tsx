import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { InputType } from '@shared/types'

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedInput, setSelectedInput] = useState<InputType>('url')

  const handleStart = () => {
    navigate('/convert', { state: { inputType: selectedInput } })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            📚 EZ Manual Simplifier
          </h1>
          <p className="mt-2 text-gray-600">
            技術マニュアルを初心者にも分かりやすく変換
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            どんなマニュアルも、分かりやすく
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            GitHub DocsやPDFマニュアルを、小学生でも理解できる言葉と図解で説明します
          </p>
        </div>

        {/* Input Type Selection */}
        <div className="card max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6">入力形式を選択</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setSelectedInput('url')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedInput === 'url'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-2">🌐</div>
              <div className="font-semibold">URL</div>
              <div className="text-sm text-gray-600 mt-1">
                Webサイトのアドレス
              </div>
            </button>

            <button
              onClick={() => setSelectedInput('file')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedInput === 'file'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-2">📄</div>
              <div className="font-semibold">ファイル</div>
              <div className="text-sm text-gray-600 mt-1">
                PDF / Markdown
              </div>
            </button>

            <button
              onClick={() => setSelectedInput('video')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedInput === 'video'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-2">🎥</div>
              <div className="font-semibold">動画</div>
              <div className="text-sm text-gray-600 mt-1">
                チュートリアル動画
              </div>
            </button>
          </div>

          <button
            onClick={handleStart}
            className="btn btn-primary w-full text-lg py-3"
          >
            変換を開始 →
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">図解付き</h3>
            <p className="text-gray-600">
              複雑な概念も視覚的に分かりやすく説明
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">👶</div>
            <h3 className="text-xl font-semibold mb-2">平易な日本語</h3>
            <p className="text-gray-600">
              専門用語を分かりやすい言葉に変換
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">高速処理</h3>
            <p className="text-gray-600">
              AI技術で数分で変換完了
            </p>
          </div>
        </div>

        {/* Recent Projects Link */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/projects')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            過去の変換履歴を見る →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2025 EZ Manual Simplifier. Powered by Gemini Pro.
          </p>
        </div>
      </footer>
    </div>
  )
}
