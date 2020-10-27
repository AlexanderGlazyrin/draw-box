import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import './CanvasComponent.css'
import {useDispatch, useSelector} from 'react-redux';
import {clearFalse} from '../../redux/action-creators';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [isMouseDown, changeMouseDown] = useState(false);
  const {colorBrush, sizeBrush, isClear, profile} = useSelector(state => state);
  const [canvas, setCanvas] = useState({canvas: null, ctx: null, coords: {x: 0, y: 0}});
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    setSocket(io('http://localhost:4000'));
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const {x, y} = canvas.getBoundingClientRect();
    setCanvas({canvas, ctx, coords: {x, y}});
  }, []);

  useEffect(() => {
    if (socket && profile) {
      socket.on('draw', ({x, y, colorBrush, sizeBrush, drawingUser}) => {
        const ctx = canvas.canvas.getContext('2d');
        console.log(drawingUser);
        painting({x, y, size: sizeBrush, color: colorBrush, ctx})
      })
      socket.on('mouseup', () => {
        canvas.ctx.beginPath();
      })
      socket.on('clear', () => {
        clear();
      })
      socket.on('newClientConnect', (allCoords) => {
        allCoords.forEach(coords => {
          if (coords) {
            const {x, y, colorBrush, sizeBrush} = coords;
            painting({x, y, size: sizeBrush, color: colorBrush})
          } else {
            canvas.ctx.beginPath();
          }
        })
      })
    }
  }, [socket, canvas.ctx]);

  useEffect(() => {
    if (isClear) {
      clear();
      dispatch(clearFalse())
      if (profile) {
        socket.emit('clear')
      }
    }
  }, [isClear, dispatch, socket])

  function painting({x, y, size, color, ctx = canvas.ctx}) {
    ctx.lineWidth = size * 2;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function clear() {
    canvas.ctx.fillStyle = 'white';
    canvas.ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    canvas.ctx.beginPath();
    canvas.ctx.fillStyle = colorBrush;
  }

  const mouseDown = () => {
    changeMouseDown(true);
  }

  const mouseUp = () => {
    changeMouseDown(false);
    canvas.ctx.beginPath();
    if (profile) {
      socket.emit('mouseup');
    }
  }

  const draw = (e) => {
    if (isMouseDown) {
      const x = e.pageX - canvas.coords.x;
      const y = e.pageY - 84;
      painting({x, y, size: sizeBrush, color: colorBrush});
      if (profile) {
        socket.emit('draw', {x, y, colorBrush, sizeBrush, drawingUser: profile.username})
      }
    }
  }

  return (
    <>
      <canvas
        id='canvas'
        ref={canvasRef}
        width={1300} height={700}
        onMouseMove={draw}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
      />
    </>
  );
};

export default CanvasComponent;
