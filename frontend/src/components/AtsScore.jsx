import { useEffect, useRef, useState } from 'react'
import './AtsScore.css'

const getScoreColor = (score) => {
  if (score >= 70) return '#22c55e'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Average'
  if (score >= 30) return 'Needs Work'
  return 'Poor'
}

export default function AtsScore({ score, breakdown }) {
  const [displayed, setDisplayed] = useState(0)
  const animRef = useRef(null)

  // Animate count up
  useEffect(() => {
    let start = 0
    const duration = 1400
    const step = (timestamp) => {
      if (!animRef.current) animRef.current = timestamp
      const progress = Math.min((timestamp - animRef.current) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplayed(Math.round(ease * score))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    return () => { animRef.current = null }
  }, [score])

  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayed / 100) * circumference
  const color = getScoreColor(score)

  const breakdownItems = [
    { label: 'Keyword Match', value: breakdown?.keyword_match ?? 0, max: 40 },
    { label: 'Section Completeness', value: breakdown?.section_completeness ?? 0, max: 30 },
    { label: 'Formatting', value: breakdown?.formatting ?? 0, max: 30 },
  ]

  return (
    <div className="card animate-in">
      <div className="flex gap-12" style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
        {/* Large Score Display */}
        <div style={{ textAlign: 'center', minWidth: '160px' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>ATS Score</p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ fontSize: '4.5rem', fontWeight: '800', color: scoreColor, lineHeight: '1' }}>{displayed}</span>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: '600', position: 'absolute', bottom: '12px', right: '-40px' }}>/100</span>
          </div>
          <p style={{ marginTop: '12px', fontSize: '0.875rem', fontWeight: '600', color: scoreColor, textTransform: 'uppercase' }}>
            {getScoreLabel(score)}
          </p>
        </div>

        {/* Vertical Divider */}
        <div style={{ width: '1px', height: '100px', background: 'var(--border)' }} />

        {/* Breakdown Details */}
        <div style={{ flex: 1 }}>
          <h3 className="text-primary font-bold mb-6" style={{ marginBottom: '24px', fontSize: '1rem' }}>Scoring Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {breakdownItems.map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem' }}>
                  <span className="text-secondary">{item.label}</span>
                  <span className="text-primary font-medium">{item.value} / {item.max}</span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ 
                      width: `${(item.value / item.max) * 100}%`,
                      background: item.label === 'Keyword Match' ? 'var(--accent)' : item.label === 'Formatting' ? 'var(--success)' : 'var(--accent-muted)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

