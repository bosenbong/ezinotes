import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create form data for Whisper API
    const FormData = await import('form-data')
    const form = new FormData.default()
    form.append('file', buffer, { filename: 'audio.webm', contentType: audioFile.type })
    form.append('model', 'whisper-1')
    form.append('response_format', 'json')

    // Call Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...form.getHeaders(),
      },
      body: form,
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: 'Transcription failed', details: error }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ transcript: data.text })
  } catch (error) {
    console.error('Transcribe error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
