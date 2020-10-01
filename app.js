const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const useMiddleware = require('./middleware/index')
const Drawing = require('./models/drawing')
// const sharedsession = require("express-socket.io-session");

const port = process.env.PORT || 3000;
let drawing = {};

async function getDraw() {
    drawing = await Drawing.findOne({ name: 'coords1'});

    if (!drawing) {
        drawing = new Drawing({
            name: 'coords1',
            coords: [],
        });

        await drawing.save();
    }
}

getDraw();

mongoose.connect('mongodb://localhost:27017/drawDb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => {
    console.log('DB connected')
})

useMiddleware(app);

// io.use(function(socket, next) {
//     sessionObject(socket.request, socket.request.res, next);
// })

// io.use(sharedsession(sessionObject, cookieParser()));

io.on('connection', (socket) => {
    socket.emit('newClientConnect', drawing.coords);
    // socket.emit('test', socket.handshake.session.user);

    socket.on('draw', async (coords) => {

        drawing.coords.push(coords);
        await drawing.save();
        socket.broadcast.emit('draw', coords);
    })

    socket.on('mouseup', async () => {
        drawing.coords.push(false);
        await drawing.save();
        socket.broadcast.emit('mouseup')
    })

    socket.on('clear', async () => {
        drawing.coords = [];
        await drawing.save();
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
