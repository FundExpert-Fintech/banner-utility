import React, { useState } from 'react';
import ImageMarker from 'react-image-marker';
import CustomMarker from '../components/CustomMarker';

const ImageMarkerForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState('upload');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleUploadClick = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMarkers([]); // Clear existing markers when a new image is selected
      setCurrentStep('logo'); // Move to the next step after uploading
    }
  };

  const handleMarkerAdd = (marker) => {
    if (isFormSubmitted) {
      // If form is submitted, ignore further marker additions
      return;
    }

    // Remove existing marker for the current step
    const filteredMarkers = markers.filter((m) => m.type !== currentStep);

    marker.type = currentStep;
    setMarkers([...filteredMarkers, marker]);

    // Update completed steps for logo, header, and greetingText
    if (currentStep === 'logo') {
      setCompletedSteps((prevSteps) => [...prevSteps, currentStep]);
    } else if (currentStep === 'header' && markers.find((m) => m.type === 'logo')) {
      setCompletedSteps((prevSteps) => [...prevSteps, currentStep]);
    } else if (
      currentStep === 'greetingText' &&
      markers.find((m) => m.type === 'logo') &&
      markers.find((m) => m.type === 'header')
    ) {
      setCompletedSteps((prevSteps) => [...prevSteps, currentStep]);
    }

    moveNextStep();
  };

  const moveNextStep = () => {
    switch (currentStep) {
      case 'logo':
        setCurrentStep('header');
        break;
      case 'header':
        setCurrentStep('greetingText');
        break;
      default:
        // Submission step
        console.log('Form submitted:', {
          image: selectedFile,
          markers,
        });
        setCompletedSteps(['logo', 'header', 'greetingText']); // Update completed steps
        setIsFormSubmitted(true);
    }
  };

  const removeMarker = () => {
    if (isFormSubmitted) {
      // If form is submitted, prevent marker removal
      return;
    }

    const filteredMarkers = markers.filter((m) => m.type !== currentStep);
    setMarkers(filteredMarkers);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setMarkers([]);
    setCurrentStep('upload');
    setIsFormSubmitted(false);
  };

  const submitForm = () => {
    console.log('markers - - ', JSON.stringify(markers));
    // Your manual form submission logic here
    console.log('Manual form submission:', {
      image: selectedFile,
      markers,
    });
  };

  return (
    <div className="flex mt-4 space-x-4">
      {/* Left side: Completed steps */}
      <div className="flex flex-col items-center bg-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-4">Completed Steps</h2>
        <ul className="list-none p-0">
          {completedSteps.map((step, index) => (
            <li key={index} className="flex items-center mb-2">
              <span className="mr-2 text-green-500">&#10003;</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Image with markers */}
      <div className="flex-1">
        {currentStep === 'upload' && (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadClick}
              className="mt-4"
            />
            <button
              onClick={() => moveNextStep()}
              className="bg-blue-500 text-white px-4 py-2 mt-4"
            >
              Next
            </button>
          </div>
        )}
        {currentStep !== 'upload' && (
          <div className="flex justify-center">
            <ImageMarker
              src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
              markers={markers}
              onAddMarker={handleMarkerAdd}
              onRemoveMarker={removeMarker}
              markerComponent={CustomMarker}
              disabled={isFormSubmitted}
            />
            <div className="mt-4">
              <button onClick={clearImage} className="bg-red-500 text-white px-4 py-2 mr-4">
                Clear Image
              </button>
              {completedSteps.length === 3 && (
                <button onClick={submitForm} className="bg-green-500 text-white px-4 py-2">
                  Submit Form
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageMarkerForm;
