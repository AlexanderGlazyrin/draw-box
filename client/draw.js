const socket = io('http://localhost:3000');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const nav = document.querySelector('nav');
let isMouseDown = false;

canvas.width = 1300;
canvas.height = 700;
const canvasCoords = canvas.getBoundingClientRect();

ctx.lineWidth = 10;
ctx.fillStyle = 'blue';
ctx.strokeStyle = 'blue';

function painting(x, y) {

    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clear() {
    const originColor = ctx.fillStyle;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = originColor;
}

window.addEventListener('keypress', (e) => {
    if (e.code === 'KeyD') {
        clear();
        socket.emit('clear');
    }
});

canvas.addEventListener('mousedown', () => {
    isMouseDown = true;
})

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    ctx.beginPath();
    socket.emit('mouseup');
})

canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        const x = e.pageX - canvasCoords.left;
        const y = e.pageY - canvasCoords.top;

        socket.emit('draw', { x, y });
        painting(x, y);
    }
})

socket.on('draw', (coords) => {
    const { x, y } = coords;

    socket.on('mouseup', () => {
        ctx.beginPath();
    });
    painting(x, y);
});

socket.on('newClientConnect', (allCoords) => {
    allCoords.forEach((coords) => {
        if (typeof coords === 'object') {
            painting(coords.x, coords.y)
        } else {
            ctx.beginPath();
        }
    })
})

socket.on('clear', () => {
    clear();
})
