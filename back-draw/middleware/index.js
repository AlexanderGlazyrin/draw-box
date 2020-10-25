const express = require('express');
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const indexRouter = require('../routes');
const cookieCleaner = require('./cleaner');

module.exports = (app, io) => {

    app.use(cors());

    app.use(express.urlencoded({ extended: true}));
    app.use(express.json());
    // app.use(express.static(path.join(__dirname, '..', 'public')))

    app.use(cookieParser())

    const sessionObject = session({
        store: new FileStore(),
        name: 'user_sid',
        secret: 'secret',
        resave: true,
        saveUninitialized: false,
        cookie: {
            expires: 6000000,
        },
    });

    io.use(function(socket, next) {
        sessionObject(socket.request, socket.request.res, next);
    })

    app.use(sessionObject);

    app.use(cookieCleaner)

    app.use(indexRouter);
}
