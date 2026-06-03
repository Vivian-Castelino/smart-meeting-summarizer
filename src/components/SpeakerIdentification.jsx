import React from 'react'

const SPEAKER_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899'
]

export const SpeakerIdentification = ({ speakers }) => {
  if (!speakers || speakers.length === 0) {
    return <div className="speaker-stats">No speaker data available</div>
  }

  const sortedSpeakers = [...speakers].sort((a, b) => b.percentage - a.percentage)
  const maxPercentage = sortedSpeakers[0]?.percentage || 100

  return (
    <div className="speaker-stats">
      {sortedSpeakers.map((speaker, index) => (
        <div key={index} className="speaker-card" style={{ borderLeftColor: SPEAKER_COLORS[index % SPEAKER_COLORS.length] }}>
          <div className="speaker-name">{speaker.name || `Speaker ${index + 1}`}</div>
          <div className="speaker-stat">
            <strong>{speaker.percentage}%</strong> speaking time
          </div>
          <div className="speaker-stat">Duration: {speaker.duration || '0:00'}</div>
          <div className="speaker-bar">
            <div 
              className="speaker-bar-fill" 
              style={{ 
                width: `${(speaker.percentage / maxPercentage) * 100}%`,
                background: SPEAKER_COLORS[index % SPEAKER_COLORS.length]
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
