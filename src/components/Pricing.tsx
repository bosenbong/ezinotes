'use client'

interface PricingProps {
  userId: string
  userEmail?: string
  currentPlan?: string
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: ['5 notes per month', 'Basic formatting', 'English only', 'Email support'],
    cta: 'Current Plan',
    ctaStyle: 'secondary',
  },
  {
    id: 'solo',
    name: 'Solo',
    price: '$15',
    period: '/mo',
    features: ['Unlimited notes', 'AI polish', 'Abbreviations', 'English only', 'Priority support'],
    cta: 'Get Started',
    ctaStyle: 'primary',
  },
  {
    id: 'solo_plus',
    name: 'Solo+',
    price: '$19',
    period: '/mo',
    features: ['Everything in Solo', 'Multi-language input', 'Record in any language', 'Get English NDIS notes', 'Priority support'],
    cta: 'Get Started',
    ctaStyle: 'primary',
    highlight: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$29',
    period: '/mo',
    features: ['3 team members', 'Client management', 'Usage reports', 'Admin controls', 'Priority support'],
    cta: 'Contact Us',
    ctaStyle: 'secondary',
  },
]

export default function Pricing({ userId, userEmail, currentPlan = 'free' }: PricingProps) {
  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') return
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          userId,
          userEmail,
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Demo mode - connect Stripe to enable payments')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Demo mode - connect Stripe to enable payments')
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '24px' }}>Choose Your Plan</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '14px' }}>
        Start free, upgrade when ready
      </p>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: plan.highlight ? '2px solid #2563eb' : '1px solid #e5e7eb',
              background: plan.highlight ? '#eff6ff' : 'white',
              position: 'relative',
            }}
          >
            {plan.highlight && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '16px',
                background: '#2563eb',
                color: 'white',
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: '600',
              }}>
                POPULAR
              </span>
            )}
            
            <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>{plan.name}</h3>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{plan.price}</span>
              <span style={{ color: '#666', fontSize: '14px' }}>{plan.period}</span>
            </div>

            <ul style={{ margin: '0 0 20px', padding: '0 0 0 20px', fontSize: '13px', color: '#444' }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>{feature}</li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={currentPlan === plan.id}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: plan.ctaStyle === 'primary' ? '#2563eb' : '#e5e7eb',
                color: plan.ctaStyle === 'primary' ? 'white' : '#444',
                fontSize: '14px',
                fontWeight: '600',
                cursor: currentPlan === plan.id ? 'default' : 'pointer',
                opacity: currentPlan === plan.id ? 0.6 : 1,
              }}
            >
              {currentPlan === plan.id ? 'Current Plan' : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
