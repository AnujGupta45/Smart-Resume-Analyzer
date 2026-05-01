import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Results from './pages/Results'
import About from './pages/About'
import History from './pages/History'

export default function App() {
  return (
    <>
      <Sidebar />
      <div className="app-container">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

