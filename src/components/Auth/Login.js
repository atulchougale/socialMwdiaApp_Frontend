import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";
import "../../styles/Auth.css";

const Login = ({ setIsAuthenticated }) => {
  const emailInputRef = useRef(null);
  const passInputRef = useRef(null); 
  

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

    try {
      const response = await api.post("/auth/login", formData);

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsAuthenticated(true);
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      toast.error(
        "Login failed: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (passInputRef.current) {
        passInputRef.current.focus();
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              ref={emailInputRef}
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              ref={passInputRef}
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4">
            Login
          </Button>

          <div className="mt-3">
            <p>
              You Don't have an account?{" "}
              <Button
            
                className="btn btn-warning"
                variant="warning"
                o
                onClick={() => navigate("/register")}
              >
                Create New
              </Button>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
