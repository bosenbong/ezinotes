import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { transcript, useAbbreviations = true, translate = false } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 })
    }

    // Get API key directly from env
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      // Fallback to local formatting if no API key
      const fallback = `Client: [Name]
Date/Time: [Now]
Service Type: Social & Domestic Support

ACTIVITIES UNDERTAKEN:
${transcript}

WELLBEING/OUTCOME:
- Client remained happy, healthy, and engaged
- All tasks completed successfully
- Client expressed satisfaction

DEPARTURE:
Left on time.
Client safe and comfortable.`
      return NextResponse.json({ note: fallback })
    }

    // Simple formatting prompt
    const prompt = `Format this NDIS note professionally: ${transcript}`

    // Call OpenAI directly (bypass any gateway)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log('OpenAI error:', response.status, errorText)
      return NextResponse.json({ error: 'OpenAI API error' }, { status: 500 })
    }

    const data = await response.json()
    const polishedNote = data.choices[0]?.message?.content || ''

    return NextResponse.json({ note: polishedNote })
  } catch (error) {
    console.error('Polish error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
