// Chat API - Homework help and conversation

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { message, history } = await request.json()
    
    if (!message) {
      return Response.json({ error: 'No message provided' }, { status: 400 })
    }
    
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY
    
    if (!apiKey) {
      // Fallback responses without AI
      const lowerMessage = message.toLowerCase();
      
      let response = "That's a great question! ";
      
      if (lowerMessage.includes('math') || lowerMessage.includes('calculate')) {
        response += "For math problems, try breaking them down into smaller steps. What's the specific problem you're working on?";
      } else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry')) {
        response += "Science is awesome! What's the topic you're learning about?";
      } else if (lowerMessage.includes('history')) {
        response += "History is so interesting! What era or event are you studying?";
      } else if (lowerMessage.includes('write') || lowerMessage.includes('essay')) {
        response += "For writing, try starting with a simple outline. What's the topic?";
      } else if (lowerMessage.includes('help')) {
        response += "I'm here to help! What do you need help with?";
      } else {
        response += "Tell me more about what you're working on and I'll do my best to help!";
      }
      
      return Response.json({ response, done: false });
    }
    
    let url = 'https://api.openai.com/v1/chat/completions'
    let headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
    
    // Build conversation history
    let messages = [
      {
        role: 'system',
        content: `You are a helpful AI friend and homework helper for a 13 year old. 

Rules:
- Be friendly, casual, and relatable
- Use simple language, not too formal
- Add relevant emojis occasionally
- Help with homework, questions, creative writing, math, science, etc.
- If you don't know something, say so honestly
- Keep responses reasonably short (2-4 sentences usually)
- Never be mean or discouraging`
      }
    ];
    
    // Add history (last 6 messages)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    
    // Add current message
    messages.push({ role: 'user', content: message });
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 500
      })
    })
    
    if (!response.ok) {
      return Response.json({ response: "I'm having trouble thinking right now. Try again in a bit!", done: false });
    }
    
    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || "Hmm, I'm not sure how to respond to that.";
    
    return Response.json({ response: aiResponse, done: false })
    
  } catch (error) {
    return Response.json({ response: "Oops! Something went wrong. Try again!", done: false })
  }
}