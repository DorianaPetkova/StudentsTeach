import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, onSnapshot, deleteDoc, query, getDocs, writeBatch, doc } from 'firebase/firestore';

const Whiteboard = ({ chatId }) => 
{
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [pencilSize, setPencilSize] = useState(2);
  const [selectedColor, setSelectedColor] = useState('#000000'); 
  const [drawBuffer, setDrawBuffer] = useState([]); 

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, `whiteboards/${chatId}/drawings`), (snapshot) => 
    {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snapshot.forEach((doc) => {
        const drawing = doc.data();
        draw(ctx, drawing);
      });
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => 
  {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e) => 
  {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setPrevPos({ x: offsetX, y: offsetY });
    setDrawBuffer([{ x: offsetX, y: offsetY }]);
  };

  const endDrawing = () => 
  {
    setDrawing(false);
    addBatchToFirestore();
    setDrawBuffer([]);
  };

  const draw = (ctx, drawing) => 
  {
    ctx.strokeStyle = drawing.color;
    ctx.lineWidth = drawing.size;
    ctx.beginPath();
    ctx.moveTo(drawing.startX, drawing.startY);
    ctx.lineTo(drawing.endX, drawing.endY);
    ctx.stroke();
  };

  const handleDraw = (e) => 
  {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = pencilSize;

    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setPrevPos({ x: offsetX, y: offsetY });
    setDrawBuffer((prevBuffer) => [...prevBuffer, { x: offsetX, y: offsetY }]);
  };

  const addBatchToFirestore = async () => 
  {
    try 
    {
      const batch = writeBatch(db);
      const drawingsRef = collection(db, `whiteboards/${chatId}/drawings`);
      
      drawBuffer.forEach(({ x, y }, index) => {
        if (index === 0) return;
        const prev = drawBuffer[index - 1];
        const newDrawing = {
          color: selectedColor,
          size: pencilSize,
          startX: prev.x,
          startY: prev.y,
          endX: x,
          endY: y,
        };
        
        batch.set(doc(drawingsRef), newDrawing);
      });
      
      await batch.commit();
    } catch (error) 
    {
      console.error(error);
    }
  };

  const clearCanvas = async () => 
  {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //delete drawings from firebase
    const drawingsQuery = query(collection(db, `whiteboards/${chatId}/drawings`));
    const drawingsSnapshot = await getDocs(drawingsQuery);
    const batch = writeBatch(db);
    drawingsSnapshot.forEach((doc) => 
    {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  const changePencilSize = (size) => 
  {
    setPencilSize(size);
  };

  const changeColor = (color) => 
  {
    setSelectedColor(color);
  };

  return (
    <div>
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
      <div>
        <button onClick={clearCanvas}>Clear Canvas</button>
        <button onClick={() => changePencilSize(2)}>Small</button>
        <button onClick={() => changePencilSize(5)}>Medium</button>
        <button onClick={() => changePencilSize(10)}>Large</button>
        <input type="color" onChange={(e) => changeColor(e.target.value)} value={selectedColor} />
      </div>
    </div>
  );
};

export default Whiteboard;
