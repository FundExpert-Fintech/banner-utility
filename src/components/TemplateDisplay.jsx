import React from 'react';
import { WhatsappShareButton, WhatsappIcon, FacebookMessengerIcon, FacebookMessengerShareButton, TwitterShareButton, XIcon } from 'react-share';

const TemplateDisplay = ({ templates, openModal }) => {
  console.log('selectedImage 0 0 0 ', templates)
  return (
    <>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Generated Templates</h2>
        <div className='flex flex-row flex-wrap gap-4 sm:gap-6 justify-center sm:justify-between'>
          {templates.map((template, index) => (
             <div key={index+1} className="w-[250px] border-2 p-2 flex flex-col gap-3 rounded-lg">
                <div className="h-full">
                  <img src={template.embeddedImage} alt={index} className="object-cover"/>
                </div>
                <div className="flex justify-between items-center gap-2 h-[43px]">
                  <button className="bg-gray-800 text-white py-2 px-3 rounded-lg w-1/2" onClick={()=>openModal(template.embeddedImage)}>
                    Preview
                  </button>

                </div>
              </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TemplateDisplay;
