import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import api from "../utils/api";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  //   console.log("usersssss", user);

  const [posts, setPosts] = useState([]);
  //   console.log("profile",posts);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser, setAuthUser } = useAuth();

  // console.log(authUser);

  const userId = authUser ? authUser._id : null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const response = await api.get(`/auth/${userId}`);
          // console.log(response.data);

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
  const image = user.profilePicture;
  // console.log(image);

  const imageUrl1 = image ? image.replace(/\\/g, "/") : "";
  const imageUrl = imageUrl1 ? imageUrl1.split("/uploads")[1] : "";
  const url = imageUrl
    ? `http://localhost:5000/uploads${imageUrl}`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // console.log(imageUrl);

  return (
    <div
      className="profile-container  rounded-xl shadow-lg
      bg-gray-400 bg-clip-padding
      backdrop-filter backdrop-blur-lg mt-3 mb-3 
      bg-opacity-0"
      style={{ shadow:"0 0.125rem 0.25rem rgba(1, 1, 2, 0.075)" }}
    >
      <div className="profile-header  ">
        <div>
          <img src={url} alt="Profile" className="profile-pic" />
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

          <button className="edit-profile-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>
      </div>
      <div className="posts-container">
        <h1>Posts</h1>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div>
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
        )}
      </div>
    </div>
  );
};

export default Profile;
