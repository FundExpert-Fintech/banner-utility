import React, {useState, useRef, useEffect} from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {getImages, submitFormData} from "@/pages/api/services";
import { fabric } from 'fabric';
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import axios from "axios";
function ImageMarkerComponent() {
  const [canvas, setCanvas] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const canvasRef = useRef(null);
  const previewDotRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [imgObj, setImgObj] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [images, setImages] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showDeleteLoader, setShowDeleteLoader] = useState(false);

  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState('#000000');

  const handleMarkerClick = (marker) => {
    const markerObj = marker.toObject();
    const textObj = markerObj.objects.find(obj => obj.type === 'text');

    if (textObj) {
      setBold(textObj.fontWeight === 'bold');
      setItalic(textObj.fontStyle === 'italic');
      setUnderline(textObj.underline);
    } else {
      setBold(false);
      setItalic(false);
      setUnderline(false);
    }
  };

  const handleChangeFontSize = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type && (activeObject.type === 'textMarker' || activeObject.type === 'headerMarker')) {
      activeObject.item(1).set({ fontSize: newSize }); // Update font size for text inside the marker group
      canvas.renderAll();
    }
  };

  const handleToggleBold = () => {
    setBold(!bold);
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type && (activeObject.type === 'textMarker' || activeObject.type === 'headerMarker')) {
      const newWeight = bold ? 'normal' : 'bold'; // Toggle fontWeight
      activeObject.item(1).set({ fontWeight: newWeight });
      canvas.renderAll();
    }
  };

  const handleToggleItalic = () => {
    setItalic(!italic);

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type && (activeObject.type === 'textMarker' || activeObject.type === 'headerMarker')) {
      const newStyle = italic ? 'normal' : 'italic'; // Toggle fontStyle
      activeObject.item(1).set({ fontStyle: newStyle });
      canvas.renderAll();
    }
  };

  const handleToggleUnderline = () => {
    setUnderline(!underline);

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type && (activeObject.type === 'textMarker' || activeObject.type === 'headerMarker')) {
      const newUnderline = underline ? false : true; // Toggle underline
      activeObject.item(1).set({ underline: newUnderline });
      canvas.renderAll();
    }
  };



  const fetchImages = async () => {
    try {
      const response = await getImages();
      if (response.message === 'Success') {
        setImages(response.data); // Save images in state
      } else {
        console.error('Error fetching images:', response.message);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (_id) => {
    setDeletingId(_id);
    setShowDeleteLoader(true);
    try {
      const deleteResponse = await axios.delete(`http://marketing-module-be.fundexpert.in/template/${_id}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }});
      if (deleteResponse.status === 200) {
        console.log('Template deleted successfully');
        await fetchImages();
      } else {
        console.error('Error deleting template:', deleteResponse.data.message);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setDeletingId(null);
      setShowDeleteLoader(false);
    }
  };

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

    const markerCircle = new fabric.Circle({
      radius: 5,
      fill: 'red',
      left: offsetX,
      top: offsetY,
      selectable: false,
      originX: 'center',
      originY: 'center',
    });

    const markerLabel = new fabric.Text(text, {
      fontSize: 20,
      left: offsetX + 10,
      top: offsetY - 10,
      selectable: false,
    });

    const markerGroup = new fabric.Group([markerCircle, markerLabel], {
      left: offsetX,
      top: offsetY,
      selectable: true,
      type,
    });

    markerGroup.on('selected', () => handleMarkerClick(markerGroup));

    canvas.add(markerGroup);
    canvas.renderAll();
  };
  const handleMarkerDragOver = (e) => {
    e.preventDefault();
    const { offsetX, offsetY } = e.nativeEvent;
    // updatePreviewDot(offsetX, offsetY);
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
    if (activeObject && activeObject.type) {
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
    const bgImage = canvas.backgroundImage;
    const scaleX = bgImage.scaleX;
    const scaleY = bgImage.scaleY;
    const applicationId = localStorage.getItem('appId');
    const formData = {
      image: selectedImage,
      categoryId: 1,
      xLogo: 0,
      yLogo: 0,
      logoWidth: 0,
      logoHeight: 0,
      xHead: 0,
      yHead: 0,
      headWidth: 0,
      isHeadBold: false,
      isHeadItalic: false,
      isHeadUnderline: false,
      headFont: "",
      headSize: 0,
      headColor: "",
      xGreet: 0,
      yGreet: 0,
      greetWidth: 0,
      isGreetBold: false,
      isGreetItalic: false,
      isGreetUnderline: false,
      greetFont: "",
      greetSize: 0,
      greetColor: "",
      applicationId: applicationId
    };

    markers.forEach(marker => {
      const markerObj = marker.toObject(); // Convert to plain object
      const scaledLeft = markerObj.left / scaleX;
      const scaledTop = markerObj.top / scaleY;
      const scaledWidth = markerObj.width / scaleX;

      if (markerObj.type === 'headerMarker') {
        formData.xHead = scaledLeft;
        formData.yHead = scaledTop;
        formData.headWidth = scaledWidth;

        const textObj = markerObj.objects.find(obj => obj.type === 'text');
        if (textObj) {
          formData.headColor = textObj.fill;
          formData.isHeadBold = textObj.fontWeight === 'bold';
          formData.isHeadItalic = textObj.fontStyle === 'italic';
          formData.isHeadUnderline = textObj.underline;
          formData.headFont = textObj.fontFamily;
          formData.headSize = textObj.fontSize;
        } else {
          console.log('Header Marker Data:', JSON.stringify(markerObj));
        }
      }
      else if (markerObj.type === 'textMarker') {
        formData.xGreet = scaledLeft;
        formData.yGreet = scaledTop;
        formData.greetWidth = scaledWidth;

        const textObj = markerObj.objects.find(obj => obj.type === 'text');
        if (textObj) {
          formData.greetColor = textObj.fill;
          formData.isGreetBold = textObj.fontWeight === 'bold';
          formData.isGreetItalic = textObj.fontStyle === 'italic';
          formData.isGreetUnderline = textObj.underline;
          formData.greetFont = textObj.fontFamily;
          formData.greetSize = textObj.fontSize;
        } else {
          console.log('Text Marker Data:', JSON.stringify(markerObj));
        }
      }
      else if (markerObj.type === 'logoMarker') {
        formData.xLogo = scaledLeft;
        formData.yLogo = scaledTop;
        formData.logoWidth = scaledWidth;
      } else {
        console.log('Unknown Marker Type Data:', JSON.stringify(markerObj));
      }
    });

    console.log('form data - - - ', JSON.stringify(formData));

    try {
      setShowLoader(true);
      const response = await submitFormData(formData);
      if (response && response.message === 'Success') {
        setShowLoader(false);
        canvas.clear();
        setAvailableMarkers(originalMarkers);
        fetchImages();
      }
    } catch (error) {
      console.error(error);
      setShowLoader(false);
    }
  };

  const handleChangeColorSelected = (newColor) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.text && activeObject.type) {
      activeObject.set('fill', newColor);
      canvas.renderAll();
    }
  };



  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type && (activeObject.type === 'textMarker' || activeObject.type === 'headerMarker')) {
      activeObject.item(1).set({ fill: newColor });
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
    <>
      <div className="flex h-screen">
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

              <div className="flex flex-wrap justify-end mt-4 space-x-2 gap-2">
                <Button onClick={handleToggleBold}>{bold ? 'Unbold' : 'Bold'}</Button>
                <Button onClick={handleToggleItalic}>{italic ? 'Unitalic' : 'Italic'}</Button>
                <Button onClick={handleToggleUnderline}>{underline ? 'Remove Underline' : 'Underline'}</Button>

                <div className="flex items-center">
                  <label htmlFor="fontSize" className="mr-2">Font Size:</label>
                  <input
                    type="number"
                    id="fontSize"
                    value={fontSize}
                    onChange={handleChangeFontSize}
                    placeholder="16"
                    className="border rounded p-1 w-20"
                  />
                </div>

                <div className="flex items-center">
                  <label htmlFor="colorPicker" className="mr-2">Color:</label>
                  <input
                    type="color"
                    id="colorPicker"
                    value={color}
                    onChange={handleChangeColor}
                    className="border rounded w-12 h-8"
                  />
                </div>

                <Button variant="outline" onClick={handleRemoveSelected}>Remove Selected</Button>
                <Button variant="outline" onClick={handleRemoveAll}>Remove All Markers</Button>
                <Button variant="outline" onClick={handleImageUpload}>Change Image</Button>
                <Button onClick={handleSubmit}>{showLoader ? 'Uploading...' : 'Submit'}</Button>
              </div>
            </div>

          </div>
      </div>
        {/* Right column - image gallery */}
        <div className="w-1/3 bg-white border-l">
          <div className="p-4 ">
            <h2 className="text-xl font-semibold">Image Gallery</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-4 grid grid-cols-2 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <CardContent className="p-2 flex flex-col items-center">
                    <img src={image.url} alt={image.id} className="w-full h-24 object-cover rounded mb-2" />
                    <p className="text-sm font-medium text-center mb-2">Image No: {image.id}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {showDeleteLoader && image.id === deletingId ? 'Deleting...' : 'Delete' }
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>

  );
}

export default ImageMarkerComponent;
