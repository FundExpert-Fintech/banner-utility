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
    <div className="container mx-auto md:my-8 py-4 md:py-6 bg-[#cfd9e3]">

      <div id="buttons" className="flex items-center gap-3 mb-5 px-5 h-20">        
        <button title="Add Title" className="p-2 border-2 border-gray-500 h-full bg-white" onClick={() => addText()}>
          <img src="/text.svg" className="mx-auto h-6" alt="img" />
          <span className="text-xs font-normal text-gray-500">Add Text</span>
        </button>
        <button className="p-2 border-2 h-full bg-white border-gray-500" onClick={() => addImage()}>
          <img src="/imgIcon.svg" className="mx-auto h-6" alt="img" />
          <span className="text-xs font-normal text-gray-500">Add Image</span>
        </button>
        <button className="p-2 border-2 h-full bg-white border-gray-500" onClick={() => removeSelected()}>
          <img src="/removeSelect.svg" className="mx-auto h-6" alt="img" />
          <span className="text-xs font-normal text-gray-500">Remove Selected</span>
        </button>
        <button className="p-2 border-2 h-full bg-white border-gray-500" onClick={() => removeAll()}>
          <img src="/removeAll.svg" className="mx-auto h-6" alt="img" />
          <span className="text-xs font-normal text-gray-500">Remove All</span>
        </button>
        <button className="p-2 border-2 h-full bg-white border-gray-500" onClick={() => downloadImage()}>
          <img src="/download.svg" className="mx-auto h-6" alt="img" />
          <span className="text-xs font-normal text-gray-500">Download</span>
        </button>
      </div>

      <div className="flex gap-4 p-5">
        <div className="flex flex-col items-start col-span-1 max-w-[300px] w-full bg-gray-100 p-5 rounded-lg">
          <div className="w-full mb-6 rounded-md bg-[#d7e1eb] p-3">
            <h4 className="text-lg font-medium mb-2">Text</h4>
            <div className="mb-2">
              <label htmlFor="textResize" className="inline-block w-12">Size: </label>
              <input className="align-middle w-32 bg-black" type="range" id="textResize" min="1" max="100" defaultValue="20" onChange={(e) => handleTextResize(e)} />
            </div>
            <div className="w-full">
              <label htmlFor="textColorPicker" className="inline-block w-12">Color: </label>
              <input
                className="align-middle"
                type="color"
                id="textColorPicker"
                defaultValue="#03a9f4"
                onChange={(e) => handleTextColorChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full rounded-md bg-[#d7e1eb] p-3">
            <h4 className="text-lg font-medium mb-1">Image</h4>
            <label htmlFor="imageResize" className="inline-block w-12">Size: </label>
            <input
              className="align-middle w-32"
              type="range"
              id="imageResize"
              min="0.1"
              max="2"
              step="0.1"
              defaultValue="0.5"
              onChange={(e) => handleImageResize(e)}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg relative z-0">
          <canvas className="shadow-md rounded-lg " ref={canvasRef} width={800} height={600}></canvas>
        </div>
        <div className="bg-white w-[300px] rounded-lg">
          <div className="w-full mx-auto flex flex-col items-center justify-center h-full gap-2">
            <img src="/upload.svg" className='w-[100px]' alt="" />
            <label htmlFor="fileUpload" className="mt-4 cursor-pointer border-2 border-[#003974] bg-white text-[#003974] px-4 py-2 rounded-md">
              Upload File
            </label>
            <input type="file" id="fileUpload" className="hidden" ref={imageInputRef} accept="image/*" onChange={(e) => handleImage(e)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricCanvas;

