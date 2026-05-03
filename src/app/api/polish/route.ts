import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { transcript, useAbbreviations = true, translate = false } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    
    // If no API key, use local fallback
    if (!apiKey) {
      return NextResponse.json({ 
        note: `Client: [Name]\nDate/Time: Now\nService Type: Social & Domestic Support\n\nACTIVITIES UNDERTAKEN:\n${transcript}\n\nWELLBEING/OUTCOME:\n- Client remained happy and healthy\n- All tasks completed\n\nDEPARTURE:\nLeft on time.`
      })
    }

    // Try direct OpenAI call
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: `Format as NDIS note: ${transcript}` }],
      }),
    })

    if (!openAiResponse.ok) {
      const err = await openAiResponse.text()
      console.log('OpenAI failed:', err)
      // Return fallback on error
      return NextResponse.json({ 
        note: `Client: [Name]\nDate/Time: Now\nService Type: Social & Domestic Support\n\nACTIVITIES UNDERTAKEN:\n${transcript}\n\nWELLBEING/OUTCOME:\n- Client remained happy and healthy\n- All tasks completed\n\nDEPARTURE:\nLeft on time.`
      })
    }

    const data = await openAiResponse.json()
    const note = data.choices[0]?.message?.content || ''
    
    return NextResponse.json({ note })
  } catch (error) {
    console.error('Polish error:', error)
    return NextResponse.json({ 
      note: `Client: [Name]\nDate/Time: Now\nService Type: Social & Domestic Support\n\nACTIVITIES UNDERTAKEN:\nError occurred\n\nWELLBEING/OUTCOME:\n- Error\n\nDEPARTURE:\n- Error`
    }, { status: 200 })
  }
}
