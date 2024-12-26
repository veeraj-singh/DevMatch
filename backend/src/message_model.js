const mongoose = require('mongoose');

// Match Messages Schema
const MatchMessageSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MatchMessage = mongoose.model('MatchMessage', MatchMessageSchema);

const WorkspaceMessageSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const WorkspaceMessage = mongoose.model('WorkspaceMessage', WorkspaceMessageSchema);

module.exports = { MatchMessage, WorkspaceMessage };
