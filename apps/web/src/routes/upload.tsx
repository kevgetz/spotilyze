import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/upload')({
  component: UploadComponent,
})

function UploadComponent() {
  return (
    <div>
      <h2>Upload Your Spotify Data</h2>
      <p>Drag & drop your Spotify streaming history ZIP file here.</p>
      {/* Upload interface kommt hier rein */}
    </div>
  )
}