import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { BiLogOut } from "react-icons/bi";
import { confirmAlert } from "react-confirm-alert";

const NavBar = () => {
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState();

  const handleLogOut = async () => {
    confirmAlert({
      title: "Confirm to Logout",
      message: "Are you sure you want to Logout?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            setLoading(true);
            try {
              const logout = await api.post("/auth/logout");
              const data = logout.data;
              if (data?.success === false) {
                setLoading(false);
                console.log(data?.message);
              }
              toast.info(data?.message);
              localStorage.removeItem("mysocialmedia");
              setAuthUser(null);
              setLoading(false);
              navigate("/login");
            } catch (error) {
              setLoading(false);
              console.log(error);
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  return (
    <>
      <style>
        {`

        .nav-dropdown {
            z-index: 1000;
            color: white;  
        }
        .dropdown-toggle {
            color: white; 
        }

        .dropdown-menu {
            background-color: #343a40; 
            z-index: 1000; 
        }

        .dropdown-item {
            color: #ffffff; /* White color for dropdown items */
        }

        .dropdown-item:hover {
            background-color: #495057; /* Darker background on hover */
            color: #ffffff; /* Ensure text stays white on hover */
        }
    `}
      </style>

      <Navbar
        className="blurred-navbar rounded-xl shadow-lg
      bg-gray-400 bg-clip-padding
      backdrop-filter backdrop-blur-lg mt-3 mb-3 
      bg-opacity-0"
        expand="lg"
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="font-weight-bold text-white"
          >
            𝕄𝕐 Social Media
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ borderColor: "white" }}
          >
            <span
              className="navbar-toggler-icon text-white"
              style={{ filter: "invert(1)" }}
            />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                className="font-weight-bold text-white"
                as={Link}
                to="/"
              >
                Home
              </Nav.Link>
              <Nav.Link
                className="font-weight-bold text-white"
                as={Link}
                to="/create-post"
              >
                Create Post
              </Nav.Link>
              <Nav.Link
                className="font-weight-bold text-white"
                as={Link}
                to="/about"
              >
                About
              </Nav.Link>
              <Nav.Link
                className="font-weight-bold text-white"
                as={Link}
                to="/contact"
              >
                Contact
              </Nav.Link>
              <Nav.Link
                className="font-weight-bold text-white"
                as={Link}
                to="/search"
              >
                Search
              </Nav.Link>
            </Nav>

            <Nav>
              {authUser && (
                <Nav.Link
                  className="font-weight-bold text-white"
                  as={Link}
                  to="/chat"
                >
                  Message
                </Nav.Link>
              )}

              {authUser ? (
                <NavDropdown title="Profile" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    className="font-weight-bold"
                    as={Link}
                    to="/profile"
                  >
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <div className="d-flex align-items-center">
                      <button
                        onClick={handleLogOut}
                        className="btn btn-danger btn-sm d-flex align-items-center font-weight-bold"
                      >
                        <BiLogOut size={20} />
                        <span className="ml-2 font-weight-bold">Logout</span>
                      </button>
                    </div>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  className="font-weight-bold text-white"
                  as={Link}
                  to="/login"
                >
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
