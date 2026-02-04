import React, { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('ch_theme') === 'dark'
    } catch {
      return false
    }
  })

  useEffect(() => {
    localStorage.setItem('ch_theme', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDark])

  return (
    <button 
      onClick={() => setIsDark(d => !d)}
      title={`Passer en mode ${isDark ? 'clair' : 'sombre'}`}
      style={{ 
        background: 'transparent', 
        color: isDark ? '#fbbf24' : '#1f2937',
        fontSize: 20,
        padding: '4px 8px',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
