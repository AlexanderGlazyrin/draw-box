import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import './CanvasComponent.css'
import {useDispatch, useSelector} from 'react-redux';
import {clearFalse} from '../../redux/action-creators';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [isMouseDown, changeMouseDown] = useState(false);
  const {colorBrush, sizeBrush, isClear} = useSelector(state => state);
  const [canvas, setCanvas] = useState({canvas: null, ctx: null, coords: {x: 0, y: 0}});
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    setSocket(io('http://localhost:4000'));
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')
    const {x, y} = canvas.getBoundingClientRect();
    setCanvas({canvas, ctx, coords: {x, y}});
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('draw', ({x, y, colorBrush, sizeBrush}) => {
        painting({x, y, size: sizeBrush, color: colorBrush})
      })
      socket.on('mouseup', () => {
        canvas.ctx.beginPath();
      })
      socket.on('clear', () => {
        clear();
      })
    }
  }, [socket, canvas.ctx]);

  useEffect(() => {
    if (isClear) {
      clear();
      dispatch(clearFalse())
      socket.emit('clear')
    }
  }, [isClear, dispatch])

  function painting({x, y, size, color}) {
    canvas.ctx.lineWidth = size * 2;
    canvas.ctx.fillStyle = color;
    canvas.ctx.strokeStyle = color;
    canvas.ctx.lineTo(x, y);
    canvas.ctx.stroke();

    canvas.ctx.beginPath();
    canvas.ctx.arc(x, y, size, 0, Math.PI * 2);
    canvas.ctx.fill();

    canvas.ctx.beginPath();
    canvas.ctx.moveTo(x, y);
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
    socket.emit('mouseup');
  }

  const draw = (e) => {
    if (isMouseDown) {
      const x = e.pageX - canvas.coords.x;
      const y = e.pageY - 84;
      painting({x, y, size: sizeBrush, color: colorBrush});
      socket.emit('draw', {x, y, colorBrush, sizeBrush})
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
