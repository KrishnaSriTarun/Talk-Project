import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './New.css';

function New() {
      const [description, setDescription] = useState('');
      const [image, setImage] = useState(null);
      const [video, setVideo] = useState(null);
      const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
      const [error, setError] = useState(''); // Track errors
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
            e.preventDefault();

            // Validate that either an image or a video is provided
            if (!image && !video) {
                  setError('Please provide either an image or a video.');
                  return;
            }

            setIsSubmitting(true);
            setError(''); 

            const formData = new FormData();
            formData.append('description', description);
            if (image) formData.append('image', image);
            if (video) formData.append('video', video);

            try {
                  const response = await fetch('https://talk-project.onrender.com/talk', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                  });
                  if (response.ok) {
                        navigate('/talk'); 
                  } else {
                        const errorData = await response.json();
                        setError(errorData.message || 'Failed to upload post. Please try again.');
                        console.error('Backend Error:', errorData);
                  }
            } catch (error) {
                  setError('An error occurred while uploading the post. Please try again.');
                  console.error('Network Error:', error);
            } finally {
                  setIsSubmitting(false); // Re-enable the submit button
            }
      };

      return (
            <div className="modal" id="uploadModal">
                  <div className="modal-content">
                        <button
                              className="close"
                              onClick={() => navigate('/talk')} // Programmatically navigate back
                        >
                              ✖
                        </button>
                        <button
                              className="btn-back"
                              onClick={() => navigate('/talk')} // Programmatically navigate back
                        >
                              Back
                        </button>
                        <form onSubmit={handleSubmit}>
                              <textarea
                                    name="description"
                                    placeholder="What's on your mind?"
                                    className="text-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                              ></textarea>
                              <label className="btn-action">
                                    📷 Add Image
                                    <input
                                          type="file"
                                          name="image"
                                          accept="image/*"
                                          style={{ display: 'none' }}
                                          onChange={(e) => setImage(e.target.files[0])}
                                    />
                              </label>
                              <label className="btn-action">
                                    🎥 Add Video
                                    <input
                                          type="file"
                                          name="video"
                                          accept="video/*"
                                          style={{ display: 'none' }}
                                          onChange={(e) => setVideo(e.target.files[0])}
                                    />
                              </label>
                              {error && <p className="error-message">{error}</p>} {/* Display error messages */}
                              <input
                                    type="submit"
                                    className="btn-action upload"
                                    value={isSubmitting ? 'Uploading...' : 'Upload Post'} // Update button text
                                    disabled={isSubmitting} // Disable button while submitting
                              />
                        </form>
                  </div>
            </div>
      );
}

export default New;