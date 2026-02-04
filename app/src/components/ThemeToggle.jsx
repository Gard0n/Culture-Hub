import React, { useState, useEffect } from 'react'

export default function ThemeToggle({ variant = 'icon', label = 'Mode sombre' }) {
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

  if (variant === 'menu') {
    return (
      <button
        type="button"
        onClick={() => setIsDark(d => !d)}
        aria-pressed={isDark}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '10px 12px',
          borderRadius: 12,
          width: '100%',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: 12
        }}
      >
        <span>{label}</span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: isDark ? 'var(--accent)' : 'var(--bg-secondary)',
          color: isDark ? 'var(--btn-text)' : 'var(--text-primary)',
          padding: '4px 8px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 600
        }}>
          {isDark ? 'ON' : 'OFF'} {isDark ? '🌙' : '☀️'}
        </span>
      </button>
    )
  }

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
