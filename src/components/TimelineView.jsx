import React from 'react'

export const TimelineView = ({ timelineData }) => {
  if (!timelineData || timelineData.length === 0) {
    return <div className="timeline">Timeline will appear here...</div>
  }

  return (
    <div className="timeline">
      {timelineData.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-time">{item.time}</div>
          <div className="timeline-content">{item.topic}</div>
        </div>
      ))}
    </div>
  )
}
