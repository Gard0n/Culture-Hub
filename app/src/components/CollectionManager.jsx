import React, { useState } from 'react'

export default function CollectionManager({ wishlist, selectedCollection, onSelectCollection, collections = [], onAddCollection }) {
  const [showNew, setShowNew] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [error, setError] = useState('')

  const itemsByCollection = collections.reduce((acc, col) => {
    acc[col.id] = wishlist.filter(i => (i.collection || 'default') === col.id).length
    return acc
  }, {})

  function handleCreate() {
    const trimmed = newCollectionName.trim()
    if (!trimmed) return
    const exists = collections.some(c =>
      c.id.toLowerCase() === trimmed.toLowerCase() ||
      c.label.toLowerCase() === trimmed.toLowerCase()
    )
    if (exists) {
      setError('Collection déjà existante')
      return
    }
    onAddCollection && onAddCollection(trimmed)
    onSelectCollection && onSelectCollection(trimmed)
    setNewCollectionName('')
    setShowNew(false)
    setError('')
  }

  return (
    <section style={{ 
      marginBottom: 16, 
      padding: 12, 
      background: 'var(--bg-secondary)', 
      borderRadius: 8, 
      border: '1px solid var(--border-color)' 
    }}>
      <h3 style={{ margin: '0 0 12px', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>📁 Collections</h3>
      
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <button
          onClick={() => onSelectCollection(null)}
          style={{
            padding: '6px 12px',
            borderRadius: 20,
            border: selectedCollection === null ? '2px solid var(--accent)' : '1px solid var(--border-color)',
            background: selectedCollection === null ? 'var(--accent-light)' : 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          📊 Toutes ({wishlist.length})
        </button>

        {collections.map(col => (
          <button
            key={col.id}
            onClick={() => onSelectCollection(col.id)}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              border: selectedCollection === col.id ? '2px solid var(--accent)' : '1px solid var(--border-color)',
              background: selectedCollection === col.id ? 'var(--accent-light)' : 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            {col.label} ({itemsByCollection[col.id] || 0})
          </button>
        ))}

        <button 
          onClick={() => {
            setShowNew(!showNew)
            setError('')
            if (showNew) setNewCollectionName('')
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 20,
            border: '1px dashed var(--accent)',
            background: 'transparent',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500
          }}
        >
          + Nouvelle
        </button>
      </div>

      {showNew && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => { setNewCollectionName(e.target.value); setError('') }}
            placeholder="Nom de la collection..."
            style={{
              padding: '6px 8px',
              borderRadius: 4,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              flex: 1,
              fontSize: 12
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCreate()
              }
            }}
          />
          <button 
            onClick={handleCreate}
            style={{
              padding: '6px 10px',
              borderRadius: 4,
              border: 'none',
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            Ajouter
          </button>
          <button 
            onClick={() => setShowNew(false)}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: 'none',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-light)',
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            ✕
          </button>
          {error && <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span>}
        </div>
      )}
    </section>
  )
}
