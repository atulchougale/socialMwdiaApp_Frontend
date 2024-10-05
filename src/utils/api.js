
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'|| 'https://socialmediaapp-4gwv.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});




export default api;




