import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import UploadZone from '../components/UploadZone'
import LoadingScreen from '../components/LoadingScreen'
import API_BASE_URL from '../api'
import './Home.css'

export default function Home() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload a resume PDF first.'); return }
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      if (jd.trim()) formData.append('jobDescription', jd.trim())

      const { data } = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })

      // Add to History
      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        filename: file.name,
        score: data.ats_score,
        data: data
      }
      
      const existingHistory = JSON.parse(localStorage.getItem('resumeHistory') || '[]')
      localStorage.setItem('resumeHistory', JSON.stringify([historyItem, ...existingHistory]))

      // Store result in navigate state instead of sessionStorage for cleaner results handling
      navigate('/results', { state: { data } })
    } catch (err) {
      const msg = err.response?.data?.error || 'Analysis failed. Make sure the backend is running.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <LoadingScreen />}

      <div className="animate-in">
        <header className="mb-8">
          <h1 className="section-title">Resume Analysis</h1>
          <p className="text-secondary">Upload your resume to get an instant ATS score and improvement tips.</p>
        </header>

        <div className="grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div className="card">
            <h2 className="upload-card-title mb-4">Resume File</h2>
            <UploadZone onFileSelect={setFile} file={file} />
            <div className="mt-4">
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                We support PDF format up to 10MB. Our AI parses text to analyze keywords and structure.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="upload-card-title mb-4">Job Description <span className="optional-tag">Recommended</span></h2>
            <textarea
              id="job-description"
              className="input-field w-full"
              style={{ width: '100%', minHeight: '180px', marginTop: '8px' }}
              placeholder="Paste the target job description here for highly accurate keyword matching..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
            <div className="flex justify-between mt-2" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>Optional, but improves accuracy.</span>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>{jd.length} chars</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="card mt-6" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginTop: '24px' }}>
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end" style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            id="analyze-btn"
            className="btn btn-primary"
            style={{ padding: '12px 32px', fontSize: '1rem' }}
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>
    </>
  )
}

