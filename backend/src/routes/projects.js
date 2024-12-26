const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/auth");

const prisma = new PrismaClient();

router.post("/", verifyToken ,async (req, res) => {
  const { title, description , skills , tags } = req.body;
  const { uid } = req.user; 

  try {
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          title,
          description,
          skills, 
          tags,
          createdById: user.id, // Reference the user's database ID
        },
      });

      await tx.workspace.create({
        data: {
          projectId: newProject.id,
          members: {
            create: {
              userId: user.id,
              role: 'OWNER'
            }
          }
        }
      });
      return newProject;
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Project creation failed' });
  }
});


router.get("/", verifyToken , async (req, res) => {
  const { uid } = req.user; 
  try {
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const projects = await prisma.project.findMany({
      where : {createdById : user.id } ,
      include: {
        createdBy: { select: { id: true, name: true, email: true } }, // Optional: Include user details
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

router.get("/bulk", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } }, // Optional: Include user details
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description , skills , tags } = req.body;
  try {
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { title, description , skills , tags },
    });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
});


router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    await prisma.$transaction([
      // Delete project interests
      prisma.projectInterest.deleteMany({
        where: { projectId: parseInt(id) }
      }),
      // First, delete workspace members
      prisma.workspaceMember.deleteMany({
        where: { 
          workspace: { 
            projectId: parseInt(id) 
          } 
        }
      }),
      // Then delete the workspace
      prisma.workspace.deleteMany({
        where: { projectId: parseInt(id) }
      }),
      // Finally delete the project
      prisma.project.delete({ 
        where: { id: parseInt(id) } 
      })
    ]);
    
    res.status(204).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
});


router.get('/myworkspaces', verifyToken , async (req, res) => {
  const { uid} = req.user ;

  try {
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userWorkspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: parseInt(user.id),
          },
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title : true, // Assuming Project has a 'name' field
          },
        },
        members: {
          where: {
            userId: parseInt(user.id),
          },
          select: {
            role: true,
          },
        },
      },
    });
    
    // Map data into the desired format
    const workspaces = userWorkspaces.map((workspace) => ({
      workspaceId: workspace.id,
      projectId: workspace.project.id,
      projectTitle: workspace.project.title,
      role: workspace.members[0]?.role || "UNKNOWN", // Role of the user in this workspace
    }));

    res.status(200).json({res:workspaces,userId:user.id});
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    res.status(500).json({ error: "Failed to fetch user workspaces." });
  }
});


router.post('/:projectId/interest', verifyToken , async (req, res) => {
  const { projectId } = req.params;
  const { uid } = req.user; 

  try {
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if interest already exists
    const existingInterest = await prisma.projectInterest.findFirst({
      where: {
        projectId: parseInt(projectId),
        userId : user.id
      }
    });
    
    if (existingInterest) {
      return res.status(400).json({ error: 'Interest already expressed' });
    }
    // Create project interest
    const interest = await prisma.projectInterest.create({
      data: {
        projectId: parseInt(projectId),
        userId : user.id,
        status: 'PENDING'
      }
    });
    
    res.status(201).json(interest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to express interest' });
  }
});


router.put('/:projectId/interests/:interestId/respond', verifyToken , async (req, res) => {
  const { projectId, interestId } = req.params;
  const { status } = req.body; // ACCEPTED or REJECTED

  try {
    // Update interest status in transaction
    console.log(status)
    const updatedInterest = await prisma.$transaction(async (tx) => {
      // Update interest status
      const interest = await tx.projectInterest.update({
        where: {
          id: parseInt(interestId),
          projectId: parseInt(projectId)
        },
        data: {
          status
        }
      });

      // If accepted, add to workspace
      if (status === 'ACCEPTED') {
        // Find project's workspace
        const workspace = await tx.workspace.findUnique({
          where: { projectId: parseInt(projectId) }
        });

        if (workspace) {
          // Add user to workspace
          await tx.workspaceMember.create({
            data: {
              workspaceId: workspace.id,
              userId: interest.userId,
              role: 'MEMBER'
            }
          });
        }
      }

      return interest;
    });

    res.json(updatedInterest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to respond to interest' });
  }
});


router.get('/:projectId/interests', verifyToken ,async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.query;

  try {
    console.log(status)
    const interests = await prisma.projectInterest.findMany({
      where: {
        projectId: parseInt(projectId),
        // Only add status filter if it's provided
        ...(status ? { status } : {})
      },
      include: {
        user: true
      }
    });

    res.json(interests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project interests' });
  }
});


router.get('/:projectId/members', verifyToken , async (req, res) => {
  const { projectId } = req.params;

  try {

    const workspace = await prisma.workspace.findUnique({
      where: { projectId: parseInt(projectId) },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json(workspace.members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workspace members' });
  }
});


module.exports = router;
