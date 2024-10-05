import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../utils/api";

import "../../styles/Auth.css";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const emailInputRef = useRef(null);
  const passInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { setAuthUser } = useAuth();

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handelInput = (e) => {
    setInputData({ ...inputData, [e.target.id]: e.target.value });
  };

  console.log(inputData);

  const selectGender = (selectGender) => {
    setInputData((prev) => ({
      ...prev,
      gender: selectGender === inputData.gender ? "" : selectGender,
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,8}$/;
    return passwordRegex.test(password);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { username, email, password, confirmPassword } = inputData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be 6-8 characters long, include a number, a symbol, and a letter"
      );
      setLoading(false);
      return;
    }

    try {
      const register = await api.post("/auth/register", inputData);
      const data = register.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      toast.success(data?.message);
      localStorage.setItem("mysocialmedia", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
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
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-95">
      <div className="custom-bg1">
        <h1 className="text-center fw-bold mb-4 login-title">
          Register <span style={{ color: "#000" }}>MySocialApp</span>
        </h1>
        <form onSubmit={handelSubmit} className="d-flex flex-column text-dark">
          <div className="d-flex gap-5">
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                htmlFor="email"
                style={{ color: "#000" }}
              >
                <div className="text-start">
                  <span className="fw-bold text-dark fs-5">UserName :</span>
                </div>
              </label>
              <input
                id="username"
                name="username"
                //   ref={emailInputRef}
                type="text"
                onChange={handelInput}
                onKeyDown={handleKeyDown}
                placeholder="Enter UserName"
                required
                className="form-control input-style"
              />
            </div>

            <div className="mb-3">
              <label
                className="form-label fw-bold"
                htmlFor="email"
                style={{ color: "#000" }}
              >
                <div className="text-start">
                  <span className="fw-bold text-dark fs-5">Email :</span>
                </div>
              </label>
              <input
                id="email"
                name="email"
                ref={emailInputRef}
                type="email"
                onChange={handelInput}
                onKeyDown={handleKeyDown}
                placeholder="Enter email"
                required
                className="form-control input-style"
              />
            </div>
          </div>

          <div className="d-flex gap-5">
            <div className="mb-3">
              <label
                className="form-label fw-bold"
                htmlFor="password"
                style={{ color: "#000" }}
              >
                <span className="fw-bold text-dark fs-5">Password :</span>
              </label>
              <input
                ref={passInputRef}
                id="password"
                name="password"
                type="password"
                onChange={handelInput}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                required
                className="form-control input-style"
              />
            </div>

            <div className="mb-3">
              <label
                className="form-label fw-bold"
                htmlFor="password"
                style={{ color: "#000" }}
              >
                <span className="fw-bold text-dark fs-5">
                  Conform Password :
                </span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="text"
                onChange={handelInput}
                onKeyDown={handleKeyDown}
                placeholder="Enter Conform password"
                required
                className="form-control input-style"
              />
            </div>
          </div>

          <div id="gender" className="d-flex justify-around mb-3">
            <label
              className="form-label fw-bold "
              htmlFor="password"
              style={{ color: "#000" }}
            >
              <span className="fw-bold text-dark fs-5 me-3">Male</span>
              <input
                onChange={() => selectGender("male")}
                checked={inputData.gender === "male"}
                type="checkbox"
                className="checkbox checkbox-info"
              />
            </label>

            <label
              className="form-label fw-bold"
              htmlFor="password"
              style={{ color: "#000" }}
            >
              <span className="fw-bold text-dark fs-5 me-3">Female</span>
              <input
                checked={inputData.gender === "female"}
                onChange={() => selectGender("female")}
                type="checkbox"
                className="checkbox checkbox-info"
              />
            </label>
          </div>

          <button
            type="submit"
            className="custom-btn btn mt-3 mx-auto"
            style={{
              backgroundColor: "#000",
              border: "none",
              borderRadius: "5px",
              color: "#fff",
              padding: "10px 20px",
              transition: "transform 0.3s, background-color 0.3s",
            }}
          >
            {loading ? "Loading.." : "Register"}
          </button>
        </form>
        <div className="pt-3 text-center">
          <p className="" style={{ color: "#000" }}>
            Do you have an Account?{" "}
            <Link to={"/login"} className="link-style">
              Login !!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
