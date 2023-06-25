const express = require('express');
const { registerUser } = require('../controllers/registerController');
const { Login, Logout } = require('../controllers/authentication');
const { refreshToken } = require('../controllers/refreshTokenController');
const { verifyToken } = require('../middleware/VerifyToken');
const { isAdmin } = require('../middleware/Admin');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <h1>Sheeesshh !</h1>
    </div>
  `);
});

router.get('/api', (req, res) => {
  res.send(`
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <h1>Welcome to API !</h1>
    </div>
  `);
});

router.post('/api/register', registerUser);
router.post('/api/login', Login);
router.delete('/api/logout', Logout);
router.get('/api/refresh-token', refreshToken);

// ? /api/users
router.use('/api/users', verifyToken, isAdmin, userRoutes);

module.exports = router;
