import Pricing from '@/components/Pricing'

export default function PricingPage() {
  // In production, get user from session
  const userId = 'demo-user-123'
  const userEmail = 'demo@example.com'
  const currentPlan = 'free'

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <div style={{ background: '#2563eb', color: 'white', padding: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>📝 EziNotes</h1>
          <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px' }}>Simple pricing for NDIS support workers</p>
        </div>

        <Pricing userId={userId} userEmail={userEmail} currentPlan={currentPlan} />

        <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#666' }}>
          🔒 Secure payments via Stripe • Cancel anytime
        </div>
      </div>
    </main>
  )
}
