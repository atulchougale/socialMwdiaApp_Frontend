import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

const Post = ({ post }) => {
  const { userId, postContent, image, video, likes, comments, createdAt } =
    post;

  // Ensure userId is an object and has a username
  const username = userId && userId.username ? userId.username : "Unknown User";

  return (
    <Card style={{ width: "60%", marginLeft: "20%" }} className="mb-4 ">
      {image ? (
        <Card.Img variant="top" src={image} alt="Post media" />
      ) : (
        <Card.Img variant="top" src="holder.js/100px180" alt="Placeholder" />
      )}
      <Card.Body>
        <Card.Title>{username}</Card.Title>
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
        <small className="text-muted ">
          Created on: {new Date(createdAt).toLocaleDateString()}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default Post;
