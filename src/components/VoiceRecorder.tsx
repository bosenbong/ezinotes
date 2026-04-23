'use client'

import { useState, useRef } from 'react'

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void
  isProcessing: boolean
}

export default function VoiceRecorder({ onTranscript, isProcessing }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState('Tap mic to start')
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000)
      setIsRecording(true)
      setStatus('Recording... speak now')
      
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
    } catch (err) {
      setStatus('Mic access denied')
      console.error(err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      setRecordingTime(0)
      setStatus('Processing...')
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.transcript) {
        setStatus('Transcribed!')
        onTranscript(data.transcript)
      } else {
        setStatus(data.error || 'Transcription failed')
      }
    } catch (err) {
      setStatus('Error processing audio')
      console.error(err)
    }
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: 'none',
          background: isRecording ? '#ef4444' : '#2563eb',
          color: 'white',
          fontSize: '48px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: isProcessing ? 0.6 : 1,
          boxShadow: '0 10px 25px rgba(37,99,235,0.4)',
        }}
      >
        {isRecording ? '⏹' : '🎤'}
      </button>
      
      {isRecording && (
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginTop: '10px' }}>
          {fmt(recordingTime)}
        </div>
      )}
      
      <p style={{ marginTop: '12px', color: '#666' }}>{status}</p>
      <p style={{ fontSize: '12px', color: '#999' }}>
        {isRecording ? 'Tap to stop' : 'Tap mic and speak (try Chrome)'}
      </p>
    </div>
  )
}
