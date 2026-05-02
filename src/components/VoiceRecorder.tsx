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
  const recognitionRef = useRef<any>(null)

  const startRecording = () => {
    // Use browser's built-in speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setStatus('Speech not supported. Try Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognitionRef.current = recognition
    
    let finalTranscript = ''

    recognition.onstart = () => {
      setIsRecording(true)
      setStatus('Recording... speak now')
      
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interim += transcript
        }
      }
      
      if (interim) {
        setStatus('Listening: ' + interim.substring(0, 30) + '...')
      }
    }

    recognition.onerror = (event: any) => {
      console.log('Speech error:', event.error)
      setStatus('Error: ' + event.error)
    }

    recognition.onend = () => {
      if (isRecording && finalTranscript) {
        onTranscript(finalTranscript)
        setStatus('Transcribed!')
      } else if (isRecording) {
        // Restart if still recording
        try { recognition.start() } catch(e) {}
      }
    }

    try {
      recognition.start()
    } catch(e) {
      setStatus('Error starting: ' + e)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setRecordingTime(0)
    setStatus('Tap mic to start')
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
        {isRecording ? 'Tap to stop' : 'Tap mic and speak (works in Chrome)'}
      </p>
    </div>
  )
}
