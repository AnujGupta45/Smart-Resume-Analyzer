import './LoadingScreen.css'

export default function LoadingScreen() {
  const steps = [
    { icon: '📄', label: 'Parsing PDF...' },
    { icon: '🔍', label: 'Extracting keywords...' },
    { icon: '🧠', label: 'Running NLP analysis...' },
    { icon: '📊', label: 'Calculating ATS score...' },
  ]

  return (
    <div className="loading-overlay animate-fade-in">
      <div className="loading-card glass">
        <div className="loading-spinner-wrap">
          <div className="loading-spinner" />
          <div className="loading-spinner-inner" />
        </div>

        <h2 className="loading-title">Analyzing your resume</h2>
        <p className="loading-sub">Our AI engine is reviewing every detail…</p>

        <div className="loading-steps">
          {steps.map((step, i) => (
            <div key={i} className="loading-step" style={{ animationDelay: `${i * 0.6}s` }}>
              <span className="step-icon">{step.icon}</span>
              <span className="step-label">{step.label}</span>
              <span className="step-dots">
                <span /><span /><span />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
