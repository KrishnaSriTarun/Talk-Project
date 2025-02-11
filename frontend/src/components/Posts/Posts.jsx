import { useEffect, useState } from "react";
import './Posts.css';

function TalkPosts() {
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      useEffect(() => {
            const fetchPosts = async () => {
                  try {
                        const response = await fetch("https://talk-project.onrender.com/talk");
                        if (!response.ok) {
                              throw new Error("Failed to fetch posts");
                        }
                        const data = await response.json();
                        setPosts(data);
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false);
                  }
            };
            fetchPosts();
      }, []);
      const isElementInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
      };
      useEffect(() => {
            const handleScroll = () => {
                  document.querySelectorAll("video[data-autoplay]").forEach((video) => {
                        const isVisible = isElementInViewport(video);
                        if (isVisible && video.paused) {
                              video.play().catch((error) => console.error("Autoplay failed:", error));
                        } else if (!isVisible && !video.paused) {
                              video.pause();
                        }
                  });
            };
            window.addEventListener("scroll", handleScroll);
            handleScroll();
            return () => window.removeEventListener("scroll", handleScroll);
      }, [posts]);
      const togglePlayPause = (event) => {
            const video = event.currentTarget;
            if (video.paused) {
                  video.muted = false;
                  video.play().catch((error) => console.error("Play failed:", error));
            } else {
                  video.pause();
            }
      };
      if (loading) return <div className="text-center">Loading...</div>;
      if (error) return <div className="text-center text-red-500">Error: {error}</div>;
      return (
            <div className="p-4 flex justify-center items-center posts">
                  <div className="text-center">
                        {posts.map((post) => (
                              <div key={post._id} className="post-container m-4 p-4 border-none bg-gray-800 rounded-lg shadow-lg">

                                    <div className="post-header flex items-center mb-2">
                                          <img src={post.owner.profile || "default-profile.png"} alt={post.owner.username} className="post-avatar" />
                                          <p className="text-white ownername font-bold ml-2">{post.owner.username}</p>
                                    </div>

                                    {post.image ? (
                                          <img src={post.image} alt="Post" className="media-content" />
                                    ) : post.video ? (
                                          <video autoPlay muted playsInline className="media-content" onClick={togglePlayPause}>
                                                <source src={post.video} type="video/mp4" />
                                                Your browser does not support the video tag.
                                          </video>

                                    ) : null}
                                    {post.description && (
                                          <p className="text-white leading-6 mt-2 description">{post.description}</p>
                                    )}
                              </div>
                        ))}
                  </div>
            </div>
      );
}

export default TalkPosts;
