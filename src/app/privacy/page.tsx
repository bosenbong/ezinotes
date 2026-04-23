export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '32px 24px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>🔒 Privacy Policy</h1>
        
        <div style={{ color: '#444', lineHeight: 1.8 }}>
          <p><strong>Last updated:</strong> April 2026</p>
          
          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Data We Collect</h2>
          <p>We collect only what's necessary to provide our service:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Account information (email, name)</li>
            <li>Voice recordings (processed but not stored long-term)</li>
            <li>NDIS notes you create</li>
            <li>Client information you add</li>
          </ul>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Data Storage</h2>
          <p>All data is stored on servers located in Australia (Sydney region) to comply with NDIS data requirements.</p>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Data Sharing</h2>
          <p>We do not share your data with third parties except as necessary to provide our service (e.g., OpenAI for transcription).</p>

          <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Your Rights</h2>
          <p>You can:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Export all your data</li>
            <li>Delete your account and all associated data</li>
            <li>Request access to your data</li>
          </ul>

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
