import { useState } from 'react'
import UploadForm from './components/UploadForm'

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Video & Audio Uploader</h1>
          <p className="text-gray-400">Upload MP4/MOV videos and we'll extract the MP3 audio</p>
        </header>

        {uploadStatus && (
          <div className={`mb-6 p-4 rounded-lg text-center ${uploadStatus.error ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
            {uploadStatus.message}
          </div>
        )}

        <UploadForm 
          isUploading={isUploading} 
          setIsUploading={setIsUploading}
          setUploadStatus={setUploadStatus}
        />

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>This application extracts MP3 audio from video files and sends both to a Make.com webhook.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;