import React, { useRef, useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";
import "../../styles/Auth.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const emailInputRef = useRef(null);
  const passInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { setAuthUser } = useAuth();

  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({});
 

  const handelInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };
  // console.log(userInput);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
        const login = await api.post(`/auth/login`, userInput);
        const data = login.data;
        if (data.success === false) {
            setLoading(false)
            console.log(data.message);
        }
        toast.success(data.message)
        localStorage.setItem('mysocialmedia',JSON.stringify(data));
        setAuthUser(data)
        setLoading(false)
        navigate('/')
    } catch (error) {
        setLoading(false)
        console.log(error);
        toast.error(error?.response?.data?.message)
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
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="custom-bg">
        <h1 className="text-center fw-bold mb-4 login-title">
          Login <span style={{ color: "#000" }}>MySocialApp</span>
        </h1>
        <form onSubmit={handelSubmit} className="d-flex flex-column text-dark">
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
              onChange={handelInput}  // Updated correctly
              onKeyDown={handleKeyDown} // Updated correctly
              placeholder="Enter your email"
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
              <span className="fw-bold text-dark fs-5">Password :</span>
            </label>
            <input
              ref={passInputRef}
              id="password"
              name="password"
              type="password"
              onChange={handelInput} // Updated correctly
              onKeyDown={handleKeyDown} // Updated correctly
              placeholder="Enter your password"
              required
              className="form-control input-style"
            />
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
            {loading ? "Loading.." : "Login"}
          </button>
        </form>
        <div className="pt-3 text-center">
          <p className="" style={{ color: "#000" }}>
            Don't have an Account?{" "}
            <Link to={"/register"} className="link-style">
              Register Now!!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
