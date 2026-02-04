import React, { useRef, useState } from 'react'

export default function ExportImport({ wishlist, onImport }) {
  const fileInputRef = useRef(null)
  const [feedback, setFeedback] = useState('')

  function handleExport() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      wishlist: wishlist
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `culture-hub-wishlist-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setFeedback('✅ Wishlist exportée!')
    setTimeout(() => setFeedback(''), 2000)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result || '{}')
        const items = data.wishlist || data || []
        if (Array.isArray(items)) {
          onImport(items)
          setFeedback(`✅ ${items.length} items importés!`)
          setTimeout(() => setFeedback(''), 2000)
        } else {
          setFeedback('❌ Format invalide')
        }
      } catch (err) {
        setFeedback(`❌ Erreur: ${err.message}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <button onClick={handleExport} title="Télécharger wishlist en JSON" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        📥 Exporter
      </button>
      <button onClick={handleImportClick} title="Charger une wishlist depuis un fichier JSON" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        📤 Importer
      </button>
      {feedback && <span style={{ fontSize: 13, color: feedback.includes('❌') ? '#dc2626' : '#16a34a' }}>{feedback}</span>}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportFile}
        style={{ display: 'none' }}
      />
    </div>
  )
}
