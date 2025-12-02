// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './feature/users/userSlice'; 

const store = configureStore({
  reducer: {
    users: userReducer, 
  },
});

export default store;