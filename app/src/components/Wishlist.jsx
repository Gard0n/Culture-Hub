import React, { useState } from 'react'
import { posterUrl } from '../api/tmdb'

export default function Wishlist({items,onRemove,onSelect,onUpdateNote,onUpdateCollection,isPublic,collections = []}){
  const [editingItem, setEditingItem] = useState(null)
  const [editRating, setEditRating] = useState(0)
  const [editNote, setEditNote] = useState('')

  const collectionMap = new Map((collections || []).map(c => [c.id, c.label]))
  const resolveCollectionLabel = (value) => {
    if (!value || value === 'default') {
      return collectionMap.get('default') || 'Sans collection'
    }
    return collectionMap.get(value) || value
  }

  if(!items.length) return <aside className="wishlist"><h2>Wishlist</h2><p>Vide pour l'instant</p></aside>

  const openEditor = (item) => {
    setEditingItem(item)
    setEditRating(item.rating || 0)
    setEditNote(item.note || '')
  }

  const saveNote = () => {
    if (editingItem && onUpdateNote) {
      onUpdateNote(editingItem.id, editingItem.type, { rating: editRating, note: editNote })
    }
    setEditingItem(null)
  }

  return (
    <aside className="wishlist">
      <h2>Wishlist</h2>
      <ul>
        {items.map(i=> (
          <li key={i.id+"-"+i.type} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
            <div style={{display:'flex',gap:12,alignItems:'center',flex:1,minWidth:200}}>
              {i.poster ? (
                <img src={posterUrl(i.poster)} alt="poster" style={{width:60,height:90,objectFit:'cover',borderRadius:4}} />
              ) : (
                <div style={{width:60,height:90,background:'var(--bg-secondary)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:4,color:'var(--text-light)'}}>No image</div>
              )}
              <div style={{flex:1}}>
                <strong style={{display:'block',color:'var(--text-primary)'}}>{i.title}</strong>
                <small style={{color:'var(--text-light)'}}>{i.year}</small>
                {!isPublic && (
                  <div style={{fontSize:10,color:'var(--accent)',marginTop:4}}>
                    📁 {resolveCollectionLabel(i.collection || 'default')}
                  </div>
                )}
                {i.rating && <div style={{fontSize:12,marginTop:4}}>{'⭐'.repeat(i.rating)}</div>}
                {i.note && <div style={{fontSize:11,color:'var(--text-light)',marginTop:4,fontStyle:'italic'}}>{i.note.substring(0,30)}{i.note.length > 30 ? '...' : ''}</div>}
              </div>
            </div>
            <div className="wishlist-actions" style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {!isPublic && onUpdateCollection && collections.length > 0 && (
                <select
                  aria-label={`Changer collection ${i.title}`}
                  value={i.collection || 'default'}
                  onChange={(e) => onUpdateCollection(i.id, i.type, e.target.value)}
                  style={{ fontSize: 12, padding: '4px 8px' }}
                >
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                  {!collectionMap.has(i.collection || 'default') && (
                    <option value={i.collection || 'default'}>
                      {resolveCollectionLabel(i.collection || 'default')}
                    </option>
                  )}
                </select>
              )}
              <button aria-label={`Voir détails ${i.title}`} onClick={()=>onSelect && onSelect(i)} style={{fontSize:12,padding:'4px 8px'}}>Détails</button>
              {!isPublic && <button aria-label={`Éditer note ${i.title}`} onClick={() => openEditor(i)} style={{fontSize:12,padding:'4px 8px'}}>✏️</button>}
              {!isPublic && <button aria-label={`Supprimer ${i.title}`} onClick={()=>onRemove(i.id,i.type)} style={{fontSize:12,padding:'4px 8px',marginLeft:0}}>Supprimer</button>}
            </div>
            {!isPublic && (
              <details className="wishlist-menu">
                <summary aria-label={`Options ${i.title}`}>⋯</summary>
                <div className="wishlist-menu-panel">
                  {onUpdateCollection && collections.length > 0 && (
                    <select
                      aria-label={`Changer collection ${i.title}`}
                      value={i.collection || 'default'}
                      onChange={(e) => onUpdateCollection(i.id, i.type, e.target.value)}
                      style={{ fontSize: 12, padding: '6px 8px' }}
                    >
                      {collections.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                      {!collectionMap.has(i.collection || 'default') && (
                        <option value={i.collection || 'default'}>
                          {resolveCollectionLabel(i.collection || 'default')}
                        </option>
                      )}
                    </select>
                  )}
                  <button aria-label={`Voir détails ${i.title}`} onClick={()=>onSelect && onSelect(i)}>Détails</button>
                  <button aria-label={`Éditer note ${i.title}`} onClick={() => openEditor(i)}>✏️ Note</button>
                  <button aria-label={`Supprimer ${i.title}`} onClick={()=>onRemove(i.id,i.type)} style={{ background: '#ef4444', color: 'white' }}>Supprimer</button>
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>

      {/* Modal d'édition */}
      {editingItem && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,padding:16}}>
          <div style={{background:'var(--bg-primary)',borderRadius:8,padding:20,maxWidth:400,width:'100%',border:'1px solid var(--border-color)',maxHeight:'90vh',overflowY:'auto'}}>
            <h3 style={{margin:'0 0 16px',color:'var(--text-primary)'}}>Note & évaluation</h3>
            
            {/* Rating */}
            <div style={{marginBottom:16}}>
              <label style={{display:'block',marginBottom:8,fontSize:14,fontWeight:600,color:'var(--text-primary)'}}>⭐ Évaluation</label>
              <div style={{display:'flex',gap:8}}>
                {[1,2,3,4,5].map(r => (
                  <button key={r} onClick={() => setEditRating(r)} style={{fontSize:24,background:'none',border:'none',cursor:'pointer',opacity:r <= editRating ? 1 : 0.3}}>⭐</button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{marginBottom:16}}>
              <label style={{display:'block',marginBottom:8,fontSize:14,fontWeight:600,color:'var(--text-primary)'}}>📝 Commentaire</label>
              <textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} placeholder="Ajoute tes impressions..." style={{width:'100%',minHeight:100,padding:8,borderRadius:4,border:'1px solid var(--border-color)',background:'var(--bg-secondary)',color:'var(--text-primary)',fontFamily:'inherit'}} />
            </div>

            {/* Buttons */}
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button onClick={() => setEditingItem(null)} style={{padding:'8px 16px',background:'var(--bg-secondary)',border:'1px solid var(--border-color)',borderRadius:4,color:'var(--text-primary)',cursor:'pointer'}}>Annuler</button>
              <button onClick={saveNote} style={{padding:'8px 16px',background:'var(--accent)',border:'none',borderRadius:4,color:'white',cursor:'pointer',fontWeight:600}}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
