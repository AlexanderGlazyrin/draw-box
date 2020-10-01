const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const session = require('express-session')
const FileStore = require('session-file-store')(session);
// const sharedsession = require("express-socket.io-session");
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const cors = require('cors');

const port = process.env.PORT || 3000;
let allCoords = [];

mongoose.connect('mongodb://localhost:27017/drawDb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => {
        console.log('DB connected')
    })

const sessionObject = session({
    store: new FileStore(),
    name: 'user_sid',
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    unset: `destroy`,
    cookie: {
        expires: 600000,
    },
});
app.use(cors());

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(cookieParser())

io.use(function(socket, next) {
    sessionObject(socket.request, socket.request.res, next);
})
app.use(sessionObject);
app.get('/', (req, res) =>{
    res.json(req.session.user)
})
app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username})
    req.session.user = user;

    res.json(req.session.user);
})

app.post('/reg', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({
        username,
        password,
    })
    await user.save();
    req.session.user = user;

    res.json(req.session.user);
})
// io.use(sharedsession(sessionObject, cookieParser()));

io.on('connection', (socket) => {
    socket.emit('newClientConnect', allCoords);
    // socket.emit('test', socket.handshake.session.user);

    socket.on('draw', (coords) => {
        allCoords.push(coords);
        socket.broadcast.emit('draw', coords);
    })

    socket.on('mouseup', () => {
        allCoords.push(false);
        socket.broadcast.emit('mouseup')
    })

    socket.on('clear', () => {
        allCoords = [];
        socket.broadcast.emit('clear')
    })

    // socket.on('auth', async (data) => {
    //     const { username, password } = data;
    //     const user = await User.findOne({username});
    //     if (user) {
    //         if (password === user.password) {
    //             // socket.handshake.session.user = user;
    //             // socket.handshake.session.save();
    //             socket.emit('ok', user.username);
    //         } else {
    //             socket.emit('err', 'authErrPass');
    //         }
    //     } else {
    //         socket.emit('err', 'authErrName')
    //     }
    // })

    // socket.on('reg', async (data) => {
    //     const { username, password } = data;
    //     const userMongo = await User.findOne({username});
    //     if (!userMongo) {
    //         const user = new User({
    //             username,
    //             password
    //         })
    //         await user.save();
    //         socket.handshake.session.user = user;
    //         socket.handshake.session.save();
    //         socket.emit('ok', username)
    //     } else {
    //         const error = 'regErr'
    //         socket.emit('err', error);
    //     }
    // })
});

http.listen(port, () => {
    console.log(`Port ${port}`);
});
