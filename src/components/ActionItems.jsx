import React from 'react'

export const ActionItems = ({ items }) => {
  if (!items || items.length === 0) {
    return <div className="action-items">No action items found</div>
  }

  return (
    <div className="action-items">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ textAlign: 'left', padding: '10px', color: '#1e40af', fontWeight: '600' }}>Task</th>
            <th style={{ textAlign: 'left', padding: '10px', color: '#1e40af', fontWeight: '600' }}>Assigned To</th>
            <th style={{ textAlign: 'left', padding: '10px', color: '#1e40af', fontWeight: '600' }}>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px 10px', color: '#334155' }}>{item.task}</td>
              <td style={{ padding: '12px 10px', color: '#334155' }}>{item.assignee || 'Unassigned'}</td>
              <td style={{ padding: '12px 10px', color: '#334155' }}>{item.deadline || 'No deadline'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
