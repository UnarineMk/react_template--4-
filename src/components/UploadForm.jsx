import { useState, useEffect } from 'react';
import FormInput from './FormInput';
import { validateEmail, validateName } from '../utils/validation';
import { uploadToMakeWebhook } from '../utils/fileUpload';
import { convertVideoToMP3, isMediaConversionSupported } from '../utils/mediaConverter';

function UploadForm({ isUploading, setIsUploading, setUploadStatus }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    file: null
  });
  
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    email: '',
    file: ''
  });
  
  const [conversionSupported, setConversionSupported] = useState(true);
  const [conversionStatus, setConversionStatus] = useState(null);
  
  // Check if browser supports the required APIs for media conversion
  useEffect(() => {
    const supported = isMediaConversionSupported();
    setConversionSupported(supported);
    
    if (!supported) {
      console.warn('Media conversion not supported in this browser');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setErrors({
        ...errors,
        file: 'Please select a file'
      });
      return;
    }
    
    const validTypes = ['video/mp4', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        file: 'Only MP4 and MOV files are allowed'
      });
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setErrors({
        ...errors,
        file: 'File size should be less than 100MB'
      });
      return;
    }
    
    setFormData({
      ...formData,
      file: file
    });
    
    setErrors({
      ...errors,
      file: ''
    });
    
    if (!conversionSupported) {
      setConversionStatus('Your browser does not support audio extraction. You can still upload the video file.');
    } else {
      setConversionStatus(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name';
      isValid = false;
    }

    if (!validateName(formData.surname)) {
      newErrors.surname = 'Please enter a valid surname';
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.file) {
      newErrors.file = 'Please select an MP4 or MOV file';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Set initial conversion status
      setConversionStatus('Converting video to MP3...');
      
      let audioFile;
      
      // Convert video to MP3 if the browser supports it
      if (conversionSupported && formData.file) {
        try {
          audioFile = await convertVideoToMP3(formData.file);
          setConversionStatus('Audio extraction successful!');
        } catch (conversionError) {
          console.error('Audio conversion error:', conversionError);
          setConversionStatus(`Audio extraction failed: ${conversionError.message}`);
          
          // If conversion fails but we still have the original file, continue with upload
          if (!audioFile) {
            // Create an empty audio file as a fallback
            const emptyBlob = new Blob([], { type: 'audio/mpeg' });
            const fileName = formData.file.name.replace(/\.(mp4|mov)$/i, '.mp3');
            audioFile = new File([emptyBlob], fileName, { type: 'audio/mpeg' });
          }
        }
      } else {
        // Create an empty audio file as a fallback for unsupported browsers
        const emptyBlob = new Blob([], { type: 'audio/mpeg' });
        const fileName = formData.file.name.replace(/\.(mp4|mov)$/i, '.mp3');
        audioFile = new File([emptyBlob], fileName, { type: 'audio/mpeg' });
      }
      
      // Prepare the upload data
      const uploadData = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        originalFile: formData.file,
        audioFile: audioFile
      };
      
      // Upload both files
      const result = await uploadToMakeWebhook(uploadData);
      
      setUploadStatus({ 
        error: false,
        message: 'Files uploaded successfully!'
      });
      
      // Reset form after successful upload
      setFormData({
        name: '',
        surname: '',
        email: '',
        file: null
      });
      
      // Reset conversion status
      setConversionStatus(null);
      
      // Reset file input
      document.getElementById('file').value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        error: true,
        message: `Upload failed: ${error.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <FormInput
        label="Name"
        id="name"
        name="name"
        type="text"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        required
      />

      <FormInput
        label="Surname"
        id="surname"
        name="surname"
        type="text"
        placeholder="Enter your surname"
        value={formData.surname}
        onChange={handleInputChange}
        error={errors.surname}
        required
      />

      <FormInput
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />

      <div className="mb-4">
        <label htmlFor="file" className="block text-gray-300 text-sm font-medium mb-2">
          Video File (MP4/MOV)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="video/mp4,video/quicktime"
          onChange={handleFileChange}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {errors.file && <p className="mt-1 text-sm text-red-400">{errors.file}</p>}
        
        {conversionStatus && (
          <div className={`mt-2 p-2 rounded text-sm ${conversionStatus.includes('failed') ? 'bg-red-900/50 text-red-200' : 'bg-blue-900/50 text-blue-200'}`}>
            {conversionStatus}
          </div>
        )}
        
        {!conversionSupported && (
          <p className="mt-1 text-sm text-yellow-400">
            Your browser doesn't support audio extraction, but you can still upload the video file.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
          isUploading 
            ? 'bg-blue-700 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        }`}
      >
        {isUploading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </div>
        ) : (
          'Upload File'
        )}
      </button>
    </form>
  );
}

export default UploadForm;