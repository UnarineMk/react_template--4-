/**
 * Upload the form data (user details and file) to the Make.com webhook
 * 
 * @param {Object} formData - Object containing name, surname, email and file
 * @returns {Promise} - Resolves when upload is complete
 */
export const uploadToMakeWebhook = async (formData) => {
  const { name, surname, email, file } = formData;
  
  if (!file || !name || !surname || !email) {
    throw new Error('Missing required form data');
  }

  // Create a FormData object to send the file and user details
  const data = new FormData();
  data.append('name', name);
  data.append('surname', surname);
  data.append('email', email);
  data.append('file', file);

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
    return { success: true, message: 'Upload successful' };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file. Please try again.');
  }
};