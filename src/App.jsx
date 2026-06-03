import React, { useState, useRef } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { TimelineView } from './components/TimelineView'
import { ProcessingAnimation } from './components/ProcessingAnimation'
import { SpeakerIdentification } from './components/SpeakerIdentification'
import { ActionItems } from './components/ActionItems'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { ExportOptions } from './components/ExportOptions'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [fileName, setFileName] = useState('No file selected')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('AI analyzing meeting...')

  // Results state
  const [transcript, setTranscript] = useState('Transcript will appear here...')
  const [summary, setSummary] = useState('Summary will appear here...')
  const [points, setPoints] = useState('Important points will appear here...')
  const [timeline, setTimeline] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [actionItems, setActionItems] = useState([])
  const [analytics, setAnalytics] = useState(null)

  const audioInputRef = useRef(null)
  const audioPlayerRef = useRef(null)

  // Toggle theme
  const handleThemeToggle = () => {
    setIsDark(!isDark)
    document.body.classList.toggle('dark')
  }

  // Handle file input
  const handleAudioInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAudioFile(file)
      setFileName(file.name)
      const url = URL.createObjectURL(file)
      audioPlayerRef.current.src = url
    }
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
      setFileName(file.name)
      const url = URL.createObjectURL(file)
      audioPlayerRef.current.src = url
    }
  }

  // Process audio and generate summary
  const handleSummarize = async () => {
    if (!audioFile) {
      alert('Please select an audio file first!')
      return
    }

    setIsProcessing(true)
    setTranscript('Transcribing audio... Please wait.')
    setSummary('Generating summary...')
    setPoints('Extracting important points...')

    const formData = new FormData()
    formData.append('audio', audioFile)

    try {
      const response = await fetch('/summarize', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.error) {
        alert('Error: ' + data.error)
        setTranscript('Error occurred.')
      } else {
        // Set main content
        setTranscript(data.transcript)
        setSummary(data.summary)
        setPoints(data.points)

        // Parse and set timeline data
        const parsedTimeline = parseTimeline(data.transcript)
        setTimeline(parsedTimeline)

        // Parse and set speaker data
        const parsedSpeakers = parseSpeakers(data.transcript)
        setSpeakers(parsedSpeakers)

        // Parse and set action items
        const parsedActionItems = parseActionItems(data.points)
        setActionItems(parsedActionItems)

        // Set analytics
        const analyticsData = generateAnalytics(data)
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error('Fetch Error:', error)
      alert('An error occurred during processing.')
      setTranscript('Processing failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Parse timeline from transcript
  const parseTimeline = (text) => {
    // Simple timeline extraction - extracts time mentions
    const timePattern = /(\d{1,2}:\d{2})/g
    const topicPattern = /[-–]\s*([^.\n]+)/g
    
    const times = text.match(timePattern) || []
    const topics = text.match(topicPattern) || []
    
    return times.slice(0, 5).map((time, index) => ({
      time: time,
      topic: topics[index]?.replace(/[-–]\s*/, '') || 'Topic ' + (index + 1)
    }))
  }

  // Parse speakers from transcript
  const parseSpeakers = (text) => {
    // Simple speaker extraction
    const speakerPattern = /(Speaker\s*\d+|John|Alice|Sarah|Mike|David|Emily)/gi
    const speakers = {}
    
    let match
    const regex = new RegExp(speakerPattern)
    while ((match = regex.exec(text)) !== null) {
      const name = match[0]
      speakers[name] = (speakers[name] || 0) + 1
    }

    const total = Object.values(speakers).reduce((a, b) => a + b, 0)
    
    return Object.entries(speakers)
      .map(([name, count]) => ({
        name: name,
        percentage: Math.round((count / total) * 100),
        duration: `${Math.floor(count / 10)}:${(count % 10) * 6}`
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)
  }

  // Parse action items from points
  const parseActionItems = (text) => {
    const lines = text.split('\n').filter(line => line.trim())
    const actionKeywords = ['prepare', 'create', 'review', 'send', 'schedule', 'implement', 'develop', 'plan']
    
    return lines
      .filter(line => actionKeywords.some(keyword => line.toLowerCase().includes(keyword)))
      .slice(0, 5)
      .map((line, index) => ({
        task: line.replace(/^[•\-\*]\s*/, ''),
        assignee: `Team Member ${index + 1}`,
        deadline: 'This Week'
      }))
  }

  // Generate analytics
  const generateAnalytics = (data) => {
    const transcriptLength = data.transcript.length
    const minutes = Math.floor(transcriptLength / 100) || 1
    const seconds = Math.floor((transcriptLength % 100) / 1.67) || 0
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`

    return {
      meetingDuration: formattedDuration,
      participationData: speakers,
      topicData: timeline,
      totalActionItems: actionItems.length,
      mostActiveSpeaker: speakers[0]?.name || 'N/A'
    }
  }

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <Header onThemeToggle={handleThemeToggle} isDark={isDark} />

      <div className="main-content">
        {/* Upload Section */}
        <div className="card">
          <h2>Upload Audio</h2>
          <div 
            className="drop-zone" 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p>Drag & Drop Audio File</p>
            <span>or</span>
            <input 
              type="file" 
              id="audioInput" 
              ref={audioInputRef}
              accept="audio/*"
              onChange={handleAudioInput}
            />
            <label htmlFor="audioInput">Browse File</label>
          </div>
          <p id="fileName">{fileName}</p>
          <audio ref={audioPlayerRef} controls></audio>
          <button className="primary-btn" onClick={handleSummarize} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Generate Summary'}
          </button>
        </div>

        {/* Processing Animation */}
        <ProcessingAnimation isProcessing={isProcessing} message={processingMessage} />

        {/* Output Section */}
        <div className="card">
          {/* Transcript */}
          <div className="section">
            <h2>Transcript</h2>
            <div className="text-box">{transcript}</div>
          </div>

          {/* Summary */}
          <div className="section">
            <h2>Summary</h2>
            <div className="text-box">{summary}</div>
          </div>

          {/* Important Points */}
          <div className="section">
            <h2><i className="fas fa-list-ul"></i> Important Points</h2>
            <div className="text-box">{points}</div>
          </div>

          {/* Timeline View */}
          {timeline.length > 0 && (
            <div className="section">
              <h2><i className="fas fa-clock"></i> Timeline View</h2>
              <TimelineView timelineData={timeline} />
            </div>
          )}

          {/* Speaker Identification */}
          {speakers.length > 0 && (
            <div className="section">
              <h2><i className="fas fa-users"></i> Speaker Identification</h2>
              <SpeakerIdentification speakers={speakers} />
            </div>
          )}

          {/* Action Items */}
          {actionItems.length > 0 && (
            <div className="section">
              <h2><i className="fas fa-tasks"></i> Action Items</h2>
              <ActionItems items={actionItems} />
            </div>
          )}

          {/* Analytics Dashboard */}
          {analytics && (
            <div className="section">
              <h2><i className="fas fa-chart-bar"></i> Meeting Analytics</h2>
              <AnalyticsDashboard analytics={analytics} />
            </div>
          )}

          {/* Export Options */}
          {transcript !== 'Transcript will appear here...' && (
            <div className="section">
              <h2><i className="fas fa-download"></i> Export Options</h2>
              <ExportOptions summaryData={{ summary, points }} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default App
