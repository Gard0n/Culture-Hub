import React, { useState } from 'react'

const DEFAULT_COLLECTIONS = ['À regarder', 'À lire', 'En cours', 'Terminé', 'Favori']

export default function CollectionManager({ wishlist, selectedCollection, onSelectCollection }) {
  const [showNew, setShowNew] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')

  const itemsByCollection = DEFAULT_COLLECTIONS.reduce((acc, col) => {
    acc[col] = wishlist.filter(i => (i.collection || 'default') === col).length
    return acc
  }, {})

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

        {DEFAULT_COLLECTIONS.map(col => (
          <button
            key={col}
            onClick={() => onSelectCollection(col)}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              border: selectedCollection === col ? '2px solid var(--accent)' : '1px solid var(--border-color)',
              background: selectedCollection === col ? 'var(--accent-light)' : 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            {col} ({itemsByCollection[col] || 0})
          </button>
        ))}

        <button 
          onClick={() => setShowNew(!showNew)}
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
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
              if (e.key === 'Enter' && newCollectionName.trim()) {
                // Ajouter la collection au localStorage
                const collections = JSON.parse(localStorage.getItem('ch_collections') || '[]')
                if (!collections.includes(newCollectionName)) {
                  collections.push(newCollectionName)
                  localStorage.setItem('ch_collections', JSON.stringify(collections))
                }
                setNewCollectionName('')
                setShowNew(false)
              }
            }}
          />
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
        </div>
      )}
    </section>
  )
}
