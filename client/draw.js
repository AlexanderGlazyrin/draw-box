const socket = io('http://localhost:3000');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const brushBtn = document.querySelector('#brush');
const brushSet = document.querySelector('#brush-set');
const btnOk = document.querySelector('.btn-ok');
const btnCancel = document.querySelector('.btn-cancel');
const colors = document.querySelectorAll('.color');
const selectSize = document.querySelector('.select-size');
const colorsBox = document.querySelector('#colors');
const check = document.querySelector('.check');
let isMouseDown = false;

canvas.width = 1300;
canvas.height = 700;
const canvasCoords = canvas.getBoundingClientRect();

sizeofbrush = 10;
colorBrush = 'red'
ctx.lineWidth = sizeofbrush;
ctx.fillStyle = colorBrush;
ctx.strokeStyle = colorBrush;

function painting(x, y) {

    ctx.lineWidth = sizeofbrush;
    ctx.fillStyle = colorBrush;
    ctx.strokeStyle = colorBrush;
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, sizeofbrush / 2, 0, Math.PI * 2);
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

brushBtn.addEventListener('click', (e) => {
    brushSet.classList.remove('hide');
    brushSet.classList.add('show');
});

btnCancel.addEventListener('click', () => {
    brushSet.classList.remove('show');
    brushSet.classList.add('hide');
});

btnOk.addEventListener('click', () => {
    brushSet.classList.remove('show');
    brushSet.classList.add('hide');
    sizeofbrush = +selectSize.value;
})

colorsBox.addEventListener('click', (e) => {
    if (e.target.classList.contains('color')) {
        colors.forEach((el) => {
            if (el.classList.contains('activ')) {
                colors.forEach((elem) => {
                    elem.classList.remove('activ')
                });
                e.target.classList.add('activ');
                e.target.appendChild(check);
                colorBrush = e.target.id;
            }
        });
    }
})

document.addEventListener('DOMContentLoaded', function() {
    const sidenav = document.querySelectorAll('.sidenav');
    const instances = M.Sidenav.init(sidenav);
    const select = document.querySelectorAll('select');
    const instances2 = M.FormSelect.init(select);
});

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

        socket.emit('draw', { x, y, color: colorBrush, size: sizeofbrush });
        painting(x, y);
    }
})

socket.on('draw', (coords) => {
    const { x, y, color, size } = coords;
    colorBrush = color;
    sizeofbrush = size;

    socket.on('mouseup', () => {
        ctx.beginPath();
    });
    painting(x, y);
});

socket.on('newClientConnect', (allCoords) => {
    allCoords.forEach((coords) => {
        if (coords) {
            colorBrush = coords.color;
            sizeofbrush = coords.size;
            painting(coords.x, coords.y)
        } else {
            ctx.beginPath();
        }
    })
})

socket.on('clear', () => {
    clear();
})
