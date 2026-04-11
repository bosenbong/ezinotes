// EziNotes Backend - Audio Transcription API

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')
    
    if (!audioFile) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const audioBase64 = buffer.toString('base64')
    
    // Using OpenAI directly via OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/whisper-1',
        file: `data:audio/webm;base64,${audioBase64}`,
        language: 'en'
      })
    })
    
    if (!response.ok) {
      const errText = await response.text()
      console.error('Whisper error:', errText)
      return Response.json({ 
        error: 'Transcription service unavailable',
        details: 'Please try again later'
      }, { status: 500 })
    }
    
    const result = await response.json()
    const transcript = result.text || ''
    
    if (!transcript) {
      return Response.json({ 
        error: 'No speech detected',
        transcript: ''
      })
    }
    
    // Format as NDIS note
    const formattedNote = formatNDISNote(transcript)
    
    return Response.json({ 
      transcript,
      formattedNote 
    })
    
  } catch (error) {
    console.error('API error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

function formatNDISNote(transcript) {
  if (!transcript || transcript.trim() === '') return ''
  
  const now = new Date()
  const date = now.toLocaleDateString('en-AU', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  })
  const time = now.toLocaleTimeString('en-AU', { 
    hour: '2-digit', minute: '2-digit', hour12: false 
  })
  
  let cleaned = transcript
    .replace(/\b(um|uh|er|ah)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  
  return `SESSION NOTE\nDate: ${date}\nTime: ${time}\n\nSUPPORT PROVIDED\n${cleaned}\n\nNOTES\nVoice note processed via EziNotes. Review before submitting.`
}