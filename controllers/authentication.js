const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Email not found!' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: 'Wrong password!' });
    }

    const { id: userId, nama, email: userEmail } = user;

    const access_token = jwt.sign(
      { userId, nama, email: userEmail },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    const refresh_token = jwt.sign(
      { userId, nama, email: userEmail },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    await User.update({ refresh_token }, { where: { id: userId } });

    return res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 1000,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function logout(req, res) {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.sendStatus(204); // No Content
    }

    const user = await User.findOne({ where: { refresh_token } });

    if (!user) {
      return res.sendStatus(403); // Forbidden
    }

    const userId = user.id;
    await User.update({ refresh_token: null }, { where: { id: userId } });

    return res.clearCookie('refresh_token');
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = {
  login,
  logout,
};
