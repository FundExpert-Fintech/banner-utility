import React, { useState, useRef } from 'react';
import { fabric } from 'fabric';

function ImageMarkerComponent() {
  const [canvas, setCanvas] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const canvasRef = useRef(null);

  const originalMarkers = [
    { type: 'logoMarker', index: 0 },
    { type: 'textMarker', index: 1 },
    { type: 'headerMarker', index: 2 },
  ];

  const [availableMarkers, setAvailableMarkers] = useState(originalMarkers);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const imgObj = new Image();
      imgObj.src = event.target.result;

      imgObj.onload = function () {
        const newCanvas = new fabric.Canvas(canvasRef.current);
        newCanvas.setWidth(imgObj.width);
        newCanvas.setHeight(imgObj.height);
        const imgInstance = new fabric.Image(imgObj, {
          left: 0,
          top: 0,
          selectable: false,
        });
        newCanvas.setBackgroundImage(imgInstance, newCanvas.renderAll.bind(newCanvas));
        setCanvas(newCanvas);
        setImageUploaded(true);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleMarkerDrop = (e, type) => {
    e.preventDefault();
    const { layerX, layerY } = e.nativeEvent;
    if (!canvas) return;

    const updatedMarkers = availableMarkers.filter(marker => marker.type !== type);
    setAvailableMarkers(updatedMarkers);

    let text = '';
    switch (type) {
      case 'logoMarker':
        text = 'Logo Marker';
        break;
      case 'textMarker':
        text = 'Text Marker';
        break;
      case 'headerMarker':
        text = 'Header Marker';
        break;
      default:
        break;
    }

    const marker = new fabric.Text(text, {
      fontSize: 20,
      left: layerX,
      top: layerY,
      type, // Store the marker type
    });
    canvas.add(marker);
  };

  const handleMarkerDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveSelected = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.text && activeObject.type) {
      console.log("Removing:", activeObject.text);
      console.log("Available Markers:", availableMarkers);
      canvas.remove(activeObject);
      const markerType = activeObject.type;
      console.log("Marker Type:", markerType);

      setAvailableMarkers(prevMarkers => {
        const newMarkers = [...prevMarkers];
        const originalMarker = originalMarkers.find(marker => marker.type === markerType);
        if (originalMarker) {
          newMarkers.splice(originalMarker.index, 0, originalMarker);
        }
        console.log("New markers:", newMarkers);
        return newMarkers;
      });
    }
  };

  const handleRemoveAll = () => {
    canvas.clear();
    setAvailableMarkers(originalMarkers);
  };

  const handleSubmit = () => {
    if (!canvas) return;
    const markers = canvas.getObjects();
    const formData = {
      markers: markers.map(marker => ({
        type: marker.text,
        left: marker.left,
        top: marker.top,
        width: marker.width,
        fill: marker.fill,
      }))
    };

    console.log(formData);
  };

  return (
    <div className="container mx-auto max-w-8xl px-4 py-8">

      <div className="grid grid-cols-3 gap-4">
        <div className="...">
          <div className="flex flex-col space-y-4">
            {availableMarkers.map(marker => (
              <div
                key={marker.type}
                className="marker bg-gray-200 p-2 cursor-pointer"
                id={marker.type}
                draggable="true"
                onDragStart={(e) => e.dataTransfer.setData('type', marker.type)} // Set marker type as data
              >
                {marker.type === 'logoMarker' ? 'Logo Marker' : marker.type === 'textMarker' ? 'Text Marker' : 'Header Marker'}
              </div>
            ))}
          </div>
          <br/>
          <br/>
          <br/>
          <div className="mb-4">
            <p className="text-lg mb-2">To mark areas on the image:</p>
            <p className="text-gray-600">1. Click "Upload Image" to select an image.</p>
            <p className="text-gray-600">2. Once the image is uploaded, drag and drop markers from the left onto the image.</p>
            <p className="text-gray-600">3. To remove a marker, click on it and then click "Remove Selected".</p>
            <p className="text-gray-600">4. To remove all markers, click "Remove All Markers".</p>
            <p className="text-gray-600">5. Click "Submit" to save the marked areas.</p>
          </div>

          <div className="mt-4">
            <input type="file" id="imgInput" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <label htmlFor="imgInput" className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">Upload Image</label>
          </div>
        </div>
        <div className="col-span-2 ...">
          <div
            id="canvas_cont"
            className="border border-gray-300 rounded-lg overflow-hidden relative contents"
            onDragOver={(e) => handleMarkerDragOver(e)}
            onDrop={(e) => handleMarkerDrop(e, e.dataTransfer.getData('type'))}
          >
            <canvas ref={canvasRef} id="canvas" className="block"></canvas> {/* Remove fixed dimensions */}
          </div>
          <div className="mt-4 float-right">
            <button className="bg-red-500 text-white py-2 px-4 rounded mr-4" onClick={handleRemoveSelected}>Remove Selected</button>
            <button className="bg-red-500 text-white py-2 px-4 rounded mr-4" onClick={handleRemoveAll}>Remove All Markers</button>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ImageMarkerComponent;
