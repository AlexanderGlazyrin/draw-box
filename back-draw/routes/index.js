const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const {check, validationResult} = require('express-validator');
require('dotenv').config();

router.post('/reg', [
  check('username', 'Введите имя').exists(),
  check('password', 'Минимальная длина пароля 6 символов').isLength({
    min: 6,
  }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Некорректные данные при регистрации',
    });
  }
  try {
    const {username, password} = req.body;
    const candidate = await User.findOne({username});
    if (candidate) {
      return res.status(400).json({error: true, message: 'Пользователь с данным именем уже существует'})
    }
    const hashedPassword = await bcrypt.hash(password, 14);
    const user = await new User({username, password: hashedPassword});
    await user.save();
    const token = jwt.sign({
        userId: user._id,
      }, process.env.TOKEN_KEY,
      {expiresIn: '1h'})
    res.status(201).json({
      message: 'Пользователь успешно создан',
      token,
      user: {
        username: user.username,
        id: user._id,
      },
    })
  } catch (error) {
    res.status(500).json({message: 'Что то пошло не так на сервере'});
  }
})

router.post('/auth', [
  check('password', 'Введите пароль').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
      message: 'Некорректные данные при входе в систему',
    });
  }
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(400).json({
        error: true,
        message: 'Пользователь с таким email еще не зарегистрирован',
      });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        error: true,
        message: 'Введен некорректный пароль',
      });
    }
    const token = jwt.sign({
        userId: user._id,
      }, process.env.TOKEN_KEY,
      {expiresIn: '1h'})
    res.json({
      message: 'Пользователь авторизован',
      token,
      user: {
        username: user.username,
        id: user._id,
      },
    })
  } catch (error) {
    res.status(500).json({message: 'Что то пошло не так на сервере'});
  }
})

router.post('/check', async (req, res) => {
  const {token} = req.body;
  const userToken = await jwtDecode(token);
  const {userId} = userToken;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({error: true, message: 'Необходимо авторизоваться'});
  }
  return res.json({
    message: 'Пользователь авторизован',
    user: {
      username: user.username,
      id: user._id
    },
  })
})

module.exports = router;
