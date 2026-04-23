import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    const { plan, userId, userEmail } = await request.json()

    if (!plan || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Price IDs - replace with your actual Stripe price IDs
    const priceIds: Record<string, string> = {
      'solo': process.env.STRIPE_PRICE_SOLO || 'price_solo_xxx',
      'solo_plus': process.env.STRIPE_PRICE_SOLO_PLUS || 'price_solo_plus_xxx',
      'team': process.env.STRIPE_PRICE_TEAM || 'price_team_xxx',
    }

    const priceId = priceIds[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      customer_email: userEmail,
      metadata: {
        userId,
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
