// EziNotes Backend - Audio Transcription API
// Uses OpenAI Whisper for transcription, formats to NDIS notes

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')
    
    if (!audioFile) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Get base64 for API
    const audioBase64 = buffer.toString('base64')
    const audioMimeType = audioFile.type || 'audio/webm'
    
    // Call OpenAI Whisper via OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/whisper-1',
        file: `data:${audioMimeType};base64,${audioBase64}`,
        language: 'en'
      })
    })
    
    if (!response.ok) {
      const err = await response.text()
      console.error('Whisper error:', err)
      return Response.json({ error: 'Transcription failed', details: err }, { status: 500 })
    }
    
    const result = await response.json()
    const transcript = result.text || ''
    
    // Format as NDIS-compliant note
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
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
  const time = now.toLocaleTimeString('en-AU', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
  
  // Clean up transcript
  let cleaned = transcript
    .replace(/\b(um|uh|er|ah|like|you know)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  
  // Build NDIS-compliant note
  let note = `SESSION NOTE - NDIS\n`
  note += `─────────────────────\n`
  note += `DATE: ${date}\n`
  note += `TIME: ${time}\n\n`
  note += `SUPPORT PROVIDED\n`
  note += `${cleaned}\n\n`
  note += `PARTICIPANT RESPONSE\n`
  note += `Participant engaged positively with support session.\n`
  note += `Participant appeared receptive to support provided.\n\n`
  note += `FOLLOW-UP\n`
  note += `Continue with current support plan.\n`
  note += `Review progress at next session.\n\n`
  note += `NOTES\n`
  note += `Note created via EziNotes. Review before submitting.`
  
  return note
}