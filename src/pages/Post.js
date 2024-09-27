import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import img1 from "../assets/images/img1.png";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

import api from "../utils/api";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  // console.log("post",post);
  
  const {
    userId,
    title,
    postContent,
    image,
    video,
    likes,
    comments,
    createdAt,
  } = post || {};

  const username = userId && userId.username ? userId.username : "Unknown User";
  
  const imageUrl = image ? image.replace(/\\/g, "/") : "";
  const videoUrl = video ? video.replace(/\\/g, "/") : "";

  const user = localStorage.getItem("user");
  const loggedInUserId = user ? JSON.parse(user).id : null;
  const userId1 = userId && userId._id ? userId._id : null;

  // console.log("Logged In User ID:", loggedInUserId);
  // console.log("Post User ID:", userId1);

  const mediaStyle = {
    width: "95%",
    height: "400px",
    objectFit: "100% 100%",
    borderRadius: "10px",
    margin: "10px",
  };


  const handleDelete = async () => {
    confirmAlert({
        title: 'Confirm to Delete',
        message: 'Are you sure you want to delete this post?',
        buttons: [
            {
                label: 'Yes',
                onClick: async () => {
                    try {
                        await api.delete(`/posts/${post._id}`);
                        toast.success("Post deleted successfully!");
                        window.location.reload();
                    } catch (error) {
                        toast.error("Error deleting post");
                    }
                }
            },
            {
                label: 'No',
                onClick: () => {}
            }
        ]
    });
};

  return (
    <Card
      style={{ width: "60%", marginLeft: "20%" }}
      className="mb-4 mt-4 shadow p-2 "
    >
      <Card.Title>{username}</Card.Title>
      {image ? (
        <Card.Img
          variant="top"
          src={`http://localhost:5000/${imageUrl}`}
          alt="Post media"
          style={mediaStyle}
        />
      ) : video ? (
        <div className="video-container" style={{ textAlign: "center" }}>
          <video controls style={mediaStyle}>
            <source
              src={`http://localhost:5000/${videoUrl}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <Card.Img
          variant="top"
          src={img1}
          alt="Placeholder"
          style={mediaStyle}
        />
      )}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {postContent ||
            "Some quick example text to build on the card title and make up the bulk of the card's content."}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div>
          <Button variant="light">
            <FontAwesomeIcon icon={faHeart} /> {likes}
          </Button>
          <Button variant="light" className="ms-2">
            <FontAwesomeIcon icon={faComment} /> {comments.length}
          </Button>
        </div>

        {userId1 === loggedInUserId && (
          <div>
          <Link to={`/edit/${post._id}`}>
            <Button variant="primary">
                <FontAwesomeIcon icon={faEdit} />
            </Button>
        </Link>
            <Button variant="danger" className="ms-2" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        )}
        <small className="text-muted ">
          Created on: {new Date(createdAt).toLocaleDateString()}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default Post;
