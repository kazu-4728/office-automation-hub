import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@pages/HomePage'
import ConversionPage from '@pages/ConversionPage'
import ResultPage from '@pages/ResultPage'
import ProjectsPage from '@pages/ProjectsPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/convert" element={<ConversionPage />} />
          <Route path="/result/:projectId" element={<ResultPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
