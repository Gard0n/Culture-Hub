import React from 'react'

export default function Profile({user}){
  if(!user) return <div>Pas d'utilisateur</div>
  return (
    <div style={{background:'#fff',padding:12,borderRadius:6}}>
      <h3>{user.displayName||user.username}</h3>
      <p>{user.bio}</p>
      <div>
        <strong>Listes publiques</strong>
        <ul>
          {/* placeholder */}
          <li>Aucune (stub)</li>
        </ul>
      </div>
    </div>
  )
}
