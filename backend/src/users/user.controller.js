const prisma = require("../../prisma/client");

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMe = async (req, res) => {
  try {
    const { bio, avatarUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        bio,
        avatarUrl,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: req.userId },
      },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getMe, updateMe, listUsers };