const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const useMiddleware = require('./middleware/index')

const port = process.env.PORT || 3000;
let allCoords = []

mongoose.connect('mongodb+srv://raccoon:1qazxsw2@cluster0.redqk.mongodb.net/drawDb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => {
    console.log('DB connected')
})

useMiddleware(app, io);

io.sockets.on('connection', (socket) => {
    socket.emit('setUserName', socket.request.session.user)

    socket.emit('newClientConnect', allCoords);
    socket.on('draw', async (coords) => {
        allCoords.push(coords);
        socket.broadcast.emit('draw', coords);
    })

    socket.on('mouseup', async () => {
        allCoords.push(false);
        socket.broadcast.emit('mouseup')
    })

    socket.on('clear', async () => {
        allCoords = [];
        socket.broadcast.emit('clear')
    })
});

http.listen(port, () => {
    console.log(`Port ${port}`);
});

