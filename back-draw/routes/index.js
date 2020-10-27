const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/auth', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username})
    if (user) {

    } else {

    }
})

router.post('/reg', async (req, res) => {
    const {username, password} = req.body;
    if (!await User.findOne({username})) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            password: hashedPassword,
        })
        await user.save();
    } else {

    }

})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('user_sid');
    res.redirect('/');
})

module.exports = router;
