export default function SuccessPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #10b981, #059669)', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#10b981' }}>Payment Successful!</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Thank you for upgrading. Your plan is now active.
        </p>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          Go to EziNotes
        </a>
      </div>
    </main>
  )
}
