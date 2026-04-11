import { useState } from 'react'

export default function App() {
  return (
    <div style={{ 
      background: 'white', 
      minHeight: '100vh', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{color: '#2563eb', fontSize: '32px'}}>EziNotes</h1>
      <p style={{color: '#666'}}>Voice to NDIS Notes</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          fontSize: '20px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  )
}