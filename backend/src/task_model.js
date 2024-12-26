const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  workspaceId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['todo', 'completed'],
    default: 'todo',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
