import React from 'react'

export const Header = ({ onThemeToggle, isDark }) => {
  return (
    <header className="header">
      <h1>🎧 Smart Meeting Summarizer</h1>
      <button 
        id="themeToggle" 
        onClick={onThemeToggle}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
