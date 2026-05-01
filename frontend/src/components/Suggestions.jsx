import './Suggestions.css'

export default function Suggestions({ suggestions = [] }) {
  return (
    <div className="card animate-in" style={{ animationDelay: '0.35s' }}>
      <h2 className="sug-title">💡 Improvement Suggestions</h2>
      <p className="sug-sub">Actionable steps to boost your ATS score</p>

      <ul className="sug-list">
        {suggestions.map((tip, i) => (
          <li
            key={i}
            className="sug-item"
            style={{ animationDelay: `${0.4 + i * 0.06}s` }}
          >
            <span className="sug-bullet">{i + 1}</span>
            <span className="sug-text">{tip}</span>
          </li>
        ))}
      </ul>

      {suggestions.length === 0 && (
        <div className="sug-empty">🎉 Your resume looks great! No major suggestions.</div>
      )}
    </div>
  )
}
