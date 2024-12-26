const express = require('express');
const router = express.Router();
const Task = require('../task_model'); 

router.get('/todo', async (req, res) => {
  const { workspaceId } = req.query;

  if (!workspaceId) {
    return res.status(400).json({ error: 'workspaceId is required' });
  }

  try {
    const tasks = await Task.find({ workspaceId, status: 'todo' }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  const { title, workspaceId } = req.body;
  try {
    const task = await Task.create({
      title,
      workspaceId,
      status: 'todo',
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update task status
router.patch('/:taskId', async (req, res) => {

  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      {new: true}
    );
    console.log(task)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
