import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../api'
import AtsScore from '../components/AtsScore'
import KeywordCloud from '../components/KeywordCloud'
import SectionFeedback from '../components/SectionFeedback'
import Suggestions from '../components/Suggestions'
import './Results.css'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state?.data
  const [exporting, setExporting] = useState(false)

  if (!data) {
    return <Navigate to="/" replace />
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/export-report`,
        data,
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'ats_report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Failed to generate report. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('analysisResult')
    navigate('/')
  }

  if (!data) return null

  const scoreColor = data.ats_score >= 70 ? '#22c55e' : data.ats_score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="animate-in">
      <header className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="section-title">Analysis Results</h1>
          <p className="text-secondary">Comprehensive review of your resume's ATS performance.</p>
        </div>
        <div className="flex gap-3" style={{ display: 'flex', gap: '12px' }}>
          <button
            id="export-btn"
            className="btn btn-secondary"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Generating PDF...' : 'Download Report'}
          </button>
          <button
            id="new-analysis-btn"
            className="btn btn-primary"
            onClick={handleNewAnalysis}
          >
            New Scan
          </button>
        </div>
      </header>

      <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Main Score & Breakdown */}
        <div style={{ gridColumn: 'span 8' }}>
          <AtsScore score={data.ats_score} breakdown={data.score_breakdown} />
        </div>

        {/* Quick Tips / Small Summary */}
        <div style={{ gridColumn: 'span 4' }}>
          <div className="card h-full">
            <h3 className="text-primary font-bold mb-4" style={{ marginBottom: '16px' }}>Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</p>
                <p style={{ color: scoreColor, fontWeight: '700', fontSize: '1.25rem' }}>
                  {data.ats_score >= 80 ? 'Excellent' : data.ats_score >= 60 ? 'Strong' : 'Improvement Needed'}
                </p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Word Count</p>
                <p className="text-primary" style={{ fontWeight: '600' }}>{data.formatting_details?.word_count} words</p>
              </div>
              <div style={{ padding: '12px', background: '#18181b', borderRadius: '8px', fontSize: '0.8125rem' }}>
                <p className="text-secondary">
                  {data.ats_score >= 70 
                    ? "Your resume has a strong chance of passing automated filters. Focus on the missing key phrases to reach 90+."
                    : "Focus on adding missing sections and increasing keyword density to improve your visibility."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords Analysis */}
        <div style={{ gridColumn: 'span 12' }}>
          <KeywordCloud
            matched={data.matched_keywords}
            missing={data.missing_keywords}
          />
        </div>

        {/* Suggestions & Sections */}
        <div style={{ gridColumn: 'span 7' }}>
          <Suggestions suggestions={data.suggestions} />
        </div>
        <div style={{ gridColumn: 'span 5' }}>
          <SectionFeedback sections={data.sections} />
        </div>

        {/* Text Preview */}
        {data.resume_preview && (
          <div style={{ gridColumn: 'span 12' }}>
            <div className="card">
              <h3 className="text-primary font-bold mb-2">Extraction Preview</h3>
              <p className="text-muted mb-4" style={{ fontSize: '0.8125rem', marginBottom: '16px' }}>How our engine sees your resume text:</p>
              <pre className="preview-text" style={{ background: '#000', padding: '16px', borderRadius: '6px', fontSize: '0.75rem', opacity: '0.7', maxHeight: '150px', overflowY: 'auto' }}>
                {data.resume_preview}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

