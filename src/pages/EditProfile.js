import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import api from "../utils/api";
import "../styles/EditProfile.css";
import { toast } from "react-toastify";
import { useLocation , useNavigate} from "react-router-dom";

const EditProfile = () => {
const navigate = useNavigate();
    const location = useLocation();
  const { user } = location.state;
  console.log("edit", user);
  


  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || "");
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || "");
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("bio", bio);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  return (
    <Container className="   h-full p-3 rounded-xl shadow-lg
       bg-gray-400 bg-clip-padding
        backdrop-filter backdrop-blur-lg 
        bg-opacity-0"
        style={{ width: "60%", marginLeft: "20%", shadow:"0 0.125rem 0.25rem rgba(1, 1, 2, 0.075)"  }}>
      <h2 className="font-bold text-4xl text-teal-500 text-center" >Edit Profile</h2>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label className="font-bold text-2xl text-teal-500 text-center">Username :</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label className="font-bold text-2xl text-teal-500 text-center">Email :</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBio">
          <Form.Label className="font-bold text-2xl text-teal-500 text-center">Bio :</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formProfilePicture">
          <Form.Label className="font-bold text-2xl text-teal-500 text-center">Profile Picture :</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading} className="mt-3">
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default EditProfile;
