const prisma = require("../../prisma/client");

const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;

    if (!content || !receiverId) {
      return res.status(400).json({ error: "Content and receiverId are required" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.userId,
        receiverId,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessagesWithUser = async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.userId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessagesWithUser };