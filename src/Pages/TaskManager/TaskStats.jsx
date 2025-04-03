// TaskStats.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TaskStats = () => {
  const { tasks } = useSelector((state) => state.tasks);
  
  // Status distribution data
  const statusCounts = {
    todo: tasks.filter(task => task.status === 'todo').length,
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
  };
  
  const statusData = [
    { name: 'In Progress', value: statusCounts['in-progress'] },
    { name: 'Completed', value: statusCounts.completed },
  ];
  
  // // Priority distribution data
  // const priorityData = [
  //   { name: 'High', value: tasks.filter(task => task.priority === 'high').length },
  //   { name: 'Medium', value: tasks.filter(task => task.priority === 'medium').length },
  //   { name: 'Low', value: tasks.filter(task => task.priority === 'low').length },
  // ];
  
  // Colors for the charts
  const COLORS = ['#ff8a65', '#64b5f6', '#81c784'];
  // const PRIORITY_COLORS = ['#ef5350', '#ffb74d', '#90caf9'];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-4  rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
         
      </div>
      
      {/* Task Completion Rate (simple info) */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-2">Completion Rate</h3>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-bold">
            {tasks.length > 0 
              ? `${Math.round((statusCounts.completed / tasks.length) * 100)}%`
              : '0%'
            }
          </div>
          <p className="text-gray-500 pb-1">tasks completed</p>
        </div>
        
        {/* Simple progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ 
              width: tasks.length > 0 
                ? `${Math.round((statusCounts.completed / tasks.length) * 100)}%`
                : '0%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;