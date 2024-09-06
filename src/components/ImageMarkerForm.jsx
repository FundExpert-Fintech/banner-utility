import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { submitFormData } from "@/pages/api/services";
import { fabric } from 'fabric';

function ImageMarkerComponent() {
  const [canvas, setCanvas] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const canvasRef = useRef(null);
  const previewDotRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [imgObj, setImgObj] = useState(null);
  const originalMarkers = [
    { type: 'logoMarker', index: 0 },
    { type: 'textMarker', index: 1 },
    { type: 'headerMarker', index: 2 },
  ];

  const [availableMarkers, setAvailableMarkers] = useState(originalMarkers);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        setImgObj(img);
        const newCanvas = new fabric.Canvas(canvasRef.current);

        const canvasContainer = document.getElementById('canvas_cont');
        const containerWidth = canvasContainer.clientWidth;
        const containerHeight = canvasContainer.clientHeight;

        const imgAspectRatio = img.width / img.height;
        const containerAspectRatio = containerWidth / containerHeight;

        let imgWidth, imgHeight;
        if (imgAspectRatio > containerAspectRatio) {
          imgWidth = containerWidth;
          imgHeight = containerWidth / imgAspectRatio;
        } else {
          imgWidth = containerHeight * imgAspectRatio;
          imgHeight = containerHeight;
        }

        newCanvas.setWidth(containerWidth);
        newCanvas.setHeight(containerHeight);

        const imgInstance = new fabric.Image(img, {
          left: 0,
          top: 0,
          scaleX: imgWidth / img.width,
          scaleY: imgHeight / img.height,
          selectable: false,
        });

        newCanvas.setBackgroundImage(imgInstance, newCanvas.renderAll.bind(newCanvas));
        setCanvas(newCanvas);
        setImageUploaded(true);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleMarkerDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const { offsetX, offsetY } = e.nativeEvent;
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
      left: offsetX,
      top: offsetY,
      type, // Store the marker type
    });
    canvas.add(marker);
    canvas.renderAll();
    removePreviewDot(); // Remove the preview dot when the marker is dropped
  };

  const handleMarkerDragOver = (e) => {
    e.preventDefault();
    const { offsetX, offsetY } = e.nativeEvent;
    updatePreviewDot(offsetX, offsetY);
  };

  const updatePreviewDot = (left, top) => {
    if (!canvas) return;

    if (!previewDotRef.current) {
      previewDotRef.current = new fabric.Circle({
        radius: 5,
        fill: 'red',
        left,
        top,
        selectable: false,
        evented: false,
      });
      canvas.add(previewDotRef.current);
    } else {
      previewDotRef.current.set({ left, top });
    }
    canvas.renderAll();
  };

  const removePreviewDot = () => {
    if (previewDotRef.current) {
      canvas.remove(previewDotRef.current);
      previewDotRef.current = null;
      canvas.renderAll();
    }
  };

  const handleRemoveSelected = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.text && activeObject.type) {
      canvas.remove(activeObject);
      const markerType = activeObject.type;

      setAvailableMarkers(prevMarkers => {
        const newMarkers = [...prevMarkers];
        const originalMarker = originalMarkers.find(marker => marker.type === markerType);
        if (originalMarker) {
          newMarkers.splice(originalMarker.index, 0, originalMarker);
        }
        return newMarkers;
      });
    }
  };

  const handleRemoveAll = () => {
    canvas.clear();
    setAvailableMarkers(originalMarkers);
  };

  const handleSubmit = async () => {
    if (!canvas || !imgObj) return;

    const markers = canvas.getObjects();

    // Calculate scale factors
    const bgImage = canvas.backgroundImage;
    const scaleX = bgImage.scaleX;
    const scaleY = bgImage.scaleY;

    // Transform markers into formData expected by the API
    const formData = {
      image: selectedImage,
      xLogo: "",
      yLogo: "",
      logoWidth: "",
      xHead: "",
      yHead: "",
      headWidth: "",
      headColor: "",
      xGreet: "",
      yGreet: "",
      greetWidth: "",
      greetColor: ""
    };

    // If markers exist, populate formData fields accordingly
    markers.forEach(marker => {
      const scaledLeft = marker.left / scaleX;
      const scaledTop = marker.top / scaleY;
      const scaledWidth = marker.width / scaleX;

      if (marker.type === 'logoMarker') {
        formData.xLogo = scaledLeft;
        formData.yLogo = scaledTop;
        formData.logoWidth = scaledWidth;
      } else if (marker.type === 'textMarker') {
        formData.xGreet = scaledLeft;
        formData.yGreet = scaledTop;
        formData.greetWidth = scaledWidth;
        formData.greetColor = marker.fill;
      } else if (marker.type === 'headerMarker') {
        formData.xHead = scaledLeft;
        formData.yHead = scaledTop;
        formData.headWidth = scaledWidth;
        formData.headColor = marker.fill;
      }
    });

    // Call the submitFormData function
    try {
      const response = await submitFormData(formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeColorSelected = (newColor) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.text && activeObject.type) {
      activeObject.set('fill', newColor);
      canvas.renderAll();
    }
  };


  if(canvas){
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('change', (event) => {
      const newColor = event.target.value;
      handleChangeColorSelected(newColor);
    });
  }




  return (
    <div className="flex justify-center py-8">
      <div className="flex w-full max-w-6xl">
        <div className="w-1/3 p-4 space-y-4 bg-white border-r">
          <div className="flex flex-col items-start space-y-2">
            <div className="w-full">
              <Button className="mb-4 w-full">
                <input type="file" id="imgInput" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <label htmlFor="imgInput">Upload Image</label>
              </Button>
              <ScrollArea className="w-full border rounded-md h-72">
                <div className="flex flex-col items-start p-4 space-y-4">
                  {availableMarkers.map(marker => (
                    <Button
                      key={marker.type}
                      className="w-full"
                      id={marker.type}
                      draggable="true"
                      onDragStart={(e) => e.dataTransfer.setData('type', marker.type)} // Set marker type as data
                    >
                      {marker.type === 'logoMarker' ? 'Logo Marker' : marker.type === 'textMarker' ? 'Text Marker' : 'Header Marker'}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="text-sm">
              <p>To mark areas on the image:</p>
              <ol className="list-decimal pl-4">
                <li>Click "Upload Image" to select an image.</li>
                <li>Once the image is uploaded, drag and drop markers from the left onto the image.</li>
                <li>To remove a marker, click on it and then click "Remove Selected".</li>
                <li>To remove all markers, click "Remove All Markers".</li>
                <li>Click "Submit" to save the marked areas.</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="w-2/3 p-4">
          <div
            id="canvas_cont"
            className="border border-gray-300 rounded-lg overflow-hidden relative"
            style={{ width: '100%', height: '600px' }}
            onDragOver={handleMarkerDragOver}
            onDrop={handleMarkerDrop}
          >
            <canvas ref={canvasRef} id="canvas" className="block"></canvas>
          </div>
          <div className="flex justify-end mt-4 space-x-2 place-items-center">
            <input type="color" id="colorPicker"/>
            <Button variant="outline" onClick={handleRemoveSelected}>Remove Selected</Button>
            <Button variant="outline" onClick={handleRemoveAll}>Remove All Markers</Button>
            <Button variant="outline" onChange={handleImageUpload}>Change Image</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageMarkerComponent;
