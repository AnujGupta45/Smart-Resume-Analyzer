import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('resumeHistory') || '[]')
    setHistory(saved)
  }, [])

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleView = (item) => {
    navigate('/results', { state: { data: item.data } })
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    const updated = history.filter(item => item.id !== id)
    localStorage.setItem('resumeHistory', JSON.stringify(updated))
    setHistory(updated)
  }

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all scan history?')) {
      localStorage.removeItem('resumeHistory')
      setHistory([])
    }
  }

  return (
    <div className="animate-in">
      <header className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="section-title">Scan History</h1>
          <p className="text-secondary">View and manage your past resume analyses.</p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-secondary" onClick={clearAll} style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
            🗑️ Clear All
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <div className="card text-center" style={{ padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📜</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No History Found</h2>
          <p className="text-secondary" style={{ marginBottom: '24px' }}>You haven't analyzed any resumes yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Start Your First Scan
          </button>
        </div>
      ) : (
        <div className="grid gap-4" style={{ display: 'grid', gap: '16px' }}>
          {history.map((item) => (
            <div 
              key={item.id} 
              className="card flex justify-between items-center clickable-card" 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onClick={() => handleView(item)}
            >
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '12px', 
                    background: item.score >= 70 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: item.score >= 70 ? 'var(--success)' : 'var(--warning)',
                    border: `1px solid ${item.score >= 70 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                  }}
                >
                  {item.score}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>{item.filename}</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>{formatDate(item.timestamp)}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>View Details →</span>
                <button 
                  onClick={(e) => handleDelete(item.id, e)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: '8px', 
                    cursor: 'pointer',
                    opacity: 0.6,
                    fontSize: '1.125rem'
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
