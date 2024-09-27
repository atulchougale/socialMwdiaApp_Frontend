import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postsSlice';

import Post from './Post';




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
                            <p>No posts available.</p>
                        )}
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default Home;
