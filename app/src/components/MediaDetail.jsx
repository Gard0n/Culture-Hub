import React, {useState, useEffect} from 'react'
import { fetchTMDBDetails, posterUrl } from '../api/tmdb'

export default function MediaDetail({media, onClose, onAdd}){
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState('')
  const [review, setReview] = useState('')

  useEffect(()=>{
    let mounted = true
    async function load(){
      if(media.type==='book'){
        // basic details already provided by search for books
        setDetails(media)
        return
      }
      setLoading(true)
      try{
        const apiKey = import.meta.env.VITE_TMDB_API_KEY || ''
        const lang = import.meta.env.VITE_TMDB_LANGUAGE || 'fr-FR'
        const d = await fetchTMDBDetails(media.id, media.type, apiKey, lang)
        if(mounted) setDetails(d)
      }catch(e){
        console.error(e)
        if(mounted) setDetails(media)
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  },[media])

  function saveLocalReview(){
    try{
      const key = 'ch_reviews'
      const cur = JSON.parse(localStorage.getItem(key)||'{}')
      const id = `${media.type}-${media.id}`
      cur[id] = { rating, review, updatedAt: new Date().toISOString(), title: media.title }
      localStorage.setItem(key, JSON.stringify(cur))
      alert('Review saved locally')
    }catch(e){ console.error(e) }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={`Détails ${media.title||media.name}`} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:16}}>
      <div style={{width:'100%',maxWidth:900,background:'var(--bg-tertiary)',color:'var(--text-primary)',padding:20,borderRadius:8,maxHeight:'90vh',overflow:'auto',boxShadow:'var(--shadow-hover)'}}>
        <button aria-label="Fermer" onClick={onClose} style={{float:'right',background:'var(--border-light)',color:'var(--text-primary)',padding:'8px 12px',borderRadius:4,minHeight:44}}>✕ Fermer</button>
        {loading && <p>Chargement…</p>}
        {details && (
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            <div style={{width:200}}>
              {details.poster_path || details.poster ? (
                <img src={posterUrl(details.poster_path || details.poster)} alt="poster" style={{width:'100%',borderRadius:8,transition:'transform .2s'}} />
              ) : null}
            </div>
            <div style={{flex:1,minWidth:260}}>
              <h2 style={{marginTop:0,color:'var(--text-primary)'}}>{details.title || details.name}</h2>
              <p style={{color:'var(--text-secondary)'}}><em>{(details.release_date||details.first_air_date||details.year||'').slice(0,10)}</em></p>
              <p style={{color:'var(--text-secondary)'}}>{details.overview || details.description || details.summary || ''}</p>

              {details.genres && details.genres.length>0 && (
                <div style={{marginTop:8,color:'var(--text-primary)'}}>
                  <strong>Genres:</strong> {details.genres.map(g=>g.name).join(', ')}
                </div>
              )}

              {details.credits && details.credits.cast && details.credits.cast.length>0 && (
                <div style={{marginTop:12}}>
                  <strong style={{color:'var(--text-primary)'}}>Acteurs principaux:</strong>
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:8}}>
                    {details.credits.cast.slice(0,8).map(c=> (
                      <div key={c.cast_id || c.credit_id} style={{width:110}}>
                        {c.profile_path ? <img src={posterUrl(c.profile_path,'w185')} alt={c.name} style={{width:110,height:150,objectFit:'cover',borderRadius:6}} /> : (
                          <div style={{width:110,height:150,background:'var(--bg-secondary)',borderRadius:6}} />
                        )}
                        <div style={{fontSize:13,marginTop:6,color:'var(--text-primary)'}}><strong>{c.name}</strong></div>
                        <div style={{fontSize:12,color:'var(--text-light)'}}>{c.character}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{marginTop:12}}>
                <button onClick={()=>onAdd && onAdd({ id: media.id, type: media.type, title: media.title || media.name, year: (media.year||media.release_date||'').slice(0,4), poster: details.poster_path || details.poster })}>Ajouter à la wishlist</button>
              </div>

              <div style={{marginTop:16}}>
                <h4 style={{color:'var(--text-primary)'}}>Votre note et mini-review</h4>
                <div style={{color:'var(--text-primary)'}}>
                  <label>Note (1-5): <input value={rating} onChange={e=>setRating(e.target.value)} style={{width:60}}/></label>
                </div>
                <div>
                  <textarea value={review} onChange={e=>setReview(e.target.value)} rows={4} style={{width:'100%',background:'var(--bg-secondary)',color:'var(--text-primary)',border:'1px solid var(--border-light)',borderRadius:4,padding:8,fontFamily:'inherit'}} placeholder="Petit commentaire..."></textarea>
                </div>
                <div style={{marginTop:8}}>
                  <button onClick={saveLocalReview}>Enregistrer localement</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
