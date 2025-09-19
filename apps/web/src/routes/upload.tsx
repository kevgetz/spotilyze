import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/upload')({
  component: UploadComponent,
})

// Styles object - clean separation from JSX
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 var(--spacing-md)'
  },
  title: {
    color: 'var(--color-primary)',
    marginBottom: 'var(--spacing-xl)',
    fontSize: 'var(--font-size-3xl)',
    fontWeight: 600
  },
  subtitle: {
    marginBottom: 'var(--spacing-lg)',
    fontSize: 'var(--font-size-xl)'
  },
  uploadCard: {
    background: 'var(--color-surface-elevated)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-xl)'
  },
  dropZone: {
    border: '2px dashed var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xxl)',
    textAlign: 'center' as const,
    backgroundColor: 'var(--color-surface)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  dropZoneHover: {
    borderColor: 'var(--color-primary)',
    backgroundColor: 'var(--color-surface-elevated)'
  },
  statusMessage: {
    marginTop: 'var(--spacing-lg)',
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center' as const
  }
}

function UploadComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadResult, setUploadResult] = useState<string>('')

  // File handling functions
  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setUploadStatus('error')
      setUploadResult('Please select a ZIP file containing your Spotify data.')
      return
    }
    
    if (file.size > 250 * 1024 * 1024) { // 250MB limit
      setUploadStatus('error')
      setUploadResult('File size exceeds 250MB limit.')
      return
    }
    
    setSelectedFile(file)
    setUploadStatus('idle')
    setUploadResult('')
  }

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    // Add hover styling here later
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Remove hover styling here later  
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // File input handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Upload function
  const handleUpload = async () => {
    if (!selectedFile) return
    
    setUploadStatus('uploading')
    setUploadResult('Processing your Spotify data...')
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (result.success) {
        setUploadStatus('success')
        setUploadResult(`🎉 Success! ${result.message}`)
      } else {
        setUploadStatus('error')
        setUploadResult(`❌ Error: ${result.message}`)
      }
    } catch (error) {
      setUploadStatus('error')
      setUploadResult('❌ Network error. Please try again.')
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Upload Your Spotify Data
      </h1>
      
      <div style={styles.uploadCard}>
        <h2 style={styles.subtitle}>
          Select your Spotify streaming history
        </h2>
        
        {/* Hidden file input */}
        <input
          type="file"
          accept=".zip"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          id="file-input"
        />
        
        {/* Drop zone - now clickable and with drag events */}
        <div 
          style={styles.dropZone}
          onClick={() => document.getElementById('file-input')?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div>
              <p style={{ color: 'var(--color-success)', marginBottom: 'var(--spacing-sm)' }}>
                ✅ {selectedFile.name}
              </p>
              <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-muted">
                📁 Drag & drop your Spotify data ZIP file here
              </p>
              <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-sm)' }}>
                or click to browse files
              </p>
            </div>
          )}
        </div>
        
        {/* Upload button - show only when file is selected */}
        {selectedFile && (
          <button 
            className="btn btn-primary" 
            style={{ marginTop: 'var(--spacing-lg)', width: '100%' }}
            disabled={uploadStatus === 'uploading'}
            onClick={handleUpload}
          >
            {uploadStatus === 'uploading' ? '⏳ Uploading...' : '🚀 Upload & Analyze'}
          </button>
        )}
        
        {uploadStatus !== 'idle' && (
          <div style={{
            ...styles.statusMessage,
            color: uploadStatus === 'success' ? 'var(--color-success)' : 
                    uploadStatus === 'error' ? 'var(--color-error)' : 'var(--color-text)'
          }}>
            {uploadResult}
          </div>
        )}
      </div>
    </div>
  )
}