module.exports.setLocalVariable = (req, res, next) => {
        console.log(req.session.user)
    if (req.session.user) {
        res.locals.username = req.session.user.username;
    }
    next();
};
