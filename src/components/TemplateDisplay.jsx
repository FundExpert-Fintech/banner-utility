import React from 'react';

const TemplateDisplay = ({ templates }) => {
  return (
    <>
      <div className="container mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <img
              key={index}
              src={template}
              alt={`Template ${index + 1}`}
              className="w-full h-auto rounded-md shadow-md"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TemplateDisplay;
