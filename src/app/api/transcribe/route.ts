import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 })
    }

    // Get the audio data
    const buffer = await audioFile.arrayBuffer()
    
    // Create form data for Whisper
    const form = new FormData()
    form.append('file', new Blob([buffer], { type: 'audio/webm' }), 'audio.webm')
    form.append('model', 'whisper-1')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: form,
    })

    if (!response.ok) {
      const err = await response.text()
      console.log('Whisper error:', err)
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ transcript: data.text })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
