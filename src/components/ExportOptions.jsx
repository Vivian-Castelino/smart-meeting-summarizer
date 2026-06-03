import React, { useState } from 'react'
import jsPDF from 'jspdf'

export const ExportOptions = ({ summaryData }) => {
  const [isExporting, setIsExporting] = useState(false)

  const downloadPDF = () => {
    try {
      setIsExporting(true)
      const doc = new jsPDF()
      
      let yPosition = 20
      const pageHeight = doc.internal.pageSize.height
      const maxY = pageHeight - 20
      const lineHeight = 7
      const pageWidth = doc.internal.pageSize.width
      const margin = 20

      // Title
      doc.setFont('Arial', 'bold')
      doc.setFontSize(18)
      doc.text('Meeting Minutes & Summary', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 20

      // Summary
      doc.setFont('Arial', 'bold')
      doc.setFontSize(12)
      doc.text('Executive Summary', margin, yPosition)
      yPosition += 10

      doc.setFont('Arial', 'normal')
      doc.setFontSize(10)
      const summaryText = summaryData?.summary || 'No summary available'
      const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 2 * margin)
      splitSummary.forEach(line => {
        if (yPosition > maxY) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, margin, yPosition)
        yPosition += lineHeight
      })

      yPosition += 10

      // Points
      if (yPosition > maxY) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFont('Arial', 'bold')
      doc.setFontSize(12)
      doc.text('Important Points', margin, yPosition)
      yPosition += 10

      doc.setFont('Arial', 'normal')
      doc.setFontSize(10)
      const pointsText = summaryData?.points || 'No points available'
      const splitPoints = doc.splitTextToSize(pointsText, pageWidth - 2 * margin)
      splitPoints.forEach(line => {
        if (yPosition > maxY) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, margin, yPosition)
        yPosition += lineHeight
      })

      doc.save('Meeting_Minutes.pdf')
    } catch (error) {
      console.error('PDF Export Error:', error)
      alert('Error exporting PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const downloadDOCX = () => {
    try {
      setIsExporting(true)
      const content = `
Meeting Minutes & Summary

Executive Summary:
${summaryData?.summary || 'No summary available'}

Important Points:
${summaryData?.points || 'No points available'}
      `.trim()

      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
      element.setAttribute('download', 'Meeting_Minutes.txt')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } finally {
      setIsExporting(false)
    }
  }

  const downloadMarkdown = () => {
    try {
      setIsExporting(true)
      const markdown = `# Meeting Minutes & Summary

## Executive Summary
${summaryData?.summary || 'No summary available'}

## Important Points
${summaryData?.points || 'No points available'}
      `.trim()

      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdown))
      element.setAttribute('download', 'Meeting_Minutes.md')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } finally {
      setIsExporting(false)
    }
  }

  const sendEmail = () => {
    const subject = 'Meeting Minutes & Summary'
    const body = `
Executive Summary:
${summaryData?.summary || 'No summary available'}

Important Points:
${summaryData?.points || 'No points available'}
    `.trim()

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="button-group">
      <button 
        className="secondary-btn" 
        onClick={downloadPDF}
        disabled={isExporting}
      >
        <i className="fas fa-file-pdf"></i> PDF
      </button>
      <button 
        className="secondary-btn" 
        onClick={downloadDOCX}
        disabled={isExporting}
      >
        <i className="fas fa-file-word"></i> DOCX
      </button>
      <button 
        className="secondary-btn" 
        onClick={downloadMarkdown}
        disabled={isExporting}
      >
        <i className="fas fa-file-alt"></i> Markdown
      </button>
      <button 
        className="secondary-btn" 
        onClick={sendEmail}
        disabled={isExporting}
      >
        <i className="fas fa-envelope"></i> Email
      </button>
    </div>
  )
}
