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
            content: `You are an NDIS Support Worker. Convert raw voice notes into professional NDIS progress notes.

IMPORTANT RULES:
- Use participant initials or pseudonym (e.g., "S.G.", "Participant") - NEVER use real names for privacy (Australia NDIS)
- ONLY include timestamps IF the user explicitly mentions a time (e.g., "at 9am", "around lunch time"). DO NOT invent times.
- Use past tense, professional language
- Be detailed and specific about what happened at each time
- Include observations about mood, health, mobility, medications
- Format as a proper shift note

USE THIS EXACT STRUCTURE:

[Participant Initials]
[Date]
[Shift Time - e.g., "6am-4pm" or just write approximate]

[TIMESTAMP]
[Detailed description of what happened]

[TIMESTAMP]
[Detailed description]

...continue with timestamps throughout the day...

Observations & Notes
Mood: [participant's mood]
Health: [any health observations]
Mobility: [mobility notes, hoisting needs]
Medications: [medication administration notes]
Bowel Movement: [BM notes]
Shift Outcome: [summary of the shift]

Example output:
S.G.
11/11/2025
6:00 AM – 4:00 PM

6:00 AM:
Handover conducted with PM support worker, nil concerns overnight.

7:15 AM:
Support worker gently knocked and entered with consent. Participant was smiling and responsive. Engaged in conversation about her sleep and the day ahead. Agreed to morning bed bath.

7:45 AM:
Two support workers assisted with bathing. Skin integrity good, no inflammation noted. Medium bowel movement performed during bathing. Participant was cheerful and communicative.

...and so on throughout the shift...

Observations & Notes
Mood: Bright, relaxed, engaging
Health: No visible health concerns
Mobility: Hoisted safely (2 x SW assist)
Medications: Administered as per MAR
Bowel Movement: Medium BM noted
Shift Outcome: Positive engagement, all tasks completed safely`
          },
          {
            role: 'user',
            content: `Convert this voice note to professional NDIS format:\n\n${transcript}`
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