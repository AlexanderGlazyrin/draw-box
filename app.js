const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path')

const allCoords = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

io.on('connection', (socket) => {
    socket.on('draw', (coords) => {
        socket.broadcast.emit('draw', coords);
    })

    socket.on('mouseup', () => {
        socket.broadcast.emit('mouseup')
    })
});

http.listen(3000);
