import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import api from "../utils/api";
import Post from "./Post";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
  const [user, setUser] = useState(null);
  console.log("usersssss", user);

  const [posts, setPosts] = useState([]);
//   console.log("profile",posts);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const myProfile = localStorage.getItem("user");
  const userId = myProfile ? JSON.parse(myProfile).id : null;
//   console.log("User ID from localStorage:", userId);



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const response = await api.get(`/auth/${userId}`);
        //   console.log(response.data);

          setUser(response.data);

          const postsResponse = await api.get(`/posts/user/${userId}`);
          setPosts(postsResponse.data);
        //   console.log(postsResponse.data);
          
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const handleEditProfile = () => {
    navigate("/edit-profile", { state: { user } });
};
const image =user.profilePicture;
// console.log(image);

const imageUrl1 = image ? image.replace(/\\/g, "/") : "";
const imageUrl = imageUrl1 ? imageUrl1.split('/uploads')[1] : "";

// console.log(imageUrl);

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
          <button className="edit-profile-btn" onClick={handleEditProfile}>Edit Profile</button>
        </div>
      </div>
      <div className="posts-container">
      <h1>Posts</h1>
      {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <div>
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <Post key={post._id} post={post}  /> 
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                )}
      </div>
    </div>
  );
};

export default Profile;
