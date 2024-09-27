import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; 
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("postContent", postContent);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Post created successfully!");
        navigate("/"); 
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    }
  };

  return (
    <Card className="mt-5 mb-5 shadow-lg" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Card.Body>
        <Card.Title className="justify-content:center">Create a New Post</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the title"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Post Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write your post content here"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Video</Form.Label>
            <Form.Control type="file" accept="video/*" onChange={handleVideoChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Post
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePost;
