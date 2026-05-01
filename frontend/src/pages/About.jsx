import profileImg from '../assets/profile.jpg'

export default function About() {
  return (
    <div className="animate-in">
      <header className="mb-8">
        <h1 className="section-title">About the Developer</h1>
        <p className="text-secondary">The mind behind Smart Resume Analyzer.</p>
      </header>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ flexShrink: 0 }}>
            <img 
              src={profileImg} 
              alt="Anuj Kumar Gupta" 
              style={{ 
                width: '200px', 
                height: '240px', 
                borderRadius: '12px', 
                objectFit: 'cover',
                border: '1px solid var(--border)'
              }} 
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Amlor Anuj Kumar Gupta
            </h2>
            <p className="text-secondary" style={{ fontSize: '1.125rem', marginBottom: '24px' }}>
              Full Stack Developer & AI Enthusiast
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', background: '#18181b' }}>
                <p className="text-primary" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                  Smart Resume Analyzer was built to bridge the gap between job seekers and Applicant Tracking Systems (ATS). 
                  By leveraging NLP and automated analysis, this tool helps professionals optimize their resumes for maximum impact.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a 
                  href="https://www.linkedin.com/in/anujgupta45/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '1.25rem' }}>🔗</span> View LinkedIn Profile
                </a>
                <a 
                  href="mailto:guptaanuj730@gmail.com" 
                  className="btn btn-secondary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  ✉️ Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
