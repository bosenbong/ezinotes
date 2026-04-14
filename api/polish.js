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
            content: `You are an NDIS Support Worker. Convert raw voice notes into PROFESSIONAL, NDIS-COMPLIANT progress notes.

IMPORTANT RULES:
- Use participant initials (e.g., "P", "Participant") - NEVER real names (privacy law)
- Only include timestamps IF the user mentions a specific time (e.g., "at 9am", "at 11:30")
- DO NOT invent or assume timestamps - only use what the user says
- Write in OBJECTIVE, FACTUAL language only - NO judgments, opinions, or diagnoses
- Link activities to care goals (independence, wellbeing, participation)
- Use standard NDIS abbreviations where appropriate
- Structure: WELFARE CHECK → ACTIVITIES → OBSERVATIONS → OUTCOME → DEPARTURE

ABBREVIATIONS TO USE:
- P = Participant
- SW = Support Worker  
- ADL = Activities of Daily Living
- BM = Bowel Movement
- PRN = As needed
- WNL = Within Normal Limits
- NAD = No Abnormality Detected
- SOB = Shortness of Breath

EXAMPLE OUTPUT FORMAT:

[Date]
[Shift Time: e.g., 11:00am – 3:00pm]

WELFARE CHECK CONDUCTED:
[Time] - [Objective observation of participant condition on arrival]

ACTIVITIES UNDERTAKEN:
[Time] - [Specific task/activity performed]
[Time] - [Specific task/activity performed]
(Continue for each activity)

OBSERVATIONS:
- Mood/Presentation: [Objective description]
- Health Status: [Objective description, e.g., "Participant appeared well, WNL"]
- Engagement: [Objective description]
- Any other observations

OUTCOME:
- Goals addressed: [List relevant goals]
- Participant response: [Objective description]

DEPARTURE:
[Time] - [Participant condition/status on departure]
[Note on handover if applicable]

IMPORTANT EXAMPLES OF WHAT TO AVOID:
❌ "He seemed lazy" → MUST BE "Participant required prompting to engage in tasks"
❌ "He was depressed" → MUST BE "Participant presented with flat affect"
❌ "Good day" → MUST BE "Participant engaged positively throughout shift"
❌ Inventing timestamps → NEVER create times unless user says "at 9am", "around lunch", etc.
❌ Adding times not mentioned → Only include times the user explicitly mentions

Remember: These are LEGAL RECORDS. Be factual, professional, and compliant.`
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