import { useState } from 'react'

export default function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('Tap the mic to start')
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  
  let mediaRecorder = null
  let chunks = []
  let timer = null

  const show = (msg) => {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const startRecording = async () => {
    try {
      setStatus('Starting...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      show('Mic granted!')
      
      mediaRecorder = new MediaRecorder(stream)
      chunks = []
      
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        setStatus('Processing...')
        show('Transcribing...')
        
        // Send to API
        const formData = new FormData()
        formData.append('audio', new Blob(chunks), 'audio.webm'))
        
        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          })
          const data = await res.json()
          
          if (data.transcript) {
            setTranscript(data.transcript)
            setStatus('Done!')
            show('Note created!')
          } else {
            setStatus('Try again')
            show('Error: ' + (data.error || 'Failed'))
          }
        } catch (e) {
          setStatus('Error')
          show('Error: ' + e.message)
        }
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setStatus('Recording... speak now')
      show('Recording...')
      
      timer = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
      
    } catch (e) {
      setStatus('Error: ' + e.message)
      show('Mic error: ' + e.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      clearInterval(timer)
      setRecordingTime(0)
    }
  }

  const toggle = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const fmtNote = (t) => {
    if (!t) return ''
    const now = new Date()
    const date = now.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    const time = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false })
    return `SESSION NOTE\nDate: ${date}\nTime: ${time}\n\nSUPPORT PROVIDED\n${t}\n\nNOTES\nVoice note processed via EziNotes. Review before submitting.`
  }

  const copy = () => {
    navigator.clipboard.writeText(fmtNote(transcript))
    show('Copied!')
  }

  const save = () => {
    const blob = new Blob([fmtNote(transcript)], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `note-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    show('Saved!')
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>
        {/* Header */}
        <div style={{ background: '#2563eb', color: 'white', padding: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>📝 EziNotes</h1>
          <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px' }}>Voice to NDIS notes</p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Record Button */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button
              onClick={toggle}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: 'none',
                background: isRecording ? '#ef4444' : '#2563eb',
                color: 'white',
                fontSize: '48px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(37,99,235,0.4)',
                transition: 'transform 0.2s'
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
              {isRecording ? 'Tap to stop' : 'Tap mic and speak'}
            </p>
          </div>

          {/* Note Output */}
          <div>
            <h3 style={{ fontSize: '14px', color: '#666', textTransform: 'uppercase', marginBottom: '12px' }}>
              Your Note
            </h3>
            <div style={{
              background: '#f3f4f6',
              borderRadius: '12px',
              padding: '16px',
              minHeight: '100px',
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              color: transcript ? '#374151' : '#9ca3af',
              fontStyle: transcript ? 'normal' : 'italic'
            }}>
              {transcript ? fmtNote(transcript) : 'Your note will appear here...'}
            </div>
            
            {transcript && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={save} style={btnStyle}>💾 Save</button>
                <button onClick={copy} style={btnStyle}>📋 Copy</button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#666' }}>
          🔒 Audio stays on device • No data stored
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111827',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  )
}

const btnStyle = {
  flex: 1,
  padding: '14px',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  background: '#10b981',
  color: 'white'
}