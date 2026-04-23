'use client'

import { useState } from 'react'
import VoiceRecorder from '@/components/VoiceRecorder'
import NoteEditor from '@/components/NoteEditor'

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <div style={{ background: '#2563eb', color: 'white', padding: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>📝 EziNotes</h1>
          <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px' }}>Voice to NDIS notes</p>
        </div>

        <VoiceRecorder 
          onTranscript={(t) => setTranscript(t)} 
          isProcessing={isProcessing}
        />

        <div style={{ borderTop: '1px solid #e5e7eb', padding: '0' }}>
          <NoteEditor initialTranscript={transcript} />
        </div>

        <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#666' }}>
          🔒 Audio stays on device • No data stored (demo mode)
        </div>
      </div>
    </main>
  )
}
