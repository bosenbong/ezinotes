'use client'

import { useState, useEffect } from 'react'

interface Client {
  id: string
  name: string
  ndis_number: string | null
  created_at: string
}

interface ClientManagerProps {
  userId: string
  selectedClient: Client | null
  onSelectClient: (client: Client | null) => void
}

export default function ClientManager({ userId, selectedClient, onSelectClient }: ClientManagerProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [name, setName] = useState('')
  const [ndisNumber, setNdisNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId) {
      fetchClients()
    }
  }, [userId])

  const fetchClients = async () => {
    try {
      const response = await fetch(`/api/clients?userId=${userId}`)
      const data = await response.json()
      if (data.clients) {
        setClients(data.clients)
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = editingClient ? '/api/clients' : '/api/clients'
      const method = editingClient ? 'PUT' : 'POST'
      
      const body = editingClient
        ? { id: editingClient.id, userId, name, ndisNumber }
        : { userId, name, ndisNumber }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save client')
      }

      // Refresh client list
      await fetchClients()
      
      // Reset form
      setName('')
      setNdisNumber('')
      setShowForm(false)
      setEditingClient(null)
      
      // Select the new/updated client
      if (data.client) {
        onSelectClient(data.client)
      }
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setName(client.name)
    setNdisNumber(client.ndis_number || '')
    setShowForm(true)
  }

  const handleDelete = async (client: Client) => {
    if (!confirm(`Delete client "${client.name}"?`)) return

    try {
      const response = await fetch(`/api/clients?id=${client.id}&userId=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      await fetchClients()
      
      if (selectedClient?.id === client.id) {
        onSelectClient(null)
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', color: '#666', margin: 0 }}>Clients</h3>
        <button
          onClick={() => {
            setEditingClient(null)
            setName('')
            setNdisNumber('')
            setShowForm(true)
          }}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            background: '#2563eb',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          + Add Client
        </button>
      </div>

      {/* Client List */}
      {clients.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <button
            onClick={() => onSelectClient(null)}
            style={{
              padding: '8px 12px',
              borderRadius: '20px',
              border: selectedClient ? '1px solid #e5e7eb' : '2px solid #2563eb',
              background: selectedClient ? 'white' : '#eff6ff',
              color: selectedClient ? '#666' : '#2563eb',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            All Clients
          </button>
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => onSelectClient(client)}
              style={{
                padding: '8px 12px',
                borderRadius: '20px',
                border: selectedClient?.id === client.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                background: selectedClient?.id === client.id ? '#eff6ff' : 'white',
                color: selectedClient?.id === client.id ? '#2563eb' : '#374151',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {client.name}
            </button>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ 
          background: '#f3f4f6', 
          padding: '16px', 
          borderRadius: '12px',
          marginBottom: '12px'
        }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px' }}>
            {editingClient ? 'Edit Client' : 'New Client'}
          </h4>
          
          <input
            type="text"
            placeholder="Client name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          
          <input
            type="text"
            placeholder="NDIS number (optional)"
            value={ndisNumber}
            onChange={(e) => setNdisNumber(e.target.value)}
            style={inputStyle}
          />
          
          {error && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 8px' }}>{error}</p>}
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ ...btnStyle, flex: 1 }}
            >
              {loading ? 'Saving...' : editingClient ? 'Update' : 'Add Client'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingClient(null)
              }}
              style={{ ...btnStyle, background: '#6b7280', flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* No clients message */}
      {clients.length === 0 && !showForm && (
        <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', margin: '12px 0' }}>
          No clients yet. Add your first client!
        </p>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '8px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  boxSizing: 'border-box',
} as const

const btnStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  background: '#10b981',
  color: 'white',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
} as const
