const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const useMiddleware = require('./middleware/index')
const Drawing = require('./models/drawing')
const cookieParser = require('cookie-parser');
const User = require('./models/user')

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

useMiddleware(app, io);

io.sockets.on('connection', (socket) => {
    console.log(socket.request.session.user)
    socket.emit('setUserName', socket.request.session.user)

    socket.emit('newClientConnect', drawing.coords);
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

    // socket.on('logout', () => {
    //     console.log(socket.request.sessionID)
        // socket.request.session.destroy();
        // socket.request.res.cookies.clearCookie('user_sid');

    // })

    // socket.on('auth', async (data) => {
    //     const { username, password } = data;
    //     const user = await User.findOne({username});
    //     if (user) {
    //         if (password === user.password) {
    //             socket.emit('ok', user.username);
    //             socket.request.res.session.user = user;
    //         } else {
    //             socket.emit('err', 'authErrPass');
    //         }
    //     } else {
    //         socket.emit('err', 'authErrName')
    //     }
    // })
    //
    // socket.on('reg', async (data) => {
    //     const { username, password } = data;
    //     const userMongo = await User.findOne({username});
    //     if (!userMongo) {
    //         const user = new User({
    //             username,
    //             password
    //         })
    //         await user.save();
    //         socket.emit('ok', username)
    //     } else {
    //         const error = 'regErr'
    //         socket.emit('err', error);
    //     }
    // })
});

function socketKiller(io,idofSocket) {

    let allConnections = io.sockets.connected
    for (let c in allConnections) {
        let userSessionId = allConnections[c].conn.request.sessionID;
        if (idofSocket === userSessionId) {
            allConnections[c].disconnect()
        }
    }
}

// app.get('/logout', (req, res) => {
//     socketKiller(io,req.sessionID)
//     req.session.destroy();
//     res.clearCookie('user_sid');
//     console.log('>>>>>>>>>',res.cookies);
//     res.redirect('/');
// })

http.listen(port, () => {
    console.log(`Port ${port}`);
});

module.exports = {io,socketKiller}
