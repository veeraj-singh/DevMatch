const express = require('express');
const router = express.Router();
const { MatchMessage, WorkspaceMessage } = require('../message_model');
const verifyToken = require("../middlewares/auth.js");


router.get('/match/:matchId', verifyToken, async (req, res) => {
  const { matchId } = req.params;
  const { page = 0, limit = 20 } = req.query; // Default to page 0 and limit 20 messages per page

  try {
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const messages = await MatchMessage.find({ matchId })
      .sort({ timestamp: -1 }) 
      .skip(pageNumber * pageSize) 
      .limit(pageSize); 

    const totalMessages = await MatchMessage.countDocuments({ matchId });
    const hasMore = (pageNumber + 1) * pageSize < totalMessages;
  
    res.status(200).json({
      messages,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});



router.get('/workspace/:workspaceId', verifyToken , async (req, res) => {
  const { workspaceId } = req.params;
  const { page = 0, limit = 20 } = req.query; // Default to page 0 and limit 20 messages per page

  try {
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const messages = await WorkspaceMessage.find({ workspaceId })
      .sort({ timestamp: -1 }) 
      .skip(pageNumber * pageSize) 
      .limit(pageSize); 

    const totalMessages = await WorkspaceMessage.countDocuments({ workspaceId });
    const hasMore = (pageNumber + 1) * pageSize < totalMessages;
  
    res.status(200).json({
      messages,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router ;
