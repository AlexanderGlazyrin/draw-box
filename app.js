const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const User = require('./models/user');

const port = process.env.PORT || 3000;
let allCoords = [];

mongoose.connect('mongodb://localhost:27017/drawDb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => {
        console.log('DB connected')
    })

io.on('connection', (socket) => {
    socket.emit('newClientConnect', allCoords);

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

    socket.on('auth', async (data) => {
        const { username, password } = data;
        const user = User.findOne({username});
        if (user) {
            if (password === user.password) {
                socket.on('ok', username);
            } else {
                socket.emit('err', 'authErrPass');
            }
        } else {
            socket.emit('err', 'authErrName')
        }
    })

    socket.on('reg', async (data) => {
        const { username, password } = data;
        const userMongo = await User.findOne({username});
        if (!userMongo) {
            const user = new User({
                username,
                password
            })
            await user.save();
            socket.emit('ok', username)
        } else {
            const error = 'regErr'
            socket.emit('err', error);
        }
    })
});

http.listen(port, () => {
    console.log(`Port ${port}`);
});
