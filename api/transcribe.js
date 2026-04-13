// Whisper API - Audio transcription

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')
    
    if (!audioFile) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 })
    }
    
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return Response.json({ error: 'API not configured' }, { status: 500 })
    }
    
    // Convert to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Get original filename/type
    const fileName = audioFile.name || 'audio.webm'
    let mimeType = 'audio/webm'
    if (fileName.endsWith('.mp4') || fileName.endsWith('.m4a')) mimeType = 'audio/mp4'
    if (fileName.endsWith('.ogg')) mimeType = 'audio/ogg'
    
    // Create form data for OpenAI
    const form = new FormData()
    const blob = new Blob([buffer], { type: mimeType })
    form.append('file', blob, fileName)
    form.append('model', 'whisper-1')
    form.append('language', 'en')
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: form
    })
    
    if (!response.ok) {
      const err = await response.text()
      return Response.json({ error: 'Transcription failed', details: err }, { status: 500 })
    }
    
    const data = await response.json()
    const transcript = data.text || ''
    
    return Response.json({ transcript })
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}