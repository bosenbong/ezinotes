export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '32px 24px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>📄 Terms of Service</h1>
        
        <div style={{ color: '#444', lineHeight: 1.8 }}>
          <p><strong>Last updated:</strong> April 2026</p>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Acceptance of Terms</h2>
          <p>By using EziNotes, you agree to these terms.</p>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Use of Service</h2>
          <p>EziNotes is provided for creating NDIS support notes. You agree to:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Use the service lawfully</li>
            <li>Not attempt to break security</li>
            <li>Not abuse the service</li>
          </ul>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Accounts</h2>
          <p>You are responsible for maintaining the security of your account and for all activities under your account.</p>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Payment & Billing</h2>
          <p>Paid plans are billed monthly. You can cancel anytime via your account settings.</p>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Disclaimer</h2>
          <p>EziNotes provides AI-generated notes for reference. You are responsible for reviewing and editing notes before submission to ensure accuracy and compliance.</p>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Contact</h2>
          <p>Questions? Email us at hello@ezinotes.com</p>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to EziNotes</a>
        </div>
      </div>
    </main>
  )
}
