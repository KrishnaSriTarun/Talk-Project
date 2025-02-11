import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import './Followers.css';

const Followers = () => {
      const { id } = useParams();
      const [followers, setFollowers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchFollowers = useCallback(async () => {
            try {
                  const response = await fetch(`https://talk-project.onrender.com/user/followers/${id}`, {
                        method: "GET",
                        credentials: "include",
                  });

                  if (!response.ok) {
                        throw new Error("Failed to fetch followers");
                  }

                  const data = await response.json();
                  setFollowers(data.followers);
            } catch (err) {
                  setError(err.message);
            } finally {
                  setLoading(false);
            }
      }, [id]); // add 'id' as a dependency to ensure it updates if the id changes

      useEffect(() => {
            fetchFollowers();
      }, [fetchFollowers]); // this ensures the useEffect runs when fetchFollowers changes

      const handleRetry = () => {
            setLoading(true);
            setError(null);
            fetchFollowers();
      };

      if (loading) return <p>Loading...</p>;
      if (error) return (
            <div>
                  <p>Error: {error}</p>
                  <button onClick={handleRetry}>Retry</button>
            </div>
      );
      if (followers.length === 0) return <p>No followers yet.</p>;

      return (
            <div className="followers-container">
                  <h2>Followers</h2>
                  <ul className="followers-list">
                        {followers.map((follower, index) => (
                              <li key={follower._id + index} className="follower-item">
                                    <img src={follower.profile || "default-profile.png"} alt={follower.username} className="follower-avatar" />
                                    <span className="text-white">{follower.username}</span>
                              </li>
                        ))}
                  </ul>
            </div>
      );
};

export default Followers;
