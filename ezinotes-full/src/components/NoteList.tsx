'use client'

import { useState, useEffect } from 'react'

interface Note {
  id: string
  client_id: string | null
  polished_note: string
  service_type: string
  duration_minutes: number
  created_at: string
  clients?: { name: string }
}

interface NoteListProps {
  userId: string
  selectedClientId?: string | null
}

export default function NoteList({ userId, selectedClientId }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [userId, selectedClientId])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      let url = `/api/notes?userId=${userId}`
      if (selectedClientId) {
        url += `&clientId=${selectedClientId}`
      }
      const response = await fetch(url)
      const data = await response.json()
      if (data.notes) {
        setNotes(data.notes)
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    }
    setLoading(false)
  }

  const handleDelete = async (note: Note) => {
    if (!confirm('Delete this note?')) return
    
    try {
      const response = await fetch(`/api/notes?id=${note.id}&userId=${userId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchNotes()
        if (selectedNote?.id === note.id) {
          setSelectedNote(null)
        }
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-AU', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  return (
    <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
      <h3 style={{ fontSize: '14px', color: '#666', margin: '0 0 12px' }}>
        Saved Notes ({notes.length})
      </h3>

      {loading ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>Loading...</p>
      ) : notes.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
          No notes yet. Create your first note above!
        </p>
      ) : (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              style={{
                padding: '12px',
                marginBottom: '8px',
                background: selectedNote?.id === note.id ? '#eff6ff' : '#f9fafb',
                borderRadius: '8px',
                cursor: 'pointer',
                border: selectedNote?.id === note.id ? '1px solid #2563eb' : '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                    {note.clients?.name || 'No client'}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                    {note.service_type} • {note.duration_minutes}min
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af' }}>
                    {formatDate(note.created_at)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(note)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    opacity: 0.5,
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div
          onClick={() => setSelectedNote(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Note Details</h3>
              <button
                onClick={() => setSelectedNote(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
            <pre style={{ 
              fontSize: '13px', 
              whiteSpace: 'pre-wrap', 
              background: '#f3f4f6', 
              padding: '12px', 
              borderRadius: '8px',
              fontFamily: 'inherit',
              margin: 0
            }}>
              {selectedNote.polished_note}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedNote.polished_note)
              }}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: '#2563eb',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              📋 Copy Note
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
