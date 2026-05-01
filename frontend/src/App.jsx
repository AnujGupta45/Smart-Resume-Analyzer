import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Results from './pages/Results'
import About from './pages/About'

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
          </Routes>
        </main>
      </div>
    </>
  )
}

