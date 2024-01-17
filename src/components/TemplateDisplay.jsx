import React from 'react';
import { WhatsappShareButton, WhatsappIcon, FacebookMessengerIcon, FacebookMessengerShareButton, TwitterShareButton, XIcon } from 'react-share';

const TemplateDisplay = ({ templates, openModal }) => {
  return (
    <>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Templates</h2>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <img
              key={index}
              src={template}
              alt={`Template ${index + 1}`}
              className="w-full h-auto rounded-md shadow-md"
            />
          ))} 
        </div> */}
        <div className='flex flex-row flex-wrap gap-4 sm:gap-6 justify-center sm:justify-between'>
          {templates.map((template, index) => (
             <div key={index+1} className="w-[250px] border-2 p-2 flex flex-col gap-3 rounded-lg">
                <div className="h-full">
                  <img src={template} alt={index} className="object-cover"/>
                </div>
                <div className="flex justify-between items-center gap-2 h-[43px]">
                  <button className="bg-gray-800 text-white py-2 px-3 rounded-lg w-1/2" onClick={()=>openModal(template)}>
                    Preview
                  </button>
                  <div className='flex justify-center items-center gap-3 w-1/2'>
                      <FacebookMessengerShareButton url={template} quote="Check out this image on Facebook">
                        <FacebookMessengerIcon size={32} round />
                      </FacebookMessengerShareButton>

                      <WhatsappShareButton url={template} title="Check out this image on WhatsApp">
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TemplateDisplay;
