import React from "react";
import { Routes, Route,} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import NavBar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CreatePost from "./components/posts/CreatePost";
import UpdatePost from "./components/posts/UpdatePost";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import EditProfile from "./pages/EditProfile";
import UsersProfile from "./pages/UsersProfile";
import { VerifyUser } from "./utils/VerifyUser";
import Chat from "./pages/chat/Chat";


const App = () => {
  return (
    <>
      
      <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          </Routes>
          <Routes>
          <Route element={<VerifyUser />}>
            
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit/:id" element={<UpdatePost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/users-profile/:userId" element={<UsersProfile />} />
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />

          </Route>
          
        </Routes>
        <Footer />
        <ToastContainer />
     
    </>
  );
};

export default App;
