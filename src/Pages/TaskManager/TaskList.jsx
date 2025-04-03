import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "@/redux/slices/taskSlice";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TaskItem from "./TaskItem";

import { DragDropContext,Droppable } from "@hello-pangea/dnd";
const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskId, setTaskId] = useState("");
  const [singleTask, setSingleTask] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch({ type: "tasks/searchTasks", payload: searchTerm });
  };

  // Get user token from localStorage or your auth context
  const getUserToken = () => {
    return localStorage.getItem("userToken") || "";
  };

  const searchTaskById = async (e) => {
    e.preventDefault();
    if (!taskId.trim()) return;
    
    setSearchLoading(true);
    setSingleTask(null);
    setSearchError(null);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tasks/get-task/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
      
      if (response.data) {
        setSingleTask(response.data);
      }
    } catch (err) {
      setSearchError(err.response?.data?.message || "Task not found");
    } finally {
      setSearchLoading(false);
    }
  };

  const resetTaskSearch = () => {
    setTaskId("");
    setSingleTask(null);
    setSearchError(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
  
    const reorderedTasks = [...tasks];
    const [reorderedItem] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, reorderedItem);
  
    dispatch({ type: "tasks/setTasks", payload: reorderedTasks });
  };

  if (loading && tasks.length === 0) {
    return <div className="flex justify-center p-8">Loading tasks...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        
        {/* Search by ID form */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <form onSubmit={searchTaskById} className="w-full sm:w-auto flex space-x-2">
            <Input
              placeholder="Enter task ID..."
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button 
              type="submit" 
              variant="outline"
              disabled={searchLoading}
            >
              {searchLoading ? "Searching..." : "Find by ID"}
            </Button>
            {singleTask && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={resetTaskSearch}
              >
                Clear
              </Button>
            )}
          </form>
        </div>
        
        {/* Error message for task search by ID */}
        {searchError && (
          <div className="text-red-500 p-2">{searchError}</div>
        )}
      </div>
      
      {/* Display single task from direct search if found */}
      {singleTask ? (
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="single-task">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="border p-4 rounded-lg"
              >
                <h3 className="text-lg font-medium mb-2">Found Task:</h3>
                <TaskItem task={singleTask} index={0} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        // Original task list display
        tasks.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {tasks.map((task, index) => (
                    <TaskItem key={task._id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )
      )}
    </div>
  );
};

export default TaskList;
