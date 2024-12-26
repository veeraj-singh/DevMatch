import React, { useState, useEffect } from 'react';
import api from '../utils/axios_instance'; 
import { PlusCircle , Check } from 'lucide-react';

const TaskBoard = ({ workspaceId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const fetchTodoTasks = async () => {
      try {
        const response = await api.get(`/api/tasks/todo?workspaceId=${workspaceId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };

    fetchTodoTasks();
  }, [workspaceId]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await api.post('/api/tasks', {
        title: newTaskTitle,
        workspaceId,
      });
      setTasks((prevTasks) => [response.data, ...prevTasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/api/tasks/${taskId}`, { status: 'completed' });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Failed to complete task', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Task Board</h2>

      {/* Add Task Input */}
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
            }
          }}
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        {tasks.map(task => (
          <div
            key={task._id}
            className="bg-gray-700 rounded-lg p-4 flex justify-between items-center hover:ring-1 hover:ring-green-500 transition-all duration-200"
          >
            <span className="text-gray-200">{task.title}</span>
            <button 
              onClick={() => handleCompleteTask(task._id)}
              className="text-green-400 hover:text-green-500 p-1 hover:bg-gray-600 rounded-full"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        ))}

        {/* No Tasks Message */}
        {tasks.length === 0 && (
          <div className="text-gray-400 text-center py-4">
            No tasks yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;

