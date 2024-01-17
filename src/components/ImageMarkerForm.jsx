import React, { useState } from 'react';
import ImageMarker from 'react-image-marker';
import CustomMarker from '../components/CustomMarker';
import { submitFormData } from '@/pages/api/services';

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
    setCompletedSteps([]);
    setIsFormSubmitted(false);
  };

  const submitForm = async () => {
    console.log('markers - - ', JSON.stringify(markers));
    // Your manual form submission logic here
    console.log('Manual form submission:', {
      image: selectedFile,
      markers,
    });

      const formData = {
          file : selectedFile,
          url: 'string',
          xLogo: markers[0].left,
          yLogo: markers[0].top,
          logoWidth: 40,
          xHead: markers[1].left,
          yHead: markers[1].top,
          headWidth: 50,
          headColor: 'blue',
          xGreet: markers[2].left,
          yGreet: markers[2].top,
          greetWidth: 150,
          greetColor: 'red',
      };



    const submitForm = await submitFormData(formData);

  };

  return (
    <div className='container mx-auto my-8'>
      <div className="flex mt-4 space-x-4 flex-wrap justify-center lg:justify-between gap-4 py-4 md:py-6">
        <div className="flex flex-col items-center bg-gray-200 p-4 rounded-lg max-w-[400px]">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-left">Instructions</h2>
          <ul className="p-3 text-lg list-disc text-gray-600 font-medium">
            <li className='mb-2'>Upload the file</li>
            <li className='mb-2'>Place the marker for logo</li>
            <li className='mb-2'>Place the marker for Heading text</li>
            <li className='mb-2'>Place the marker for Greeting text</li>
          </ul>
        </div>


        {/* Center side: Image with markers */}
        <div className="w-full md:w-[768px]">
          {currentStep === 'upload' && (
            <div className='h-full'>
              
            <div className="w-[300px] mx-auto flex flex-col items-center justify-center h-full gap-2">
              <img src="/uploadIcon.svg" className='w-[100px]' alt="" />
              <label htmlFor="fileInput" className="mt-4 cursor-pointer border-2 border-[#003974] text-[#003974] px-4 py-2 rounded-md">
                Upload File
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleUploadClick}
                className="hidden" // Hide the default file input button
              />                   
            </div>



              {/* <button
                onClick={() => moveNextStep()}
                className="bg-blue-500 text-white px-4 py-2 mt-4 w-36 rounded-lg"
              >
                Next
              </button> */}
            </div>
          )}
          {currentStep !== 'upload' && (
            <div className="flex flex-col gap-3 md:w-[550px] mx-auto">
              <div className='w-full mb-10'>
                <ImageMarker
                  src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                  markers={markers}
                  onAddMarker={handleMarkerAdd}
                  onRemoveMarker={removeMarker}
                  markerComponent={CustomMarker}
                  disabled={isFormSubmitted}
                />
              </div>
              <div className="w-full md:w-[350px] mx-auto">
                <button onClick={clearImage} className="bg-red-600 text-white px-4 py-2 mr-4 mb-3 rounded-lg w-full">
                  Clear Image
                </button>
                {completedSteps.length === 3 && (
                  <button onClick={submitForm} className="bg-[#003974] text-white px-4 py-2 rounded-lg w-full">
                    Submit Form
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Left side: Completed steps */}
        <div className="flex flex-col items-center bg-[#003974] p-4 rounded-lg md:w-[300px]">
          <h2 className="text-2xl font-semibold mb-4 text-white">Completed Steps</h2>
          <ul className="list-none py-3">
            {completedSteps.map((step, index) => (
              <li key={index} className="flex items-center mb-3 bg-white p-2 rounded-md">
                {/* <span className="mr-2 text-green-500">&#10003;</span> */}
                <img src="/successIcon.svg" alt="" className='w-4 mr-2'/>
                 {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageMarkerForm;
