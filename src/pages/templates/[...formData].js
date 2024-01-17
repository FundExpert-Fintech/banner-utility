import React from 'react';
import TemplateDisplay from '../../components/TemplateDisplay';

const TemplatesPage = ({isFormDataValid, getTemplates, openModal}) => {
  console.log('isFormDataValid ---', isFormDataValid);
  return (
    <div>
      {isFormDataValid ? (
        <TemplateDisplay templates={getTemplates} openModal={openModal} />
      ) : (
        <p>Error: Invalid form data. Please fill out all form fields.</p>
      )}
    </div>
  );
};

export default TemplatesPage;
