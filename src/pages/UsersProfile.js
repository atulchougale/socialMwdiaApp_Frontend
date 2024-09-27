import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import api from "../utils/api";
import Post from "./Post";
import { useParams } from 'react-router-dom';

const UsersProfile = () => {
  const { userId } = useParams(); 
  console.log("pro",userId);
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); 

  const myProfile = localStorage.getItem("user");
  const loggedInUserId = myProfile ? JSON.parse(myProfile).id : null;
console.log(loggedInUserId);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/auth/${userId}`);
        setUser(response.data);

        // Fetch posts specifically for the user being viewed
        const postsResponse = await api.get(`/posts/user/${userId}`);
        setPosts(postsResponse.data);

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
  const image =user?.profilePicture;
//   console.log(image);
  
  const imageUrl1 = image ? image.replace(/\\/g, "/") : "";
  const imageUrl = imageUrl1 ? imageUrl1.split('/uploads')[1] : "";
  
  // console.log(imageUrl);
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={`http://localhost:5000/uploads${imageUrl}`} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <h2>{user?.username}</h2>
          <div className="stats">
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
          posts.map(post => (
            <Post key={post._id} post={post} />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default UsersProfile;
