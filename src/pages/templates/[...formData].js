// pages/templates/[...formData].js
import React from 'react';
import { useRouter } from 'next/router';
import TemplateDisplay from '../../components/TemplateDisplay';

const TemplatesPage = () => {
  const router = useRouter();
  const { formData } = router.query;
  console.log('formData- - -', formData);
  // Check if formData exists and is not empty
  const isFormDataValid = formData && formData.length === 3 && formData.every(Boolean);

  // Mock templates for demonstration purposes
  const templates = [
    'https://example.com/template1.jpg',
    'https://example.com/template2.jpg',
    'https://example.com/template3.jpg',
  ];

  return (
    <div>
      {isFormDataValid ? (
        <TemplateDisplay templates={templates} />
      ) : (
        <p>Error: Invalid form data. Please fill out all form fields.</p>
      )}
    </div>
  );
};

export default TemplatesPage;
