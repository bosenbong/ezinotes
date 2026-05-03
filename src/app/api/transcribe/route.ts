import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create multipart form data
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2)
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from('Content-Disposition: form-data; name="file"; filename="audio.webm"\r\n'),
      Buffer.from('Content-Type: audio/webm\r\n\r\n'),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ])

    // Call Whisper directly
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: body,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Whisper error:', response.status, errorText)
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ transcript: data.text })
  } catch (error) {
    console.error('Transcribe error:', error)
    return NextResponse.json({ error: 'Error: ' + String(error) }, { status: 500 })
  }
}
