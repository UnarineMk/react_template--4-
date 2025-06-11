/**
 * Upload the form data (user details and multiple files) to the Make.com webhook
 * 
 * @param {Object} formData - Object containing name, surname, email, originalFile and audioFile
 * @returns {Promise} - Resolves when upload is complete
 */
export const uploadToMakeWebhook = async (formData) => {
  const { name, surname, email, originalFile, audioFile } = formData;
  
  if (!originalFile || !audioFile || !name || !surname || !email) {
    throw new Error('Missing required form data');
  }

  // Create a FormData object to send the files and user details
  const data = new FormData();
  data.append('name', name);
  data.append('surname', surname);
  data.append('email', email);
  data.append('originalFile', originalFile); // Original video file (MP4 or MOV)
  data.append('audioFile', audioFile);  // Extracted audio file (MP3)

  try {
    // Make.com webhook URL
    const webhookUrl = 'https://hook.eu2.make.com/cfhuapql1sqjdtl6alviiihhgcnkbeg3';
    
    // Make the POST request to the webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: data,
      // No need to set Content-Type header as it's automatically set with FormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    // Return success without parsing JSON since Make.com might respond with plain text
    return { success: true, message: 'Files uploaded successfully' };
  } catch (error) {
    console.error('Error uploading files:', error);
    throw new Error(error.message || 'Failed to upload files. Please try again.');
  }
};