import axios from 'axios'

const OL_BASE = 'https://openlibrary.org'

export async function searchOpenLibrary(query, page=1){
  const url = `${OL_BASE}/search.json`
  const res = await axios.get(url, { params: { q: query, page } })
  return res.data
}
