const express = require('express');
const {
  getAllUser,
  getUserById,
  storeUser,
  updateUser,
  destroyUser,
  tes,
} = require('../controllers/userController');

const router = express.Router();

router.get('/tes/', tes);

router.get('/', getAllUser); //        ? Get all users  -> "GET"    -> /api/users
router.post('/', storeUser); //        ? Create user    -> "POST"   -> /api/users

router.get('/:id', getUserById); //    ? Get user by Id -> "GET"    -> /api/users/:id
router.patch('/:id', updateUser); //     ? Update user    -> "PUT"    -> /api/users/:id
router.delete('/:id', destroyUser); // ? Delete user    -> "DELETE" -> /api/users/:id

module.exports = router;
