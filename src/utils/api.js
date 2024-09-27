
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://socialmediaapp-4gwv.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;



