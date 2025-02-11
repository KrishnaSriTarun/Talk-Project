import { useState, useEffect } from "react";
import "./User.css";
import { FaEdit, FaTrash, FaUsers, FaShare, FaEnvelope } from "react-icons/fa";

function Profile() {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [posts, setPosts] = useState([]);

      useEffect(() => {
            const fetchUser = async () => {
                  try {
                        const response = await fetch("https://talk-project.onrender.com/currUser", {
                              method: "GET",
                              credentials: "include",
                        });
                        if (!response.ok) {
                              throw new Error("Failed to fetch user data");
                        }
                        const data = await response.json();
                        setUser(data);
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false);
                  }
            };
            fetchUser();
      }, []);

      useEffect(() => {
            if (!user) return;
            const fetchPosts = async () => {
                  try {
                        const response = await fetch("http://localhost:8080/talk");
                        if (!response.ok) {
                              throw new Error("Failed to fetch posts");
                        }
                        const data = await response.json();
                        const userPosts = data.filter(post => post.owner._id === user._id);
                        setPosts(userPosts);
                  } catch (err) {
                        console.error("Error fetching posts:", err);
                  }
            };
            fetchPosts();
      }, [user]);

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;

      return (
            <div className="profile-page">
                  <div className="profile-container">
                        <img src={user.profile || "default-profile.png"} alt="Profile Picture" />
                        <h2>{user.username || "Unknown User"}</h2>

                        <div className="stats">
                              <div>{posts.length} Posts</div>
                              <div>{(user.followers && user.followers.length) || 0} Followers</div>
                              <div>{(user.following && user.following.length) || 0} Following</div>
                        </div>

                        <div className="action-buttons">
                              <div className="btn-actions"><FaEdit /></div>
                              <div className="btn-actions"><FaTrash /></div>
                              <form className="btn-actions" action={`/user/followers/${user._id || "#"}`} method="GET">
                                    <button className="btn-actions" style={{ border: "none" }} type="submit">
                                          <FaUsers />
                                    </button>
                              </form>
                              <div className="btn-actions"><FaShare /></div>
                              <div className="btn-actions"><FaEnvelope /></div>
                        </div>

                        <div className="posts-container">
                              <h3>User Posts</h3>
                              {posts.length > 0 ? (
                                    posts.map((post) => (
                                          <div key={post._id} className="post-card">
                                                <p className="text-white ownername font-bold">{post.owner.username}</p>
                                                {post.image ? (
                                                      <img src={post.image} alt="Post" className="media-content" />
                                                ) : post.video ? (
                                                      <video autoPlay muted className="media-content">
                                                            <source src={post.video} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                      </video>
                                                ) : null}
                                                {post.description && (
                                                      <p className="text-white leading-6 mt-2 description">{post.description}</p>
                                                )}
                                          </div>
                                    ))
                              ) : (
                                    <p>No posts available.</p>
                              )}
                        </div>
                  </div>
            </div>
      );
};

export default Profile;
