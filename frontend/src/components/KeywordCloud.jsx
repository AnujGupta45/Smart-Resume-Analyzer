import './KeywordCloud.css'

export default function KeywordCloud({ matched = [], missing = [] }) {
  const hasJD = matched.length > 0 || missing.length > 0

  return (
    <div className="card animate-in" style={{ animationDelay: '0.25s' }}>
      <div className="keyword-header">
        <h2 className="keyword-title">🔑 Keyword Analysis</h2>
        {hasJD && (
          <div className="keyword-legend">
            <span className="legend-item legend-matched">✓ Matched</span>
            <span className="legend-item legend-missing">✗ Missing</span>
          </div>
        )}
      </div>

      {!hasJD && (
        <div className="keyword-empty">
          <p>📋 No job description provided — upload a JD to see detailed keyword matching.</p>
          <p style={{ marginTop: 8, fontSize: '0.85rem' }}>Showing top resume keywords instead:</p>
          <div className="chip-group" style={{ marginTop: 12 }}>
            {matched.map((kw) => (
              <span key={kw} className="chip chip-matched">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {hasJD && (
        <div className="keyword-sections">
          <div className="keyword-section">
            <div className="kw-section-header">
              <span className="kw-section-icon matched-icon">✅</span>
              <h3 className="kw-section-title">Matched Keywords</h3>
              <span className="kw-count matched-count">{matched.length}</span>
            </div>
            <div className="chip-group">
              {matched.length > 0
                ? matched.map((kw) => (
                    <span key={kw} className="chip chip-matched">✓ {kw}</span>
                  ))
                : <span className="kw-none">No matching keywords found</span>
              }
            </div>
          </div>

          <div className="kw-divider" />

          <div className="keyword-section">
            <div className="kw-section-header">
              <span className="kw-section-icon missing-icon">❌</span>
              <h3 className="kw-section-title">Missing Keywords</h3>
              <span className="kw-count missing-count">{missing.length}</span>
            </div>
            <div className="chip-group">
              {missing.length > 0
                ? missing.map((kw) => (
                    <span key={kw} className="chip chip-missing">✗ {kw}</span>
                  ))
                : <span className="kw-none" style={{ color: 'var(--success)' }}>🎉 All keywords matched!</span>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
