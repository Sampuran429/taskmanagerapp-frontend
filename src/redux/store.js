import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/taskSlice"; // Import the task slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication slice
    tasks: taskReducer, // Task management slice
  },
});

export default store;


