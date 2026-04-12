// Journal API - AI Opinion on entries

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { entryText, mood } = await request.json()
    
    if (!entryText) {
      return Response.json({ error: 'No entry provided' }, { status: 400 })
    }
    
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY
    
    if (!apiKey) {
      return Response.json({ 
        opinion: "AI Opinion: That's a pretty cool entry! Keep journaling! 🌟",
        reflectionPrompt: "Think about what you wrote - does this reflect how you really feel?"
      })
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
            content: `You are a supportive teen journal AI companion. Read the user's journal entry and give honest, warm, encouraging feedback.

Your response should be:
- Honest (not just generic praise)
- Relatable to a 13 year old
- Short (2-3 sentences max)
- Include a thoughtful reflection question at the end

Also add one relevant emoji.

Respond in a casual, friendly tone like a supportive friend.`
          },
          {
            role: 'user',
            content: `The user is feeling ${mood || 'uncertain'}. They wrote:\n\n${entryText}\n\nGive them an honest, thoughtful response.`
          }
        ]
      })
    })
    
    if (!response.ok) {
      return Response.json({ 
        opinion: "That's a really thoughtful entry! What made you feel that way? 🤔",
        reflectionPrompt: "Great job reflecting on your day!"
      })
    }
    
    const data = await response.json()
    const opinion = data.choices?.[0]?.message?.content || ''
    
    // Extract reflection question if AI included one
    const reflectionMatch = opinion.match(/\?([^?]*\?)?/);
    const reflectionPrompt = reflectionMatch ? reflectionMatch[0] : "What did you learn from this?";
    
    return Response.json({ opinion, reflectionPrompt })
    
  } catch (error) {
    return Response.json({ 
      opinion: "Thanks for sharing! That's really personal. 💙",
      reflectionPrompt: "How does writing this make you feel?"
    })
  }
}