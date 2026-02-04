import React, {useState, useEffect} from 'react'

function readNotifications(){
  try{ return JSON.parse(localStorage.getItem('ch_notifications')||'[]') }catch(e){ return [] }
}

export default function Notifications(){
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(readNotifications())

  useEffect(()=>{
    const handler = ()=> setItems(readNotifications())
    window.addEventListener('storage', handler)
    return ()=> window.removeEventListener('storage', handler)
  },[])

  function clearAll(){
    localStorage.removeItem('ch_notifications')
    setItems([])
  }

  return (
    <div style={{position:'relative',display:'inline-block'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{marginLeft:12}}>🔔 ({items.length})</button>
      {open && (
        <div style={{position:'absolute',right:0,top:'120%',width:320,background:'#fff',border:'1px solid #ddd',padding:12,borderRadius:6}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <strong>Notifications</strong>
            <button onClick={clearAll}>Clear</button>
          </div>
          <ul style={{maxHeight:240,overflow:'auto',padding:0,listStyle:'none'}}>
            {items.length===0 && <li style={{padding:8,color:'#666'}}>Aucune notification</li>}
            {items.map((n,idx)=> (
              <li key={idx} style={{padding:8,borderBottom:'1px solid #f0f0f0'}}>
                <div style={{fontSize:13}}>{n.title}</div>
                <div style={{fontSize:12,color:'#666'}}>{n.body}</div>
                <div style={{fontSize:11,color:'#999'}}>{new Date(n.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
