import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteTask } from "@/redux/slices/taskSlice";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, MoreVertical, Edit, Trash, Clipboard, ClipboardCheck } from "lucide-react";
import TaskForm from "./TaskForm";

const statusColors = {
  "in-progress": "bg-blue-100 text-blue-800",
  "completed": "bg-green-100 text-green-800",
  "pending": "bg-yellow-100 text-yellow-800"
};

const TaskItem = ({ task: initialTask, index, onTaskUpdate }) => {
  const dispatch = useDispatch();
  const [task, setTask] = useState(initialTask);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);
  
  if (!task || !task._id) {
    return (
      <Card className="bg-white p-4">
        <div className="text-center text-gray-500">
          Task data is loading or unavailable
        </div>
      </Card>
    );
  }
  
  const updateTaskStatus = async (taskId, status) => {
    try {
      setIsUpdating(true);
      const token=localStorage.getItem("token");
      
      if (!token) {
        console.error("Authentication token not found");
        return;
      }
      
      const response = await axios.put(
        `http://localhost:5000/tasks/update-task/${taskId}`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const updatedTask = response.data;
      setTask(updatedTask);
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
      
      console.log(`Task ${taskId} status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (status) => {
    if (!task || !task._id) {
      console.error("Cannot update status: Task ID is missing");
      return;
    }
    updateTaskStatus(task._id, status);
  };
  
  const handleDelete = () => {
    if (!task || !task._id) {
      console.error("Cannot delete: Task ID is missing");
      return;
    }
    dispatch(deleteTask(task._id));
    setIsDeleteDialogOpen(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(task._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); 
  };

  const draggableId = task._id ? task._id.toString() : `task-${index}`;
  
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
                
                {/* Task ID with Copy Icon */}
                <div className="flex items-center text-sm text-gray-500">
                  <p>ID: {task._id}</p>
                  <button onClick={copyToClipboard} className="ml-2 text-gray-500 hover:text-gray-700">
                    {copied ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                  </button>
                </div>

                {/* Status Badge */}
                <Badge className={statusColors[task.status] || "bg-gray-100 text-gray-800"}>
                  {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : "Unknown"}
                </Badge>
              </div>

              {/* Dropdown Menu (Edit & Delete) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-500">
                    <Trash className="h-4 w-4 mr-2" /> Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          {task.description && (
            <CardContent className="py-2">
              <CardDescription className="text-sm text-gray-600">
                {task.description}
              </CardDescription>
            </CardContent>
          )}
          
          <CardFooter className="pt-2 pb-4 flex justify-between items-center">
            

            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isUpdating}>
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
          
          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <TaskForm task={task} onClose={() => setIsEditDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskItem;
