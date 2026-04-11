// AI Game Maker API

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { prompt } = await request.json()
    
    if (!prompt) {
      return Response.json({ error: 'No prompt provided' }, { status: 400 })
    }
    
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return Response.json({ error: 'API not configured' }, { status: 500 })
    }
    
    // Generate game code using AI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a game code generator. Create fun, VISUALLY APPEALING games in p5.js JavaScript.

MAKE GAMES LOOK AWESOME:
- Use NICE COLORS: neon pink, cyan, purple, orange, gradients
- Add DETAILS to characters: eyes, outlines, effects
- Add PARTICLES: stars, sparks when things happen
- Add ANIMATION: things that pulse, wiggle smoothly
- Make backgrounds interesting with gradients or patterns
- Add cool SCORE displays with nice styling
- Make it FEEL like a real game!

Rules:
- Write COMPLETE, WORKING code
- Use p5.js: setup(), draw(), createCanvas(), ellipse(), rect(), fill(), background(), text(), push(), pop(), translate()
- Include player movement and game logic
- Add win/lose conditions
- Keep code under 150 lines
- Include helpful comments

Return ONLY the code, no explanation.`
          },
          {
            role: 'user',
            content: `Create a fun p5.js game for: ${prompt}

Write the full working code that can run in p5.js editor (editor.p5js.org)`
          }
        ]
      })
    })
    
    if (!response.ok) {
      const err = await response.text()
      return Response.json({ error: 'AI failed', details: err }, { status: 500 })
    }
    
    const data = await response.json()
    const gameCode = data.choices?.[0]?.message?.content || ''
    
    return Response.json({ gameCode })
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}