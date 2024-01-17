import React from 'react';
import TemplateDisplay from '../../components/TemplateDisplay';

const TemplatesPage = ({isFormDataValid, getTemplates, openModal}) => {
  // const router = useRouter();
  // const { formData } = router.query;
  // Check if formData exists and is not empty
  // const isFormDataValid = formData && formData.length === 3 && formData.every(Boolean);


  console.log('isFormDataValid ---', isFormDataValid);

  // Mock templates for demonstration purposes
  // const templates = [
  //   'https://example.com/template1.jpg',
  //   'https://example.com/template2.jpg',
  //   'https://example.com/template3.jpg',
  // ];

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
