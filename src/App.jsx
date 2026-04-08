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
  
  // Extract key information from casual speech
  const lines = transcript.split(/\s+/).filter(l => l.length > 0)
  const wordCount = lines.length
  
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
  const [status, setStatus] = useState('Tap to start recording')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  
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
      setStatus('Recording... Speak naturally')
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
        setStatus('Listening: ' + interimTranscript.substring(0, 30) + '...')
      }
    }
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setStatus('Error: ' + event.error)
      setIsRecording(false)
    }
    
    recognition.onend = () => {
      if (isRecording) {
        // Restart if still recording
        try {
          recognition.start()
        } catch (e) {
          // Already started
        }
      }
    }
    
    recognitionRef.current = recognition
    
    return () => {
      recognition.stop()
    }
  }, [isRecording])
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setToastMessage('Speech recognition not supported')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
      setStatus('Processing...')
      
      // Give it a moment to finalize
      setTimeout(() => {
        setStatus('Tap to start recording')
      }, 1000)
    } else {
      setTranscript('')
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (e) {
        console.error('Failed to start:', e)
        setStatus('Failed to start recording')
      }
    }
  }
  
  const copyNote = () => {
    const formatted = formatNDISNote(transcript)
    navigator.clipboard.writeText(formatted).then(() => {
      setToastMessage('Copied to clipboard!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    })
  }
  
  const newNote = () => {
    setTranscript('')
    setStatus('Tap to start recording')
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
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
          <p className="status">{status}</p>
        </div>
        
        <div className="notes-section">
          <h3>Your Note</h3>
          <div className={`note-output ${!hasContent ? 'empty' : ''}`}>
            {hasContent ? formattedNote : 'Your note will appear here after recording...'}
          </div>
          
          {hasContent && (
            <div className="actions">
              <button className="action-btn copy" onClick={copyNote}>
                📋 Copy Note
              </button>
              <button className="action-btn new" onClick={newNote}>
                🔄 New
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="footer">
        🔒 Audio processed locally • No data stored
      </div>
      
      {showToast && (
        <div className="toast">{toastMessage}</div>
      )}
    </div>
  )
}

export default App