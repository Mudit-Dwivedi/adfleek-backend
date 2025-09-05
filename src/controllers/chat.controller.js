const chatService = require('../services/chat.service');

const createChat = async (req, res) => {
  try {
    const { userId, title } = req.body;
    
    if (!userId || !title) {
      return res.status(400).json({ error: 'userId and title are required' });
    }

    const chat = await chatService.createChat(userId, title);
    res.status(201).json({
      success: true,
      chat,
      message: 'Chat created successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

const getChatsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chats = await chatService.getChatsByUserId(userId);
    res.status(200).json({
      success: true,
      chats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get chats' });
  }
};

const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await chatService.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get chat' });
  }
};

const addMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messageData = req.body;
    
    const chat = await chatService.addMessage(chatId, messageData);
    res.status(200).json({
      success: true,
      chat,
      message: 'Message added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add message' });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const result = await chatService.deleteChat(chatId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

module.exports = {
  createChat,
  getChatsByUserId,
  getChatById,
  addMessage,
  deleteChat
};