const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/auth");

const prisma = new PrismaClient();

router.post("/", verifyToken, async (req, res) => {
    const { receiverId } = req.body; 
    const { uid } = req.user; 
    try {
      const sender = await prisma.user.findUnique({ where: { uid } });
      if (!sender) return res.status(404).json({ message: "Sender not found" });

      const completeMatch = await prisma.match.findFirst({
        where: { senderId: receiverId, receiverId: sender.id }
      });
      if (completeMatch) {
        const updatedMatch = await prisma.match.update({
            where: { id: parseInt(completeMatch.id) },
            data: { senderStatus: "accepted", receiverStatus: "accepted" },
        });

        return res.json({ message: "Match response updated", match: updatedMatch });
      }
  
      const existingMatch = await prisma.match.findFirst({
        where: {
          OR :[
            {senderId: sender.id, receiverId},
            { senderId: receiverId, receiverId: sender.id }
          ]
        },
      });
      if (existingMatch) {
        return res.status(400).json({ message: "Match already exists" });
      }

      const newMatch = await prisma.match.create({
        data: {
          senderId: sender.id,
          receiverId,
          senderStatus: "pending",
          receiverStatus: "pending",
        },
      });
  
      res.status(201).json({ message: "Match request sent", match: newMatch });
    } catch (error) {
      res.status(500).json({ message: "Error creating match", error });
    }
  });
  

router.put("/:id", verifyToken, async (req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 
    const { uid } = req.user; 
    
    try {
        const receiver = await prisma.user.findUnique({ where: { uid } });
        if (!receiver) return res.status(404).json({ message: "Receiver not found" });
        
        // console.log(status)
        const updatedMatch = await prisma.match.update({
            where: { id: parseInt(id) },
            data: { senderStatus: status, receiverStatus: status },
        });

        res.json({ message: "Match response updated", match: updatedMatch });
    } catch (error) {
        res.status(500).json({ message: "Error responding to match", error });
    }
});
  

//request pending
router.get("/pending", verifyToken, async (req, res) => {
    const { uid } = req.user; 
  
    try {
      const currentUser = await prisma.user.findUnique({ where: { uid } });
      if (!currentUser) return res.status(404).json({ message: "User not found" });
  
      const pendingMatches = await prisma.match.findMany({
        where: {
          senderId: currentUser.id,
          receiverStatus: "pending",
        },
        include: {
          receiver: { select: { name: true, avatarUrl: true } },
        },
      });
  
      res.json(pendingMatches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending matches", error });
    }
  });


//received and pending
  router.get("/received", verifyToken, async (req, res) => {
    const { uid } = req.user; 
  
    try {
      const currentUser = await prisma.user.findUnique({ where: { uid } });
      if (!currentUser) return res.status(404).json({ message: "User not found" });
  
      const receivedMatches = await prisma.match.findMany({
        where: {
          receiverId: currentUser.id,
          receiverStatus: "pending"
        },
        include: {
          sender: { select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            bio: true,
            skills: true,
            interests: true,
            experience: true,
            location: true,
          } },
        },
      });

      const receivedMatchesres = receivedMatches.map((match) => {
          return {
            id: match.sender.id,
            matchId: match.id ,
            email: match.sender.email,
            name: match.sender.name,
            avatarUrl: match.sender.avatarUrl,
            bio: match.sender.bio,
            skills: match.sender.skills,
            interests: match.sender.interests,
            experience: match.sender.experience,
            location: match.sender.location,
          }
      });
  
      res.json(receivedMatchesres);
    } catch (error) {
      res.status(500).json({ message: "Error fetching received matches", error });
    }
  });


//friends
  router.get("/friends", verifyToken, async (req, res) => {
    const { uid } = req.user; 
  
    try {
      const currentUser = await prisma.user.findUnique({ where: { uid } });
      if (!currentUser) return res.status(404).json({ message: "User not found" });
  
      const finalizedMatches = await prisma.match.findMany({
        where: {
          OR: [
            { senderId: currentUser.id, senderStatus: "accepted", receiverStatus: "accepted" },
            { receiverId: currentUser.id, senderStatus: "accepted", receiverStatus: "accepted" },
          ],
        },
        include: {
          sender: { select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            bio: true,
            skills: true,
            interests: true,
            experience: true,
            location: true,
          } },
          receiver: { select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            bio: true,
            skills: true,
            interests: true,
            experience: true,
            location: true,
          }},
        },
      });
      const friends = finalizedMatches.map((match) => {
        if (match.senderId === currentUser.id) {
          return {
            id: match.receiver.id,
            matchId: match.id ,
            email: match.receiver.email,
            name: match.receiver.name,
            avatarUrl: match.receiver.avatarUrl,
            bio: match.receiver.bio,
            skills: match.receiver.skills,
            interests: match.receiver.interests,
            experience: match.receiver.experience,
            location: match.receiver.location,
          };
        } else {
          return {
            id: match.sender.id,
            matchId: match.id ,
            email: match.sender.email,
            name: match.sender.name,
            avatarUrl: match.sender.avatarUrl,
            bio: match.sender.bio,
            skills: match.sender.skills,
            interests: match.sender.interests,
            experience: match.sender.experience,
            location: match.sender.location,
          };}
      });
  
      res.json(friends);
    } catch (error) {
      res.status(500).json({ message: "Error fetching finalized matches", error });
    }
  });

  router.get('/activechats' , verifyToken , async (req,res) => {
    const { uid } = req.user; 
    try {
      const user = await prisma.user.findUnique({ where: { uid } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const activeChats = await prisma.match.findMany({
        where: {
          OR: [
            { senderId: user.id },
            { receiverId: user.id }
          ]
        },
        include: {
          sender: true,  
          receiver: true, 
        }
      });
      const activeChatsres = activeChats.map(chat => {
        const otherUser = chat.senderId === user.id ? chat.receiver : chat.sender;
        return {
          id: chat.id,
          otherUserId: otherUser.id,
          otherUserName: otherUser.name,
          otherUserAvatar: otherUser.avatar,
          lastMessage: chat.lastMessage,
          lastMessageTimestamp: chat.lastMessageTimestamp,
          unreadCount: user.id === chat.senderId ? chat.unreadCountReceiver : chat.unreadCountSender,
        }
      })
    
      res.status(200).json({res:activeChatsres,userId:user.id})
    }catch (error) {
      res.status(500).json({ error: 'Failed to fetch active chats' });
    }
  });


  router.put('/chat/:matchId' , async (req,res) => {
    const { matchId } = req.params ;
    const { senderId , message} = req.body ;
    try {
      const match = await prisma.match.update({
        where: { id: matchId },
        data: {
          lastMessage: message,  
          lastMessageTimestamp: new Date(),  
          unreadCountReceiver: senderId === match.senderId ? match.unreadCountReceiver : match.unreadCountReceiver + 1,
          unreadCountSender: senderId === match.receiverId ? match.unreadCountSender : match.unreadCountSender + 1,
        },
      });
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: "Error updating chat", error });
    }
  });

  router.put('/urc/:matchId' , verifyToken  , async (req,res) => {
    const { matchId } = req.params ;
    const { uid } = req.user; 
    try {
      const user = await prisma.user.findUnique({ where: { uid } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userId = user.id ;
      const match = await prisma.match.update({
        where: { id: matchId },
        data: {
          unreadCountSender: userId === match.senderId ? 0 : match.unreadCountSender,
          unreadCountReceiver: userId === match.receiverId ? 0 : match.unreadCountReceiver,
        },
      });
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: "Error updating chat unreadcount", error });
    }
  });

  module.exports = router;

  
  
  
