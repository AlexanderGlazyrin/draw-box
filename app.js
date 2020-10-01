const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// const path = require('path')
const cors = require('cors');

let allCoords = [];

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'index.html'));
    res.send('ok')
})

app.use(cors);

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
});

http.listen(3000);
