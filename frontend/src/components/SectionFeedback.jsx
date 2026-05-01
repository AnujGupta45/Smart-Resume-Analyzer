import './SectionFeedback.css'

const SECTION_ICONS = {
  skills: '🛠️',
  experience: '💼',
  education: '🎓',
  projects: '🚀',
  summary: '👤',
}

export default function SectionFeedback({ sections = {} }) {
  const entries = Object.entries(sections)

  return (
    <div className="card animate-in" style={{ animationDelay: '0.25s' }}>
      <h2 className="sf-title">📋 Section Analysis</h2>
      <p className="sf-sub">Detected resume sections and improvement tips</p>

      <div className="sf-grid">
        {entries.map(([key, info]) => (
          <div key={key} className={`sf-card ${info.present ? 'present' : 'missing'}`}>
            <div className="sf-card-top">
              <span className="sf-icon">{SECTION_ICONS[key] || '📄'}</span>
              <div className="sf-meta">
                <h3 className="sf-name">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <span className={`badge ${info.present ? 'badge-success' : 'badge-danger'}`}>
                  {info.present ? '✓ Present' : '✗ Missing'}
                </span>
              </div>
            </div>
            <p className="sf-feedback">{info.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
