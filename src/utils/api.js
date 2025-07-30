
import axios from 'axios';

const isLocal = process.env.NODE_ENV === 'development';

const api = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:5000/api'  
    : 'https://socialmediaapp-4gwv.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;





