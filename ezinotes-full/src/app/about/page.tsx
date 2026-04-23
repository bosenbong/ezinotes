export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <div style={{ background: '#2563eb', color: 'white', padding: '32px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', margin: '0 0 8px' }}>📝 EziNotes</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>AI-Powered NDIS Note Taking</p>
        </div>

        <div style={{ padding: '32px 24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>About EziNotes</h2>
          <p style={{ color: '#444', lineHeight: 1.6, marginBottom: '24px' }}>
            EziNotes helps NDIS support workers create professional, compliant notes in seconds. 
            Simply record your voice, and our AI will transcribe and format it into clean NDIS notes.
          </p>

          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Key Features</h2>
          <ul style={{ color: '#444', lineHeight: 1.8, marginBottom: '24px', paddingLeft: '20px' }}>
            <li>🎤 Voice recording with automatic transcription</li>
            <li>✨ AI-powered NDIS-compliant formatting</li>
            <li>🌍 Multi-language support (record in any language, get English notes)</li>
            <li>📝 Abbreviations toggle for professional output</li>
            <li>📄 Export to PDF</li>
            <li>🔒 Secure Australian data storage</li>
          </ul>

          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Pricing</h2>
          <p style={{ color: '#444', lineHeight: 1.6, marginBottom: '24px' }}>
            <strong>Free:</strong> 5 notes/month<br />
            <strong>Solo:</strong> $15/month - Unlimited notes, AI polish, abbreviations<br />
            <strong>Solo+:</strong> $19/month - Everything in Solo + multi-language<br />
            <strong>Team:</strong> $29/month - 3 team members, client management
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/"
              style={{
                padding: '12px 24px',
                background: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Get Started
            </a>
            <a 
              href="/pricing"
              style={{
                padding: '12px 24px',
                background: '#f3f4f6',
                color: '#374151',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              View Pricing
            </a>
          </div>
        </div>

        <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#666' }}>
          © 2026 EziNotes • <a href="/privacy" style={{ color: '#2563eb' }}>Privacy Policy</a> • <a href="/terms" style={{ color: '#2563eb' }}>Terms of Service</a>
        </div>
      </div>
    </main>
  )
}
