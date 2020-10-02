module.exports.setLocalVariable = (req, res, next) => {
    if (req.session.user) {
        res.locals.username = req.session.user.username;
    }
    next();
};
