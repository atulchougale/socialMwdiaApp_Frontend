
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://socialmediaapp-4gwv.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});




export default api;




