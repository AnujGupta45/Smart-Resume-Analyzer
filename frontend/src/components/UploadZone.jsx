import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './UploadZone.css'

export default function UploadZone({ onFileSelect, file }) {
  const [dragOver, setDragOver] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onFileSelect(accepted[0])
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    onDropAccepted: () => setDragOver(false),
    onDropRejected: () => setDragOver(false),
  })

  return (
    <div
      {...getRootProps()}
      className={`upload-zone ${isDragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
    >
      <input {...getInputProps()} id="resume-upload" />

      {file ? (
        <div className="upload-success">
          <div className="file-icon">📄</div>
          <div className="file-info">
            <p className="file-name">{file.name}</p>
            <p className="file-size">{(file.size / 1024).toFixed(1)} KB · PDF</p>
          </div>
          <button
            className="file-remove"
            onClick={(e) => { e.stopPropagation(); onFileSelect(null) }}
            title="Remove file"
          >✕</button>
        </div>
      ) : (
        <div className="upload-prompt">
          <div className="upload-icon-wrap">
            <div className="upload-icon">☁️</div>
          </div>
          <h3 className="upload-title">
            {isDragActive ? 'Drop your resume here!' : 'Drag & drop your resume'}
          </h3>
          <p className="upload-sub">
            or <span className="upload-browse">browse to upload</span>
          </p>
          <p className="upload-hint">PDF only · Max 10MB</p>
        </div>
      )}
    </div>
  )
}
