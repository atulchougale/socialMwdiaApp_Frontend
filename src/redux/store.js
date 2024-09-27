
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../redux/postsSlice';

const store = configureStore({
    reducer: {
        posts: postsReducer,
    },
});

export default store;
