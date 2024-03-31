import React, { useState, useEffect } from 'react';

const RectangleDrawing = ({ canvasRef, drawingMode, setDrawingMode }) => {
  const [drawing, setDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [drawBuffer, setDrawBuffer] = useState([]);

  const startDrawing = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setPrevPos({ x: offsetX, y: offsetY });
    setDrawBuffer([{ x: offsetX, y: offsetY }]);
  };

  const endDrawing = () => {
    setDrawing(false);
    setDrawingMode(null);
    // Perform other logic here if needed
  };

  const handleDraw = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');

    drawRectangle(ctx, offsetX, offsetY);

    setPrevPos({ x: offsetX, y: offsetY });
    setDrawBuffer((prevBuffer) => [...prevBuffer, { x: offsetX, y: offsetY }]);
  };

  const drawRectangle = (ctx, x, y) => {
    const startX = Math.min(prevPos.x, x);
    const startY = Math.min(prevPos.y, y);
    const width = Math.abs(x - prevPos.x);
    const height = Math.abs(y - prevPos.y);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeRect(startX, startY, width, height);
  };

  return (
    <canvas
      ref={canvasRef}
      width={675}
      height={488}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={handleDraw}
      className='whiteboard-canvas'
      style={{ border: '1px solid black' }}
    />
  );
};
export default RectangleDrawing;
