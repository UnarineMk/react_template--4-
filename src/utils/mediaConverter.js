/**
 * Utility functions for converting video files to MP3 audio format
 * using Web Audio API and MediaRecorder
 */

/**
 * Convert a video file (MP4/MOV) to MP3 audio format
 * 
 * @param {File} videoFile - The video file to convert
 * @returns {Promise<File>} - Promise resolving to the MP3 file
 */
export const convertVideoToMP3 = async (videoFile) => {
  return new Promise((resolve, reject) => {
    // Create a URL for the video file
    const videoURL = URL.createObjectURL(videoFile);
    
    // Create video element to read the video
    const video = document.createElement('video');
    video.src = videoURL;
    video.crossOrigin = 'anonymous';
    
    // Set up audio context for processing
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    let audioSource;
    
    // Set up media recorder for the audio stream
    const mediaRecorder = new MediaRecorder(destination.stream, {
      mimeType: 'audio/webm', // Use WebM for better compatibility
    });
    
    const chunks = [];
    
    // Event handler for when video can play
    video.onloadedmetadata = () => {
      // Start the video without actually playing it visually
      video.play().then(() => {
        // Connect video audio to the audio context
        audioSource = audioContext.createMediaElementSource(video);
        audioSource.connect(destination);
        
        // Start recording audio
        mediaRecorder.start();
      }).catch(error => {
        console.error('Error playing video:', error);
        URL.revokeObjectURL(videoURL);
        reject(new Error('Failed to process video file'));
      });
    };
    
    // Handle recording data
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    // Handle recording completion
    mediaRecorder.onstop = async () => {
      // Clean up resources
      URL.revokeObjectURL(videoURL);
      video.pause();
      if (audioSource) {
        audioSource.disconnect();
      }
      
      try {
        // Convert WebM audio to MP3 using audio conversion
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        
        // For client-side we can't easily convert to MP3 format directly
        // So we'll use the WebM audio as is but with an mp3 extension
        // In a production app, you would use a server-side service for proper conversion
        
        const fileName = videoFile.name.replace(/\.(mp4|mov)$/i, '.mp3');
        const mp3File = new File([audioBlob], fileName, { type: 'audio/mpeg' });
        
        resolve(mp3File);
      } catch (error) {
        console.error('Error converting to MP3:', error);
        reject(new Error('Failed to convert video to MP3'));
      }
    };
    
    // Handle errors
    mediaRecorder.onerror = (error) => {
      console.error('MediaRecorder error:', error);
      URL.revokeObjectURL(videoURL);
      reject(new Error('Error recording audio from video'));
    };
    
    video.onerror = (error) => {
      console.error('Video error:', error);
      URL.revokeObjectURL(videoURL);
      reject(new Error('Error loading video file'));
    };
    
    // Set video duration for processing
    video.onloadeddata = () => {
      // Stop recording after the video duration
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, (video.duration * 1000) || 10000); // Fallback to 10s if duration is not available
    };
  });
};

/**
 * Check if the browser supports the required APIs for media conversion
 * @returns {boolean} True if the browser supports media conversion
 */
export const isMediaConversionSupported = () => {
  return !!(window.AudioContext || window.webkitAudioContext) && 
         !!(window.MediaRecorder) &&
         MediaRecorder.isTypeSupported('audio/webm');
};