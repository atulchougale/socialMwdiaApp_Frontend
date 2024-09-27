import React, { useEffect, useState } from 'react';
import api from '../utils/api'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postsSlice';
import NavBar from '../components/Layout/Navbar'; 
import Footer from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import Post from './Post';

import { isLoggedIn as checkLoggedIn } from '../utils/Auth'; 


const Home = () => {

    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);
    const navigate = useNavigate();
    
    
    const [isLoggedIn, setIsLoggedIn] = useState(checkLoggedIn()); 
    const handleLogout = () => {
        
        localStorage.removeItem('token'); 
        setIsLoggedIn(false); 
        navigate('/login'); 
    };
  

    return (
        <div>
            <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <div className="container mt-4 ">
               
                
                {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <div>
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <Post key={post._id} post={post} /> 
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Home;
