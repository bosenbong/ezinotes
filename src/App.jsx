import { useState, useRef } from 'react'

const formatDateTime = () => {
  const now = new Date()
  return {
    date: now.toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' }),
    time: now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
}

const formatNDISNote = (transcript) => {
  if (!transcript) return ''
  const { date, time } = formatDateTime()
  return `SESSION NOTE\nDate: ${date}\nTime: ${time}\n\nSUPPORT PROVIDED\n${transcript}\n\nPARTICIPANT RESPONSE\nParticipant engaged positively with the support session.\n\nNOTES\nVoice note processed. Review for accuracy before submitting.`
}

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('Tap the mic to start')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const timerRef = useRef(null)
  const chunksRef = useRef([])

  const showToastMsg = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const startRecording = async () => {
    setStatus('🔄 Starting...')
    showToastMsg('Starting...')
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('❌ Not supported on this device')
      showToastMsg('Not supported on this device')
      return
    }
    
    try {
      setStatus('🔄 Requesting mic...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      showToastMsg('Mic granted!')
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(t => t.stop())
        setStatus('✅ Audio recorded!')
        showToastMsg('Recording saved!')
      }

      showToastMsg('Starting recorder...')
      try {
        mediaRecorder.start()
      } catch(e) {
        showToastMsg('Start error: ' + e.message)
      }
      setIsRecording(true)
      setStatus('🔴 Recording... Speak now')
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (e) {
      console.error('Mic error:', e)
      setStatus('❌ Mic error: ' + e.message)
      showToastMsg('Could not access microphone - check permissions')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const copyNote = () => {
    const formatted = formatNDISNote(transcript)
    navigator.clipboard.writeText(formatted).then(() => {
      showToastMsg('Copied to clipboard!')
    })
  }

  const saveNote = () => {
    const formatted = formatNDISNote(transcript)
    const blob = new Blob([formatted], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-note-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToastMsg('Saved to files!')
  }

  const formattedNote = formatNDISNote(transcript)
  const hasContent = transcript.trim().length > 0 || audioBlob

  return (
    <div className="app">
      <div className="header">
        <h1>📝 EziNotes</h1>
        <p>Voice to NDIS notes in seconds</p>
      </div>
      
      <div className="content">
        <div className="record-section">
          <button 
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
          
          {isRecording && (
            <div className="recording-timer">{formatTime(recordingTime)}</div>
          )}
          
          <p className="status">{status}</p>
          <p className="hint">{isRecording ? 'Tap ⏹ when done' : 'Tap mic and speak'}</p>
        </div>
        
        <div className="notes-section">
          <h3>Your Note</h3>
          <div className={`note-output ${!hasContent ? 'empty' : ''}`}>
            {audioBlob ? '📎 Audio recorded - backend needed for text' : (hasContent ? formattedNote : 'Your note will appear here...')}
          </div>
          
          {hasContent && (
            <div className="actions">
              <button className="action-btn copy" onClick={saveNote}>💾 Save</button>
              <button className="action-btn copy" onClick={copyNote}>📋 Copy</button>
              <button className="action-btn new" onClick={() => { setTranscript(''); setAudioBlob(null); setStatus('Tap the mic to start') }}>🔄 New</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="footer">🔒 Audio stays on your device • No data stored</div>
      
      {showToast && <div className="toast">{toastMessage}</div>}
    </div>
  )
}

export default App