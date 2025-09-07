

const authRoutes = require('./auth.routes');
const chatRoutes = require('./chat.routes');
const organizationRoutes = require('./organization.route');
const roleRoutes = require('./role.routes');
const express = require('express');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/role', roleRoutes);
router.use('/organization', organizationRoutes);

module.exports = router;
