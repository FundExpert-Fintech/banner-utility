// components/FabricCanvas.js
import React from "react";
import { useEffect, useRef } from 'react';
import {fabric} from 'fabric';

const FabricCanvas = () => {
  const canvasRef = useRef(null);
  const imageInputRef = useRef(null);
  const canvasInstance = useRef(null);

  const handleImage = (e) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const imgObj = new Image();
      imgObj.src = event.target.result;

      imgObj.onload = function () {
        const firstImage = new fabric.Image(imgObj, {
          left: 0,
          top: 0,
          scaleX: canvasInstance.current.width / imgObj.width,
          scaleY: canvasInstance.current.height / imgObj.height,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          selectable: false
        });

        canvasInstance.current.add(firstImage);
        bringButtonsToFront();
      };
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const bringButtonsToFront = () => {
    const buttons = document.getElementById('buttons');
    buttons.style.zIndex = canvasInstance.current.getObjects().length + 1;
  };

  const addText = () => {
    const text = new fabric.Textbox('Hello User!', {
      left: 100,
      top: 100,
      fontFamily: 'Open Sans',
      fontSize: 25,
      fill: 'black',
      hasControls: true,
      hasBorders: true,
      lockMovementX: false,
      lockMovementY: false,
      selectable: true
    });

    text.on('selected', () => {
      canvasInstance.current.setActiveObject(text);
    });

    canvasInstance.current.add(text);
    bringButtonsToFront();
  };

  const handleTextResize = (e) => {
    const activeObject = canvasInstance.current.getActiveObject();
    console.log('activeObject.type - - - ', activeObject.type);
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('fontSize', parseInt(e.target.value, 10));
      canvasInstance.current.renderAll();
    }
  };

  const handleTextColorChange = (color) => {
    const activeObject = canvasInstance.current.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('fill', color);
      canvasInstance.current.renderAll();
    }
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function (e) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const imgObj = new Image();
        imgObj.src = event.target.result;

        imgObj.onload = function () {
          const fabricImage = new fabric.Image(imgObj, {
            left: 200,
            top: 200,
            scaleX: 0.5,
            scaleY: 0.5,
            hasControls: true,
            hasBorders: true,
            lockMovementX: false,
            lockMovementY: false,
            selectable: true
          });

          fabricImage.on('selected', () => {
            canvasInstance.current.setActiveObject(fabricImage);
          });

          canvasInstance.current.add(fabricImage);
          bringButtonsToFront();
        };
      };

      reader.readAsDataURL(e.target.files[0]);
    };

    input.click();
  };

  const handleImageResize = (e) => {
    const activeObject = canvasInstance.current.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      activeObject.set('scaleX', parseFloat(e.target.value));
      activeObject.set('scaleY', parseFloat(e.target.value));
      canvasInstance.current.renderAll();
    }
  };

  const removeSelected = () => {
    const activeObject = canvasInstance.current.getActiveObject();
    if (activeObject) {
      canvasInstance.current.remove(activeObject);
    }
  };

  const removeAll = () => {
    canvasInstance.current.clear();
  };

  const downloadImage = () => {
    const dataUrl = canvasInstance.current.toDataURL({
      format: 'png',
      quality: 1.0
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'fabric_canvas_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    canvasInstance.current = new fabric.Canvas(canvasRef.current);

    return () => {
      canvasInstance.current.dispose();
    };
  }, []);

  return (
    <div>
      <input type="file" ref={imageInputRef} accept="image/*" onChange={(e) => handleImage(e)} />
      <canvas ref={canvasRef} width={800} height={600}></canvas>
      <div id="buttons" style={{ position: 'absolute', zIndex: 0 }}>
        <button onClick={() => addText()}>Add Text</button>
        <button onClick={() => addImage()}>Add Image</button>
        <label htmlFor="textResize">Text Size:</label>
        <input type="range" id="textResize" min="1" max="100" defaultValue="20" onChange={(e) => handleTextResize(e)} />
        <label htmlFor="textColorPicker">Text Color:</label>
        <input
          type="color"
          id="textColorPicker"
          defaultValue="#03a9f4"
          onChange={(e) => handleTextColorChange(e.target.value)}
        />
        <label htmlFor="imageResize">Image Size:</label>
        <input
          type="range"
          id="imageResize"
          min="0.1"
          max="2"
          step="0.1"
          defaultValue="0.5"
          onChange={(e) => handleImageResize(e)}
        />
        <button onClick={() => removeSelected()}>Remove Selected</button>
        <button onClick={() => removeAll()}>Remove All</button>
        <button onClick={() => downloadImage()}>Download Image</button>
      </div>
    </div>
  );
};

export default FabricCanvas;
