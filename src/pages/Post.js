import React, { useEffect, useState } from "react";
import { Card, Button, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faEdit,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import img1 from "../assets/images/img1.png";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Post = ({ post }) => {
  const {
    _id,
    userId,
    title,
    postContent,
    image,
    video,
    likes,
    comments,
    createdAt,
    likedBy,
  } = post || {};

  // console.log(userId.username);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const { authUser } = useAuth();



  const loggedInUserId =  authUser._id;
  const userId1 = userId && userId._id ? userId._id : null;

  useEffect(() => {
    setIsLiked(likedBy.includes(loggedInUserId));
    setCommentList(comments);
  }, [comments, likedBy, loggedInUserId]);
  // console.log("comments", comments);

  const handleDeletePost = async () => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this post?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await api.delete(`/posts/${_id}`);
              toast.success("Post deleted successfully!");
              window.location.reload();
            } catch (error) {
              toast.error("Error deleting post");
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleLikeToggle = async () => {
    try {
      const response = await api.post(`/posts/${_id}/like`);
      if (response.status === 200) {
        const updatedPost = response.data.post;
        setIsLiked(updatedPost.likedBy.includes(loggedInUserId));
        setLikeCount(updatedPost.likes);
        toast.success(isLiked ? "Post unliked" : "Post liked");
      }
    } catch (error) {
      toast.error("Error updating like status");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      const response = await api.post(`/comments/${_id}`, {
        commentText: newComment,
      });
      if (response.status === 201) {
        const addedComment = { ...response.data, userId: loggedInUserId };
        setCommentList((prevComments) => [addedComment, ...prevComments]);
        setNewComment("");
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      const response = await api.put(`/comments/${_id}/${commentId}`, {
        commentText: newComment,
      });
      if (response.status === 200) {
        const updatedComment = response.data;
        setCommentList((prevComments) =>
          prevComments.map((comment) =>
            comment._id === updatedComment._id ? updatedComment : comment
          )
        );
        setNewComment("");
        setIsEditing(false);
        setEditingCommentId(null);
        toast.success("Comment updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = (commentId) => {
    confirmAlert({
      title: "Confirm to Delete Comment",
      message: "Are you sure you want to delete this comment?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await api.delete(`/comments/${_id}/${commentId}`);
              setCommentList((prevComments) =>
                prevComments.filter((comment) => comment._id !== commentId)
              );
              toast.success("Comment deleted successfully!");
            } catch (error) {
              toast.error("Error deleting comment");
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const mediaStyle = {
    width: "95%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "10px",
    margin: "10px",
  };

  return (
    <Card
      style={{ width: "70%", marginLeft: "15%" }}
      className="mb-4 mt-4 shadow p-2"
    >
      <Card.Title>{userId?.username || "Unknown User"}</Card.Title>
      {image ? (
        <Card.Img
          variant="top"
          src={`http://localhost:5000/${image}`}
          alt="Post media"
          style={mediaStyle}
        />
      ) : video ? (
        <div className="video-container" style={{ textAlign: "center" }}>
          <video controls style={mediaStyle}>
            <source src={`http://localhost:5000/${video}`} type="video/mp4" />
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
        <Card.Text>{postContent}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div>
          <Button
            variant={isLiked ? "danger" : "outline-danger"}
            onClick={handleLikeToggle}
          >
            <FontAwesomeIcon icon={faHeart} /> {likeCount}
          </Button>
          <Button
            variant="outline-secondary"
            className="ms-2"
            onClick={() => setShowComments(!showComments)}
          >
            <FontAwesomeIcon icon={faComment} /> {commentList.length}
          </Button>
        </div>
        {userId1 === loggedInUserId && (
          <div>
            <Link to={`/edit/${post._id}`}>
              <Button variant="primary">
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </Link>
            <Button
              variant="danger"
              className="ms-2"
              onClick={handleDeletePost}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        )}
        <small className="text-muted">
          Created on: {new Date(createdAt).toLocaleDateString()}
        </small>
      </Card.Footer>

      {/* Comments Section */}
      {showComments && (
        <div
          className="comments-section"
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5>Comments</h5>
            <Button variant="link" onClick={() => setShowComments(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
          <Form onSubmit={handleCommentSubmit}>
            <Form.Group>
              <Form.Label>Write a comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment"
              />
            </Form.Group>
            <Button variant="primary" className="mt-2" type="submit">
              Add Comment
            </Button>
          </Form>

          <ListGroup className="mt-3">
            {commentList
              .slice()
              .reverse()
              .map((comment) => (
                <ListGroup.Item key={comment._id}>
                  <div className="d-flex justify-content-between align-items-center">
                    {isEditing && editingCommentId === comment._id ? (
                      <>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          defaultValue={comment.commentText}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Edit your comment"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateComment(comment._id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="ms-1"
                          onClick={() => {
                            setIsEditing(false);
                            setEditingCommentId(null);
                            setNewComment("");
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span>{comment.commentText}</span>
                        <div>
                          {/* Show edit and delete buttons only for the comment owner */}
                          {comment.userId === loggedInUserId ? (
                            <>
                              <div
                                style={{
                                  display: "inline-flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                              

                                <Button
                                  variant="link"
                                  onClick={() => {
                                    setNewComment(comment.commentText);
                                    setIsEditing(true);
                                    setEditingCommentId(comment._id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                  variant="link"
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>

                                <h4
                                  style={{ fontWeight: 400, color: "#0de0b6" }}
                                >
                                  {comment.ownerName}
                                </h4>
                                <h6
                                  style={{
                                    fontWeight: 400,
                                    color: "rgb(191 154 22)",
                                  }}
                                >
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString()}
                                </h6>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                style={{
                                  display: "inline-flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <h4
                                  style={{ fontWeight: 400, color: "#0de0b6" }}
                                >
                                  {comment.ownerName}
                                </h4>
                                <h6
                                  style={{
                                    fontWeight: 400,
                                    color: "rgb(191 154 22)",
                                  }}
                                >
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString()}
                                </h6>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      )}
    </Card>
  );
};

export default Post;
