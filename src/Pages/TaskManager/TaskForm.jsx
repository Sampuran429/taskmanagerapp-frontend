import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "@/redux/slices/taskSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TaskForm = ({ task = null, onClose }) => {
  const initialState = {
    title: "",
    description: "",
  };

  const [formData, setFormData] = useState(task || initialState);
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Task Data:", formData); // Debugging
    dispatch(createTask(formData))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((err) => console.error("Task creation failed:", err));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{task ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Saving..." : "Create Task"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
