import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export const AnalyticsDashboard = ({ analytics }) => {
  if (!analytics) {
    return <div className="analytics-grid">Analytics data loading...</div>
  }

  const {
    meetingDuration = '0:00',
    participationData = [],
    topicData = [],
    totalActionItems = 0,
    mostActiveSpeaker = 'N/A'
  } = analytics

  // Sample data for charts if not provided
  const defaultParticipationData = [
    { name: 'Speaker 1', value: 42 },
    { name: 'Speaker 2', value: 30 },
    { name: 'Speaker 3', value: 28 }
  ]

  const defaultTopicData = [
    { topic: 'Introductions', duration: 2 },
    { topic: 'Discussion', duration: 15 },
    { topic: 'Final Decisions', duration: 8 }
  ]

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div>
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-title">Meeting Duration</div>
          <div className="analytics-card-value">{meetingDuration}</div>
          <div className="analytics-card-unit">Total time</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-title">Total Action Items</div>
          <div className="analytics-card-value">{totalActionItems}</div>
          <div className="analytics-card-unit">Tasks identified</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-title">Most Active Speaker</div>
          <div className="analytics-card-value" style={{ fontSize: '18px', marginTop: '10px' }}>
            {mostActiveSpeaker}
          </div>
          <div className="analytics-card-unit">Leading contributor</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-title">Topics Discussed</div>
          <div className="analytics-card-value">{topicData.length || 3}</div>
          <div className="analytics-card-unit">Main topics</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="chart-container">
          <h3>Participation %</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={participationData.length > 0 ? participationData : defaultParticipationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {(participationData.length > 0 ? participationData : defaultParticipationData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Topics Duration</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicData.length > 0 ? topicData : defaultTopicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="topic" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="duration" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
