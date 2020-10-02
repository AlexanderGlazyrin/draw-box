const router = require('express').Router();
const User = require('../models/user');
// const {io,socketKiller} = require('../app');

router.get('/', (req, res) =>{
    res.render('index');
})

router.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username})
    req.session.user = user;

    res.json(req.session.user);
})

router.post('/reg', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({
        username,
        password,
    })
    await user.save();
    req.session.user = user;

    res.json(req.session.user);
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('user_sid');
    res.redirect('/');
})

module.exports = router;
