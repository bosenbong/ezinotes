import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'default-no-store'

export async function POST(request: NextRequest) {
  try {
    const { transcript, useAbbreviations = true, translate = false } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error - missing API key' }, { status: 500 })
    }

    // Build the prompt
    let systemPrompt = `You are a professional NDIS note writer. Format the following transcript into a clear, professional NDIS support note.`
    
    if (translate) {
      systemPrompt += ` The transcript is NOT in English. First translate it to English, then format as NDIS notes.`
    }

    if (useAbbreviations) {
      systemPrompt += ` Use common NDIS abbreviations where appropriate (e.g., S&D for Social & Domestic, Transport, W&B for Wellbeing).`
    }

    systemPrompt += `

Format:
Client: [Name]
Date/Time: [Start] – [End]
Service Type: [Type]

ACTIVITIES UNDERTAKEN:
[Brief description of what was done]

WELLBEING/OUTCOME:
- Client remained happy, healthy, and engaged
- All tasks completed successfully
- Client expressed satisfaction

DEPARTURE:
Left at [Time] on time.
Client safe and comfortable.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: transcript }
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: 'AI processing failed', details: error }, { status: 500 })
    }

    const data = await response.json()
    const polishedNote = data.choices[0]?.message?.content || ''

    return NextResponse.json({ note: polishedNote })
  } catch (error) {
    console.error('Polish error:', error)
    return NextResponse.json({ error: 'Internal server error: ' + String(error) }, { status: 500 })
  }
}
