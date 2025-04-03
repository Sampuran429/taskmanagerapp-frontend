import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, ListTodo, PlusCircle } from "lucide-react";
import TaskForm from "../TaskManager/TaskForm";
import TaskList from "../TaskManager/TaskList";
import TaskStats from "../TaskManager/TaskStats";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  
  
  
  
  const { tasks } = useSelector((state) => state.tasks);
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
  const todoTasks = tasks.filter(task => task.status === "pending").length;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>
        <div className="flex items-center gap-4">
          <Button className="hidden md:flex" onClick={() => setIsAddTaskOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Task
          </Button>
          

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="font-medium text-blue-600">
                {user?.fullname.firstname?.charAt(0) || "U"}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.fullname.firstname || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 md:p-8 flex-1">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullname.firstname?.split(' ')[0] || "User"}!</h2>
        <p className="text-gray-600 mt-1">Here's an overview of your tasks for today.</p>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <ListTodo className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                  <h3 className="text-2xl font-bold text-gray-900">{tasks.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <h3 className="text-2xl font-bold text-gray-900">{inProgressTasks}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <h3 className="text-2xl font-bold text-gray-900">{completedTasks}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tasks" className="mt-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>Manage and organize your tasks efficiently.</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Task Analytics</CardTitle>
                <CardDescription>Monitor your productivity and task completion rate.</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskStats />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Add Task Button */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
              <PlusCircle className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <TaskForm onClose={() => setIsAddTaskOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashBoard;


