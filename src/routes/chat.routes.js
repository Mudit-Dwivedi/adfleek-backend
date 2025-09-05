const chatController = require('../controllers/chat.controller');
const express = require('express');
const router = express.Router();

router.post('/create', chatController.createChat);
router.get('/user/:userId', chatController.getChatsByUserId);
router.get('/:chatId', chatController.getChatById);
router.post('/:chatId/message', chatController.addMessage);
router.delete('/:chatId', chatController.deleteChat);

module.exports = router;