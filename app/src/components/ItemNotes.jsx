import React, { useState } from 'react'

export default function ItemNotes({ item, onUpdateNote }) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(item.rating || 0)
  const [note, setNote] = useState(item.note || '')

  function handleSave() {
    onUpdateNote(item.id, item.type, { rating, note })
    setShowForm(false)
  }

  return (
    <div style={{ fontSize: 12 }}>
      {!showForm ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {rating > 0 && (
            <span style={{ fontSize: 14 }}>
              {'⭐'.repeat(rating)}
            </span>
          )}
          {note && <span style={{ color: 'var(--text-light)', fontSize: 11 }}>{note.substring(0, 20)}...</span>}
          <button 
            onClick={() => setShowForm(true)}
            style={{ padding: '4px 8px', fontSize: 11, background: 'var(--border-light)', color: 'var(--text-primary)' }}
          >
            ✏️
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8, background: 'var(--bg-secondary)', borderRadius: 4 }}>
          <div>
            <label style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Note:</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  onClick={() => setRating(rating === r ? 0 : r)}
                  style={{
                    padding: '4px 8px',
                    fontSize: 12,
                    background: rating >= r ? '#fbbf24' : 'var(--border-light)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ajoute un commentaire..."
            style={{
              fontSize: 11,
              padding: 6,
              borderRadius: 4,
              border: '1px solid var(--border-light)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              resize: 'none',
              height: 50,
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleSave} style={{ flex: 1, fontSize: 11, padding: '6px 8px' }}>Sauvegarder</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, fontSize: 11, padding: '6px 8px', background: 'var(--border-light)', color: 'var(--text-primary)' }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  )
}
