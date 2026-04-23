'use client'

import { useState, useEffect } from 'react'
import VoiceRecorder from '@/components/VoiceRecorder'
import NoteEditor from '@/components/NoteEditor'
import ClientManager from '@/components/ClientManager'
import NoteList from '@/components/NoteList'

const DEMO_USER_ID = 'demo-user-123'

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [polishedNote, setPolishedNote] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showNotes, setShowNotes] = useState(false)
  const [userId] = useState(DEMO_USER_ID)

  const handleSaveNote = (note: string) => {
    setPolishedNote(note)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <div style={{ background: '#2563eb', color: 'white', padding: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>📝 EziNotes</h1>
          <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px' }}>Voice to NDIS notes</p>
        </div>

        <VoiceRecorder 
          onTranscript={(t) => setTranscript(t)} 
          isProcessing={false}
        />

        <NoteEditor 
          initialTranscript={transcript} 
          onSaveNote={handleSaveNote}
          userId={userId}
          selectedClient={selectedClient}
        />

        {/* Toggle Notes List */}
        <div style={{ padding: '0 16px' }}>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#374151',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>📂 {showNotes ? 'Hide' : 'Show'} Saved Notes</span>
            <span>›</span>
          </button>
        </div>

        {showNotes && (
          <NoteList userId={userId} selectedClientId={selectedClient?.id} />
        )}

        <ClientManager 
          userId={userId}
          selectedClient={selectedClient}
          onSelectClient={setSelectedClient}
        />

        <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#666' }}>
          🔒 Audio stays on device • No data stored (demo mode)
        </div>
      </div>
    </main>
  )
}
