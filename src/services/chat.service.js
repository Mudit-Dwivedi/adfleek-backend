const Chat = require('../models/chat.model');

const createChat = async (userId, title) => {
  try {
    const chat = await Chat.create({
      userId,
      title,
      messages: []
    });
    return chat;
  } catch (error) {
    throw error;
  }
};

const getChatsByUserId = async (userId) => {
  try {
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    return chats;
  } catch (error) {
    throw error;
  }
};

const getChatById = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId);
    return chat;
  } catch (error) {
    throw error;
  }
};

const addMessage = async (chatId, messageData) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: messageData } },
      { new: true }
    );
    return chat;
  } catch (error) {
    throw error;
  }
};

const deleteChat = async (chatId) => {
  try {
    await Chat.findByIdAndDelete(chatId);
    return { success: true, message: 'Chat deleted successfully' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createChat,
  getChatsByUserId,
  getChatById,
  addMessage,
  deleteChat
};