const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/auth");

const prisma = new PrismaClient();

router.post("/", verifyToken, async (req, res) => {
    const { uid, email } = req.user; 
    try {
      let user = await prisma.user.findUnique({ where: { uid } });
    
      if (!user) {
        user = await prisma.user.create({
          data: {
            uid,
            email,
          },
        });
       res.status(201).json({ message: "User created successfully", firstTime : true });
      }
      else{
        res.status(201).json({ message: "User already exist", firstTime : false });
      }
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  });

  router.get("/", verifyToken , async (req, res) => {
    const { uid } = req.user;
  
    try {
      const user = await prisma.user.findUnique({
        where: { uid },
        select: {
          id: true,
          uid: true,
          email: true,
          name: true,
          avatarUrl: true,
          bio: true,
          skills: true,
          interests: true,
          experience: true,
          location: true,
        },
      });
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/search', async (req, res) => {
    try {
      const { query, page = 1, limit = 6 } = req.query;
  
      if (!query) {
        return res.status(400).json({ error: 'Search term is required.' });
      }
  
      const offset = (page - 1) * limit;
  
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          bio: true,
          skills: true,
          interests: true,
          experience: true,
          location: true,
        },
        skip: parseInt(offset),
        take: parseInt(limit)
      });
  
      const totalCount = await prisma.user.count({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        }
      });
  
      res.json({
        users,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit)
      });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'An error occurred while searching for users.' });
    }
  });
  

  
router.put("/", verifyToken, async (req, res) => {
    const { name, avatarUrl, bio, skills, interests, experience, location } = req.body;
    
    try {
      const updatedUser = await prisma.user.update({
        where: { uid: req.user.uid },
        data: {
          name,
          avatarUrl,
          bio,
          skills,
          interests,
          experience : parseInt(experience),
          location,
        },
      });
      
      res.status(200).json({ message: "User profile updated", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Error updating user profile", error });
    }
  });
  
module.exports = router;
