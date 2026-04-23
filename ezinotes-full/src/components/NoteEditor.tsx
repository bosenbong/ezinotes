'use client'

import { useState } from 'react'

interface NoteEditorProps {
  initialTranscript?: string
}

export default function NoteEditor({ initialTranscript = '' }: NoteEditorProps) {
  const [transcript, setTranscript] = useState(initialTranscript)
  const [polishedNote, setPolishedNote] = useState('')
  const [useAbbreviations, setUseAbbreviations] = useState(true)
  const [translate, setTranslate] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('')

  const handlePolish = async () => {
    if (!transcript.trim()) {
      setStatus('Please enter or record some text first')
      return
    }

    setIsProcessing(true)
    setStatus('Polishing note...')

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
        setStatus(translate ? 'Translated & polished!' : 'Polished!')
      } else {
        setStatus(data.error || 'Failed to process note')
      }
    } catch (err) {
      setStatus('Error processing note')
      console.error(err)
    }

    setIsProcessing(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(polishedNote)
    setStatus('Copied!')
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Settings */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={useAbbreviations}
            onChange={(e) => setUseAbbreviations(e.target.checked)}
          />
          Use Abbreviations
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
        <label style={{ fontSize: '14px', color: '#666', marginBottom: '8px', display: 'block' }}>
          Your Voice Transcript
        </label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your voice transcript will appear here, or type directly..."
          style={{
            width: '100%',
            minHeight: '100px',
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

      {/* Polish Button */}
      <button
        onClick={handlePolish}
        disabled={isProcessing || !transcript.trim()}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          border: 'none',
          background: isProcessing ? '#d1d5db' : '#10b981',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          marginBottom: '16px'
        }}
      >
        {isProcessing ? 'Processing...' : '✨ Polish Note'}
      </button>

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
            <span>Polished NDIS Note</span>
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
          </div>
          <div style={{
            background: '#f3f4f6',
            borderRadius: '12px',
            padding: '16px',
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            fontFamily: 'monospace'
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
          fontSize: '14px',
          color: status.includes('Error') ? '#ef4444' : '#10b981'
        }}>
          {status}
        </p>
      )}
    </div>
  )
}
