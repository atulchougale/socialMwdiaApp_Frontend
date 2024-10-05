import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import api from "../utils/api";
import Post from "./Post";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UsersProfile = () => {
  const { userId } = useParams();
  //   console.log("pro",userId);
  const { authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const loggedInUserId = authUser ? authUser._id : null;
  // console.log(loggedInUserId);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/auth/${userId}`);
        setUser(response.data);

        // Check if the logged-in user is following this user
        const followers = response.data.followers.includes(loggedInUserId); // Corrected here
        setIsFollowing(followers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, loggedInUserId]);

  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        const postsResponse = await api.get(`/posts/posts/user/${userId}`);
        setPosts(postsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPost();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        const response = await api.put(`/auth/unfollow/${userId}`); // Fixed userId here
        setIsFollowing(false);
        window.location.reload();
      } else {
        const response = await api.put(`/auth/follow/${userId}`); // Fixed userId here
        setIsFollowing(true);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err.message);
    }
  };
  const image = user?.profilePicture;
  //   console.log(image);

  const imageUrl1 = image ? image.replace(/\\/g, "/") : "";
  const imageUrl = imageUrl1 ? imageUrl1.split("/uploads")[1] : "";
  const url = imageUrl ? `http://localhost:5000/uploads${imageUrl}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';


  // console.log(imageUrl);
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div
      className="profile-container  rounded-xl shadow-lg
      bg-gray-400 bg-clip-padding
      backdrop-filter backdrop-blur-lg mt-3 mb-3 
      bg-opacity-0"
    >
      <div className="profile-header">
        <div>
          <img
            src={url}
            alt="Profile"
            className="profile-pic"
          />
          <p className="bio ms-3 mt-4">{user?.bio}</p>
        </div>
        <div className="profile-info">
          <h2>{user?.username}</h2>
          <div className="stats1">
            <span>
              <strong>{posts.length}</strong> posts
            </span>
            <span>
              <strong>{user?.followers.length}</strong> followers
            </span>
            <span>
              <strong>{user?.following.length}</strong> following
            </span>
          </div>
          <p className="bio">{user?.bio}</p>
          {loggedInUserId !== userId && (
            <button className="follow-btn" onClick={handleFollowToggle}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>
      <div className="posts-container">
        <h1>Posts</h1>
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <div
            className="container d-flex justify-content-center align-items-center shadow-box "
            style={{
              shadow: "0 0.125rem 0.25rem rgba(1, 1, 2, 0.075)",
              width: "50%",
            }}
          >
            <p>No posts available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersProfile;
