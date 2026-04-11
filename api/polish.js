// EziNotes API - Polish note with AI (OpenAI)

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { transcript } = await request.json()
    
    if (!transcript) {
      return Response.json({ error: 'No transcript provided' }, { status: 400 })
    }
    
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY
    
    if (!apiKey) {
      return Response.json({ error: 'API not configured' }, { status: 500 })
    }
    
    // Try OpenAI first, then OpenRouter
    let url = 'https://api.openai.com/v1/chat/completions'
    let headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an NDIS support note formatter. Convert raw voice notes into professional NDIS session notes.

Format exactly like this:
Client: [name from text]
Date/Time: [times from text]
Service Type: Social & Domestic Support / Transport

Activities Undertaken:
- [bullet points of what happened, past tense, professional]

Wellbeing/Outcome:
- [how client appeared, outcomes achieved]

Departure:
- [time left, client status]

Keep it factual, professional, NDIS-compliant.`
          },
          {
            role: 'user',
            content: `Convert this voice note to NDIS format:\n\n${transcript}`
          }
        ]
      })
    })
    
    if (!response.ok) {
      const err = await response.text()
      return Response.json({ error: 'AI failed', details: err }, { status: 500 })
    }
    
    const data = await response.json()
    const polished = data.choices?.[0]?.message?.content || ''
    
    return Response.json({ polishedNote: polished })
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}