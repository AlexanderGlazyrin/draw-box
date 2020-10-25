import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import './CanvasComponent.css'

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [isMouseDown, changeMouseDown] = useState(false);
  const [canvas, setCanvas] = useState({canvas: null, ctx: null, coords: {x: 0, y: 0}});
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    setSocket(io('http://localhost:4000'));
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')
    const {x, y} = canvas.getBoundingClientRect();
    setCanvas({canvas, ctx, coords: {x, y}});
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('draw', ({x, y}) => {
        painting(x, y)
      })
      socket.on('mouseup', () => {
        canvas.ctx.beginPath();
      })
    }
  }, [socket, canvas.coords.x, canvas.coords.y, canvas.ctx]);

  function painting(x, y) {

    canvas.ctx.lineWidth = 10;
    canvas.ctx.fillStyle = 'red';
    canvas.ctx.strokeStyle = 'red';
    canvas.ctx.lineTo(x, y);
    canvas.ctx.stroke();

    canvas.ctx.beginPath();
    canvas.ctx.arc(x, y, 10 / 2, 0, Math.PI * 2);
    canvas.ctx.fill();

    canvas.ctx.beginPath();
    canvas.ctx.moveTo(x, y);

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
      const x = e.clientX - canvas.coords.x;
      const y = e.clientY - canvas.coords.y;
      painting(x, y);
      socket.emit('draw', {x, y})
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
