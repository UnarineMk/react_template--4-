import { useState } from 'react';
import FormInput from './FormInput';
import { validateEmail, validateName } from '../utils/validation';
import { uploadToMakeWebhook } from '../utils/fileUpload';

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
    
    if (file.type !== 'video/mp4') {
      setErrors({
        ...errors,
        file: 'Only MP4 files are allowed'
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
      newErrors.file = 'Please select an MP4 file';
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
      const result = await uploadToMakeWebhook(formData);
      setUploadStatus({ 
        error: false,
        message: 'File uploaded successfully!'
      });
      
      // Reset form after successful upload
      setFormData({
        name: '',
        surname: '',
        email: '',
        file: null
      });
      
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
          MP4 File
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="video/mp4"
          onChange={handleFileChange}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {errors.file && <p className="mt-1 text-sm text-red-400">{errors.file}</p>}
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