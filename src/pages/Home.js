import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postsSlice';

import Post from './Post';
import "../styles/Home.css"




const Home = () => {

    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector((state) => state.posts);
    // console.log("home",posts);
    
    
    
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);
    
  

    return (
        <div>
            
            <div className="container mt-4 ">
               
                
                {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <div>
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <Post key={post._id} post={post}  /> 
                            ))
                        ) : (
                            <div className='container d-flex justify-content-center align-items-center shadow-box ' style={{shadow:"0 0.125rem 0.25rem rgba(1, 1, 2, 0.075)", width:"50%"}}>
                            <p>No posts available.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default Home;
