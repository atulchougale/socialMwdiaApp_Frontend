import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import api from "../utils/api";
import "../styles/SearchPage.css";
import Post from "./Post";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResults([]); // Clear results when switching tabs
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response =
        activeTab === "users"
          ? await api.get(`/auth/search?query=${searchTerm}`)
          : await api.get(`/posts/search?query=${searchTerm}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const usersProfile = (userId) => {
    navigate(`/users-profile/${userId}`);
  };

  return (
    <Container className="search-container mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs="auto">
          <Button
            variant={activeTab === "users" ? "primary" : "outline-primary"}
            onClick={() => handleTabChange("users")}
            className="me-2"
          >
            Search User
          </Button>
          <Button
            variant={activeTab === "posts" ? "primary" : "outline-primary"}
            onClick={() => handleTabChange("posts")}
          >
            Search Post
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center mb-4">
        <Col xs={10} md={8}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder={`Search for ${activeTab === "users" ? "Users" : "Posts"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {loading && <div>Loading...</div>}
        {!loading && results.length === 0 && <div>No results found.</div>}
        {results.map((item) =>
          activeTab === "users" ? (
            <Col xs={10} md={6} lg={4} key={item._id} className="mb-4">
              <Card className="user-card" onClick={() => usersProfile(item._id)} style={{ cursor: "pointer" }}>
                <Card.Body>
                  <Card.Title>{item.username}</Card.Title>
                  <Card.Text>Email: {item.email}</Card.Text>
                  <Card.Text>Bio: {item.bio || "No bio available"}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <Col xs={10} md={10} lg={10} key={item._id} className="mb-4">
              <Post post={item} />
            </Col>
          )
        )}
      </Row>
    </Container>
  );
};

export default Search;
