import axios from 'axios'

const TMDB_BASE = 'https://api.themoviedb.org/3'

export async function searchTMDB(query, type='movie', apiKey='', page=1, extraParams={}){
  if(!apiKey) throw new Error('VITE_TMDB_API_KEY missing')
  const path = type==='tv' ? 'search/tv' : 'search/movie'
  const url = `${TMDB_BASE}/${path}`
  const params = Object.assign({ api_key: apiKey, query, page }, extraParams)
  const res = await axios.get(url, { params })
  return res.data
}

export function posterUrl(path, size='w300'){
  if(!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export async function fetchTMDBDetails(id, type='movie', apiKey='', language='fr-FR'){
  if(!apiKey) throw new Error('VITE_TMDB_API_KEY missing')
  const path = type==='tv' ? `tv/${id}` : `movie/${id}`
  const url = `${TMDB_BASE}/${path}`
  // request credits and translations to get localized overview when available
  const res = await axios.get(url, { params: { api_key: apiKey, language, append_to_response: 'credits,translations' } })
  return res.data
}

export async function fetchUpcomingMovies(apiKey='', page=1, language='fr-FR'){
  if(!apiKey) throw new Error('VITE_TMDB_API_KEY missing')
  const url = `${TMDB_BASE}/movie/upcoming`
  const res = await axios.get(url, { params: { api_key: apiKey, page, language } })
  return res.data
}

let _genreCache = null
export async function fetchGenres(apiKey='', language='fr-FR'){
  if(_genreCache) return _genreCache
  if(!apiKey) throw new Error('VITE_TMDB_API_KEY missing')
  try{
    const [moviesRes, tvRes] = await Promise.all([
      axios.get(`${TMDB_BASE}/genre/movie/list`, { params: { api_key: apiKey, language } }),
      axios.get(`${TMDB_BASE}/genre/tv/list`, { params: { api_key: apiKey, language } })
    ])
    const map = {}
    ;(moviesRes.data.genres||[]).forEach(g=>{ map[g.id]=g.name })
    ;(tvRes.data.genres||[]).forEach(g=>{ map[g.id]=g.name })
    _genreCache = map
    return map
  }catch(e){
    console.error('fetchGenres error',e)
    return {}
  }
}

