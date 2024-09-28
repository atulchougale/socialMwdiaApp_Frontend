import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api"; 
import { toast } from "react-toastify";

const UpdatePost = () => {
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams(); 

  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/posts/${id}`);
        const postData = response.data;
        setTitle(postData.title);
        setPostContent(postData.postContent);
        
      } catch (error) {
        setError("Error fetching post data");
      }
    };
    fetchPost();
  }, [id]);

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
      const response = await api.put(`/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Post updated successfully!");
        navigate(`/`); 
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    }
  };

  return (
    <Card className="mt-5 mb-5 shadow-lg" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Card.Body>
        <Card.Title className="justify-content:center">Update Post</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
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
            Update Post
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdatePost;
