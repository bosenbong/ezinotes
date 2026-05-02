'use client'

import { useState } from 'react'
import PDFExport from './PDFExport'

interface NoteEditorProps {
  initialTranscript?: string
  onSaveNote?: (note: string) => void
  userId: string
  selectedClient?: { id: string; name?: string } | null
}

export default function NoteEditor({ 
  initialTranscript = '', 
  onSaveNote,
  userId,
  selectedClient 
}: NoteEditorProps) {
  const [transcript, setTranscript] = useState(initialTranscript)
  const [polishedNote, setPolishedNote] = useState('')
  const [useAbbreviations, setUseAbbreviations] = useState(true)
  const [translate, setTranslate] = useState(false)
  const [serviceType, setServiceType] = useState('Social & Domestic Support')
  const [duration, setDuration] = useState(60)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('')

  // Update transcript when initial changes
  if (initialTranscript && initialTranscript !== transcript && !isProcessing) {
    setTranscript(initialTranscript)
  }

  const handlePolish = async () => {
    if (!transcript.trim()) {
      setStatus('Please record or type some text first')
      return
    }

    setIsProcessing(true)
    setStatus('Processing...')

    try {
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          useAbbreviations,
          translate
        }),
      })

      const data = await response.json()
      
      if (data.note) {
        setPolishedNote(data.note)
        setStatus('Done!')
      } else {
        setStatus(data.error || 'Failed to process')
      }
    } catch (err) {
      console.error(err)
      setStatus('Error processing note')
    }

    setIsProcessing(false)
  }

  const handleSave = async () => {
    if (!polishedNote.trim()) {
      setStatus('Polish a note first')
      return
    }

    setIsProcessing(true)
    setStatus('Saving...')

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          clientId: selectedClient?.id || null,
          transcript,
          polishedNote: polishedNote,
          serviceType,
          durationMinutes: duration,
        }),
      })

      const data = await response.json()
      
      if (data.note) {
        setStatus('Saved!')
        if (onSaveNote) onSaveNote(polishedNote)
      } else {
        setStatus('Demo mode - connect Supabase to save')
      }
    } catch (err) {
      setStatus('Demo mode')
    }

    setIsProcessing(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(polishedNote)
    setStatus('Copied!')
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Service Type & Duration */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
            background: 'white',
          }}
        >
          <option>Social & Domestic Support</option>
          <option>Transport</option>
          <option>Community Access</option>
          <option>Therapy Support</option>
          <option>Household Tasks</option>
        </select>
        
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={{
            width: '100px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
            background: 'white',
          }}
        >
          <option value={30}>30 min</option>
          <option value={60}>1 hr</option>
          <option value={90}>1.5 hr</option>
          <option value={120}>2 hr</option>
          <option value={180}>3 hr</option>
          <option value={240}>4 hr</option>
        </select>
      </div>

      {/* Settings */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
          <input
            type="checkbox"
            checked={useAbbreviations}
            onChange={(e) => setUseAbbreviations(e.target.checked)}
          />
          Abbreviations
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
          <input
            type="checkbox"
            checked={translate}
            onChange={(e) => setTranslate(e.target.checked)}
          />
          Translate to English
        </label>
      </div>

      {/* Transcript Input */}
      <div style={{ marginBottom: '16px' }}>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your voice transcript will appear here, or type directly..."
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={handlePolish}
          disabled={isProcessing || !transcript.trim()}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: isProcessing ? '#d1d5db' : '#10b981',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          ✨ Polish
        </button>
        
        <button
          onClick={handleSave}
          disabled={isProcessing || !polishedNote}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: isProcessing ? '#d1d5db' : '#2563eb',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          💾 Save
        </button>
      </div>

      {/* Polished Output */}
      {polishedNote && (
        <div>
          <div style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Polished Note</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#f3f4f6',
                  color: '#374151',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📋 Copy
              </button>
              <PDFExport 
                note={polishedNote}
                serviceType={serviceType}
              />
            </div>
          </div>
          <div style={{
            background: '#f3f4f6',
            borderRadius: '12px',
            padding: '16px',
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            fontFamily: 'monospace',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {polishedNote}
          </div>
        </div>
      )}

      {/* Status */}
      {status && (
        <p style={{ 
          textAlign: 'center', 
          marginTop: '12px', 
          fontSize: '13px',
          color: status.includes('Error') ? '#ef4444' : '#10b981'
        }}>
          {status}
        </p>
      )}
    </div>
  )
}
