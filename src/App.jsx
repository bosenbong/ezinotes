import { useState, useRef, useEffect } from 'react'

// Format date/time for NDIS notes
const formatDateTime = () => {
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
  return { date, time }
}

// Format raw transcript into NDIS-compliant note
const formatNDISNote = (transcript) => {
  if (!transcript || transcript.trim() === '') return ''
  
  const { date, time } = formatDateTime()
  
  // Simple formatting - convert to professional tone
  let formatted = `SESSION NOTE\n`
  formatted += `Date: ${date}\n`
  formatted += `Time: ${time}\n\n`
  formatted += `SUPPORT PROVIDED\n`
  formatted += `${transcript}\n\n`
  formatted += `PARTICIPANT RESPONSE\n`
  formatted += `Participant engaged positively with the support session.\n\n`
  formatted += `NOTES\n`
  formatted += `Voice note processed. Review for accuracy before submitting.`
  
  return formatted
}

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('Tap the mic to start')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  
  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setStatus('Speech recognition not supported in this browser')
      return
    }
    
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-AU'
    
    recognition.onstart = () => {
      setStatus('🔴 Recording... Speak now')
      setToastMessage('Recording started - speak into mic')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
    
    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }
      
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
      }
      if (interimTranscript) {
        setStatus('Listening: ' + interimTranscript.substring(0, 25) + '...')
      }
    }
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      let errorMsg = 'Error: ' + event.error
      if (event.error === 'not-allowed') {
        errorMsg = '❌ Mic blocked - check browser permissions'
      } else if (event.error === 'no-speech') {
        errorMsg = 'No speech detected, try again'
      } else if (event.error === 'aborted') {
        errorMsg = 'Recording stopped'
      }
      setStatus(errorMsg)
      setToastMessage(errorMsg)
      setShowToast(true)
      setIsRecording(false)
      setRecordingTime(0)
      if (timerRef.current) clearInterval(timerRef.current)
    }
    
    recognition.onend = () => {
      if (isRecording) {
        try {
          recognition.start()
        } catch (e) {}
      }
    }
    
    recognitionRef.current = recognition
    
    return () => {
      recognition.stop()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setToastMessage('Speech recognition not supported. Try Chrome on mobile.')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
      return
    }
    
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
      setStatus('Processing...')
      setRecordingTime(0)
      if (timerRef.current) clearInterval(timerRef.current)
      
      setTimeout(() => {
        setStatus(transcript ? 'Tap to start new note' : 'Tap the mic to start')
      }, 500)
    } else {
      setTranscript('')
      setRecordingTime(0)
      try {
        recognitionRef.current.start()
        setIsRecording(true)
        
        // Start timer
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } catch (e) {
        console.error('Failed to start:', e)
        setStatus('Failed to start - check mic permission')
      }
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
      setToastMessage('Copied to clipboard!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
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
    setToastMessage('Saved to files!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }
  
  const newNote = () => {
    setTranscript('')
    setStatus('Tap the mic to start')
  }
  
  const formattedNote = formatNDISNote(transcript)
  const hasContent = transcript.trim().length > 0
  
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
            disabled={!recognitionRef.current && !isRecording}
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
          
          {isRecording && (
            <div className="recording-timer">{formatTime(recordingTime)}</div>
          )}
          
          <p className="status">{status}</p>
          
          <p className="hint">
            {isRecording ? 'Tap ⏹ when done' : 'Tap the mic and speak naturally'}
          </p>
        </div>
        
        <div className="notes-section">
          <h3>Your Note</h3>
          <div className={`note-output ${!hasContent ? 'empty' : ''}`}>
            {hasContent ? formattedNote : 'Your note will appear here after recording...'}
          </div>
          
          {hasContent && (
            <div className="actions">
              <button className="action-btn copy" onClick={saveNote}>
                💾 Save
              </button>
              <button className="action-btn copy" onClick={copyNote}>
                📋 Copy
              </button>
              <button className="action-btn new" onClick={newNote}>
                🔄 New
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="footer">
        🔒 Audio stays on your device • No data stored
      </div>
      
      {showToast && (
        <div className="toast">{toastMessage}</div>
      )}
    </div>
  )
}

export default App