import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'default-no-store'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create multipart form data manually
    const boundary = '----FormBoundary' + Math.random().toString(36).substring(2)
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio.webm"\r\nContent-Type: audio/webm\r\n\r\n`
    const footer = `\r\n--${boundary}--\r\n`
    const body = Buffer.concat([Buffer.from(header), buffer, Buffer.from(footer)])

    // Call Whisper API directly
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: body,
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
