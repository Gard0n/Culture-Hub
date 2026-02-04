import React, {useState, useEffect} from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuth } from './contexts/AuthContext'
import { db } from './lib/firebase'
import Login from './components/Login'
import Register from './components/Register'
import Search from './components/Search'
import Wishlist from './components/Wishlist'
import MediaDetail from './components/MediaDetail'
import Upcoming from './components/Upcoming'
import Notifications from './components/Notifications'
import ExportImport from './components/ExportImport'
import Share, { decodeWishlist } from './components/Share'
import Stats from './components/Stats'
import ThemeToggle from './components/ThemeToggle'
import WishlistFilters from './components/WishlistFilters'
import CollectionManager from './components/CollectionManager'
import Recommendations from './components/Recommendations'
import PublicWishlistView from './components/PublicWishlistView'

export default function App(){
  const { currentUser, logout, getUserInitials } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  const [wishlistLoaded, setWishlistLoaded] = useState(false)

  // Gérer la déconnexion
  async function handleLogout() {
    await logout()
    setShowRegister(false) // Retour à la page login
  }

  function readLocalWishlist() {
    try {
      const raw = localStorage.getItem('ch_wishlist') || '[]'
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const [wishlist, setWishlist] = useState(() => {
    const hash = window.location.hash.slice(1)
    const params = new URLSearchParams(hash)
    const listParam = params.get('list')
    if (listParam) {
      const decoded = decodeWishlist(listParam)
      if (decoded && Array.isArray(decoded)) return decoded
    }
    return readLocalWishlist()
  })
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [filteredWishlist, setFilteredWishlist] = useState(wishlist)
  const [showPublicView, setShowPublicView] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)
  
  // Vérifier si on affiche une wishlist publique
  const isPublicView = window.location.hash.includes('list=')

  useEffect(()=>{
    if (isPublicView) return
    localStorage.setItem('ch_wishlist', JSON.stringify(wishlist))
    setFilteredWishlist(wishlist)
  },[wishlist, isPublicView])

  useEffect(() => {
    let cancelled = false

    async function loadWishlist() {
      if (!currentUser || isPublicView) {
        setWishlistLoaded(true)
        return
      }
      setWishlistLoaded(false)

      try {
        const ref = doc(db, 'wishlists', currentUser.uid)
        const snap = await getDoc(ref)
        if (cancelled) return

        if (snap.exists()) {
          const data = snap.data()
          const items = Array.isArray(data.items) ? data.items : []
          setWishlist(items)
        } else {
          const localItems = readLocalWishlist()
          if (localItems.length > 0) {
            await setDoc(ref, { items: localItems, updatedAt: new Date() }, { merge: true })
            if (!cancelled) setWishlist(localItems)
          }
        }
      } catch (error) {
        console.error('Erreur chargement wishlist Firestore', error)
      } finally {
        if (!cancelled) setWishlistLoaded(true)
      }
    }

    loadWishlist()
    return () => { cancelled = true }
  }, [currentUser, isPublicView])

  useEffect(() => {
    if (!currentUser || isPublicView || !wishlistLoaded) return
    const timeout = setTimeout(async () => {
      try {
        const ref = doc(db, 'wishlists', currentUser.uid)
        await setDoc(ref, { items: wishlist, updatedAt: new Date() }, { merge: true })
      } catch (error) {
        console.error('Erreur sauvegarde wishlist Firestore', error)
      }
    }, 400)
    return () => clearTimeout(timeout)
  }, [wishlist, currentUser, isPublicView, wishlistLoaded])

  function addToWishlist(item){
    if(!wishlist.find(i=>i.id===item.id && i.type===item.type)){
      setWishlist([{...item, collection: selectedCollection || 'default'}, ...wishlist])
    }
  }

  function removeFromWishlist(id, type){
    setWishlist(wishlist.filter(i=>!(i.id===id && i.type===type)))
  }

  function handleImport(items){
    setWishlist(items)
  }

  function updateItemNote(id, type, noteData){
    setWishlist(wishlist.map(i => 
      i.id===id && i.type===type ? {...i, ...noteData} : i
    ))
  }

  function updateItemCollection(id, type, collection){
    setWishlist(wishlist.map(i =>
      i.id===id && i.type===type ? {...i, collection} : i
    ))
  }

  // Si l'utilisateur n'est pas connecté et qu'on n'est pas en vue publique, afficher Login/Register
  if (!currentUser && !isPublicView) {
    return showRegister
      ? <Register onSwitch={() => setShowRegister(false)} />
      : <Login onSwitch={() => setShowRegister(true)} />
  }

  return (
    <div className="app">
      <header>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <h1 style={{margin:0,fontSize:28,fontWeight:700}}>🎬 Culture Hub</h1>
            <p style={{margin:'4px 0 0',fontSize:14,color:'var(--text-secondary)'}}>Films, séries & livres</p>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <span style={{fontSize:12,color:'var(--text-light)'}}>{wishlist.length} item{wishlist.length>1?'s':''}</span>
            {isPublicView && <span style={{fontSize: 12, background: 'var(--accent-light)', padding: '4px 8px', borderRadius: 4, color: 'var(--accent)'}}>👁️ Vue publique</span>}
            <ThemeToggle />
            {!isPublicView && <Notifications />}
            {currentUser && !isPublicView && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 20,
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {getUserInitials(currentUser)}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)'
                  }}
                >
                  Se déconnecter
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main>
        <div>
          {!isPublicView && (
            <>
              <Upcoming onAdd={addToWishlist} onSelect={setSelectedMedia} />
              <Search onAdd={addToWishlist} onSelect={setSelectedMedia} />
            </>
          )}
        </div>
        <div>
          {!isPublicView && <WishlistFilters wishlist={wishlist} onFilter={setFilteredWishlist} />}
          {!isPublicView && <CollectionManager wishlist={wishlist} selectedCollection={selectedCollection} onSelectCollection={setSelectedCollection} />}
          <Wishlist items={isPublicView ? wishlist : filteredWishlist} onRemove={isPublicView ? null : removeFromWishlist} onSelect={setSelectedMedia} onUpdateNote={updateItemNote} onUpdateCollection={updateItemCollection} isPublic={isPublicView} />
          <Stats wishlist={isPublicView ? wishlist : filteredWishlist} />
          {!isPublicView && <Recommendations wishlist={wishlist} onAdd={addToWishlist} onSelect={setSelectedMedia} />}
          {!isPublicView && (
            <section style={{background:'var(--bg-tertiary)',padding:16,borderRadius:8,boxShadow:'var(--shadow)',marginTop:24}}>
              <h2 style={{margin:'0 0 12px',color:'var(--text-primary)',fontSize:16,fontWeight:600}}>📥 Gérer ma wishlist</h2>
              <ExportImport wishlist={wishlist} onImport={handleImport} />
              {wishlist.length > 0 && <Share wishlist={wishlist} />}
            </section>
          )}
        </div>
      </main>

      {selectedMedia && !isPublicView && (
        <MediaDetail
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onAdd={(item)=>{ addToWishlist(item); setSelectedMedia(null) }}
        />
      )}

      {isPublicView && (
        <PublicWishlistView wishlist={wishlist} onClose={() => window.location.hash = ''} />
      )}
    </div>
  )
}
