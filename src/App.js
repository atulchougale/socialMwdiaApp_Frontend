import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import NavBar from './components/Layout/Navbar'; // Assuming you have a NavBar
import Footer from './components/Layout/Footer'; // Assuming you have a Footer
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CreatePost from './components/posts/CreatePost'; // Import your CreatePost component
import UpdatePost from './components/posts/UpdatePost';
import Post from './pages/Post';
import Profile from './pages/Profile';
import Search from './pages/Search';
import EditProfile from './pages/EditProfile';
import UsersProfile from './pages/UsersProfile';

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? (
    <>
      <NavBar isLoggedIn={isAuthenticated} onLogout={children.props.onLogout} /> 
      {children}
      <Footer /> 
    </>
  ) : (
    <Navigate replace to='/login' />
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') ? true : false
  );

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsAuthenticated(false); // Set isAuthenticated to false
    toast.success('Logged out successfully!');
  };
  return (
    <BrowserRouter>
      <ToastContainer /> 
      <Routes>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

      <Route path='/register' element={<Register />} />

        <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated}>
        <Home onLogout={handleLogout}/>
        </PrivateRoute>} />

        <Route path="/create-post" element={<PrivateRoute isAuthenticated={isAuthenticated}>
        <CreatePost onLogout={handleLogout}/>
        </PrivateRoute>} />

        <Route path="/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}>
        <UpdatePost  onLogout={handleLogout}/> 
        </PrivateRoute>} />

        <Route path="/profile" element={<PrivateRoute isAuthenticated={isAuthenticated}>
        <Profile  onLogout={handleLogout}/> 
        </PrivateRoute>} />

        <Route path="/search" element={<PrivateRoute isAuthenticated={isAuthenticated}>
        <Search  onLogout={handleLogout}/> 
        </PrivateRoute>} />

        <Route path="/edit-profile" element={<PrivateRoute isAuthenticated={isAuthenticated}>
        <EditProfile  onLogout={handleLogout}/> 
        </PrivateRoute>} />

        <Route path="/users-profile/:userId" element={<PrivateRoute isAuthenticated={isAuthenticated}>
        <UsersProfile  onLogout={handleLogout}/> 
        </PrivateRoute>} />

        

      </Routes>
    </BrowserRouter>
  );
};

export default App;
