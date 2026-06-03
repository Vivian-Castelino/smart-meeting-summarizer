import React from 'react'

export const ProcessingAnimation = ({ isProcessing, message = "AI analyzing meeting..." }) => {
  if (!isProcessing) return null

  return (
    <div className="processing-container">
      <div className="waveform">
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
      </div>
      <div className="processing-text">{message}</div>
    </div>
  )
}
