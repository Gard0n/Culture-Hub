import React, {useState, useEffect} from 'react'
import { searchTMDB, fetchGenres, posterUrl } from '../api/tmdb'
import { searchOpenLibrary } from '../api/openLibrary'

export default function Search({onAdd, onSelect}){
  const [q,setQ] = useState('')
  const [type,setType] = useState('movie')
  const [results,setResults] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const [genres, setGenres] = useState({})
  const [selectedGenre, setSelectedGenre] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(() => window.innerWidth > 768)
  const apiKey = import.meta.env.VITE_TMDB_API_KEY || ''
  const lang = import.meta.env.VITE_TMDB_LANGUAGE || 'fr-FR'

  function handleTypeChange(nextType) {
    setType(nextType)
    setResults([])
    setSelectedGenre('')
  }

  useEffect(()=>{
    async function loadGenres(){
      if(type==='book') return
      if(!apiKey) return
      try{
        const map = await fetchGenres(apiKey, lang)
        setGenres(map)
      }catch(e){ console.warn('genres load failed',e) }
    }
    loadGenres()
  },[type])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 769px)')
    const handler = (e) => setFiltersOpen(e.matches)
    handler(media)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  async function doSearch(e, pageArg=1){
    e && e.preventDefault()
    if(!q) return
    setLoading(true)
    setError('')
    try{
      if(type==='book'){
        const r = await searchOpenLibrary(q, pageArg)
        const mapped = r.docs.map(d=>({
          id: d.key,
          title: d.title,
          year: d.first_publish_year,
          type: 'book',
          authors: d.author_name
        }))
        if(pageArg>1) setResults(prev=>[...prev, ...mapped.slice(0,10)])
        else setResults(mapped.slice(0,10))
        setPage(pageArg)
      } else {
        if(!apiKey){
          setError('Clé TMDB manquante. Ajoutez VITE_TMDB_API_KEY dans .env pour activer la recherche films/séries.')
          setResults([])
          return
        }
        const extra = { language: lang }
        const r = await searchTMDB(q,type,apiKey,pageArg, extra)
        const mapped = (r.results||[]).map(item=>({
          id: item.id,
          title: item.title || item.name,
          year: (item.release_date||item.first_air_date||'').slice(0,4),
          type: type,
          poster: item.poster_path,
          genre_ids: item.genre_ids || []
        }))
        // filter by selectedGenre if any
        const filtered = selectedGenre ? mapped.filter(it=> (it.genre_ids||[]).some(id=>genres[id]===selectedGenre)) : mapped
        if(pageArg>1) setResults(prev=>[...prev, ...filtered])
        else setResults(filtered)
        setPage(pageArg)
      }
    }catch(err){
      console.error(err)
      setError('Erreur lors de la recherche — voir console pour détails')
      if(pageArg===1) setResults([])
    }finally{setLoading(false)}
  }

  return (
    <section className="search">
      <div className="search-panel">
        <form className="search-top" onSubmit={(e)=>doSearch(e,1)}>
          <div className="search-input">
            <input placeholder="Rechercher un titre, un auteur..." value={q} onChange={e=>setQ(e.target.value)} />
            <button className="search-submit" type="submit" aria-label="Rechercher">Rechercher</button>
          </div>
        </form>
        <div className="search-toolbar">
          <div className="search-type only-desktop" role="tablist" aria-label="Type de recherche">
            <button
              type="button"
              className={type === 'movie' ? 'active' : ''}
              aria-pressed={type === 'movie'}
              onClick={() => handleTypeChange('movie')}
            >
              🎬 Films
            </button>
            <button
              type="button"
              className={type === 'tv' ? 'active' : ''}
              aria-pressed={type === 'tv'}
              onClick={() => handleTypeChange('tv')}
            >
              📺 Séries
            </button>
            <button
              type="button"
              className={type === 'book' ? 'active' : ''}
              aria-pressed={type === 'book'}
              onClick={() => handleTypeChange('book')}
            >
              📚 Livres
            </button>
          </div>
          <select
            className="search-type-select only-mobile"
            value={type}
            onChange={e=>handleTypeChange(e.target.value)}
            aria-label="Type"
          >
            <option value="movie">🎬 Films</option>
            <option value="tv">📺 Séries</option>
            <option value="book">📚 Livres</option>
          </select>
          {type!=='book' && (
            <>
              <div className="search-genre only-desktop">
                <select value={selectedGenre} onChange={e=>setSelectedGenre(e.target.value)}>
                  <option value="">-- Genre --</option>
                  {Object.entries(genres).map(([id,name])=> (
                    <option key={id} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="search-genre only-mobile">
                <button
                  type="button"
                  className="search-filters-toggle"
                  onClick={() => setFiltersOpen(o => !o)}
                  aria-expanded={filtersOpen}
                >
                  Genre {filtersOpen ? '▴' : '▾'}
                </button>
                {filtersOpen && (
                  <select value={selectedGenre} onChange={e=>setSelectedGenre(e.target.value)}>
                    <option value="">-- Genre --</option>
                    {Object.entries(genres).map(([id,name])=> (
                      <option key={id} value={name}>{name}</option>
                    ))}
                  </select>
                )}
              </div>
            </>
          )}
        </div>
      </div>
          {loading ? (
            <ul className="results">
              {Array.from({length:6}).map((_,i)=> (
                <li key={i} className="skeleton-item">
                  <div className="skeleton-left">
                    <div className="skeleton skeleton-thumb" />
                    <div style={{width:220}}>
                      <div className="skeleton" style={{height:14,width:'60%',marginBottom:8}} />
                      <div className="skeleton" style={{height:12,width:'40%'}} />
                    </div>
                  </div>
                  <div style={{width:120}}>
                    <div className="skeleton" style={{height:36,width:'100%'}} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
            <ul className="results">
              {error && <li style={{color:'crimson',padding:8}}>{error}</li>}
              {results.map(r=> (
                <li key={r.id+"-"+r.type} className="card result-card" style={{background:'var(--bg-tertiary)',color:'var(--text-primary)'}}>
                  <div className="left">
                    {r.poster ? (
                      <img src={posterUrl(r.poster,'w92')} alt={`Affiche ${r.title}`} />
                    ) : (
                      <div style={{width:56,height:84,background:'var(--bg-secondary)',borderRadius:6}} />
                    )}
                    <div className="result-info">
                      <strong style={{cursor:'pointer',display:'block',color:'var(--text-primary)'}} onClick={()=>onSelect && onSelect(r)}>{r.title}</strong>
                      <div className="meta">{r.authors ? r.authors.join(', ') : ''}</div>
                    </div>
                  </div>
                  <div className="result-actions mobile-hide">
                    <button aria-label={`Ajouter ${r.title}`} onClick={()=>onAdd(r)}>Ajouter</button>
                    <button className="secondary" aria-label={`Voir détails ${r.title}`} onClick={()=>onSelect && onSelect(r)} style={{marginLeft:8}}>Détails</button>
                  </div>
                </li>
              ))}
            </ul>
            {results.length > 0 && (
              <div style={{textAlign:'center',marginTop:12}}>
                <button onClick={async ()=>{ await doSearch(null, page+1) }}>Charger plus</button>
              </div>
            )}
            </>
          )}
    </section>
  )
}
