import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL (Fixed: No trailing `/`)
const API_URL = "https://taskmanagerapplicationsam.onrender.com";

// Fetch Tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/getall`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data || []; // Ensure an array is returned
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create Task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/create`, taskData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updatedTaskData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!taskId) {
        console.error("Task ID is undefined! Cannot update task.");
        return rejectWithValue("Task ID is required.");
      }

      if (!token) {
        throw new Error("User is not authenticated");
      }

      console.log(`Updating task: ${API_URL}/update-task/${taskId}`);

      const response = await axios.put(
        `${API_URL}/update-task/${taskId}`,
        updatedTaskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { taskId, updatedTask: response.data.task };
    } catch (error) {
      console.error("Update task error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to update task");
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!taskId) {
        throw new Error("Task ID is undefined");
      }

      if (!token) {
        throw new Error("User is not authenticated");
      }

      console.log(`Deleting task: ${API_URL}/delete-task/${taskId}`);

      await axios.delete(`${API_URL}/delete-task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return taskId; // Return taskId for state update
    } catch (error) {
      console.error("Error deleting task:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to delete task");
    }
  }
);

// Task Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload; // Used for UI updates like sorting
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload.taskId ? { ...task, ...action.payload.updatedTask } : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setTasks } = taskSlice.actions;
export default taskSlice.reducer;
