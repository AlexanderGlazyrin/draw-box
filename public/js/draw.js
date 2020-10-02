const socket = io();
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const brushSet = document.querySelector('#brush-set');
const btnOk = document.querySelector('.btn-ok');
const btnCancel = document.querySelector('.btn-cancel');
const colors = document.querySelectorAll('.color');
const selectSize = document.querySelector('.select-size');
const colorsBox = document.querySelector('#colors');
const check = document.querySelector('.check');
const navWrap = document.querySelector('.nav-wrapper');
const paintingUser = document.querySelector('.painting-user');
const formsRegAuth = document.querySelector('#reg-auth');
const regForm = document.querySelector('.signup-form');
const authForm = document.querySelector('.signin-form');
const usernameNav = document.querySelector('.user-name-nav');
const logoutBtn = document.querySelector('.logout');
let currentUser = 'Unknown user';
let isMouseDown = false;

canvas.width = 1300;
canvas.height = 700;
const canvasCoords = canvas.getBoundingClientRect();

sizeofbrush = 10;
colorBrush = 'red'
ctx.lineWidth = sizeofbrush;
ctx.fillStyle = colorBrush;
ctx.strokeStyle = colorBrush;

function tog(...elems) {
    elems.forEach((el) => {
       el.classList.toggle('show');
       el.classList.toggle('hide');
    });
}

function hide(...elems) {
    elems.forEach((el) => {
        el.classList.remove('show');
        el.classList.add('hide');
    });
}

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

if (regForm) {
    regForm.addEventListener('submit',  (e) => {
        e.preventDefault();

        const {
            username: { value: username },
            password: { value: password },
            method
        } = e.target;

        fetch('http://localhost:3000/reg', {
            method,
            headers: {'Content-type': 'Application/json'},
            body: JSON.stringify({ username, password })
        }).then((us) => {
            return us.json();
        }).then((us) => {
            currentUser = us.username;
            usernameNav.innerHTML = currentUser;
        })
        tog(formsRegAuth);

        // socket.emit('reg', { username, password })
    });
}

if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const {
            username: { value: username },
            password: { value: password },
            method
        } = e.target;

        fetch('http://localhost:3000/auth', {
            method,
            headers: {'Content-type': 'Application/json'},
            body: JSON.stringify({ username, password })
        }).then((us) => {
            return us.json();
        }).then((us) => {
            currentUser = us.username;
            console.log(currentUser)
            usernameNav.innerHTML = currentUser;
        })
        tog(formsRegAuth);
        // socket.emit('auth', { username, password })
    });
}

// logoutBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     socket.emit('logout')
// })

navWrap.addEventListener('click', (e) => {
    if (e.target.classList.contains('brush')) {
        tog(brushSet);
    }
    if (e.target.classList.contains('reg-auth-btn')) {
        tog(formsRegAuth);
    }
});

btnCancel.addEventListener('click', () => {
    tog(brushSet);
});

btnOk.addEventListener('click', () => {
    tog(brushSet);
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
    M.AutoInit();
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

        socket.emit('draw', { x, y, color: colorBrush, size: sizeofbrush, user: currentUser });
        painting(x, y);
    }
})

socket.on('draw', (coords) => {
    const { x, y, color, size, user } = coords;
    colorBrush = color;
    sizeofbrush = size;
    paintingUser.style.color = color;
    paintingUser.innerHTML = `${user} is painting...`

    socket.on('mouseup', () => {
        paintingUser.innerHTML = '';
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

socket.on('err', (err) => {
    if (err === 'regErr') {
        alert('Пользователь с таким именем уже существует')
    }
});

socket.on('ok', (name) => {
    currentUser = name;
    tog(formsRegAuth);
})

socket.on('setUserName' , (user) => {
    currentUser = user.username
});
