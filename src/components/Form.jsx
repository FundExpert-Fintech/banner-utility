// components/Form.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { submitFormData } from '@/pages/api/services';

const Form = ({setIsFormDataValid, setGetTemplates}) => {
  const [formData, setFormData] = useState({
    logoUrl: '',
    head: '',
    greet: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Check if any of the form fields are empty before navigating
  //   if (formData.logoUrl && formData.head && formData.greet) {
  //     // Redirect to the dynamic route with form data
  //     router.push({
  //       pathname: '/templates/[...formData]',
  //       query: formData, // Pass the form data as query parameters
  //     });
  //   } else {
  //     // Handle the case where some form fields are empty
  //     console.error('All form fields must be filled');
  //   }
  // };

  const response = {
    message: 'Success',
    error: [],
    templates: [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '1.png',
    '3.png',
    ], // will have url to the image
    count: 15 // Number of url
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formData ------', formData);
    if (formData.logoUrl && formData.head && formData.greet) {
      // const response = await submitFormData(formData);
      // console.log('Data submitted successfully:', response);
      // setIsFormDataValid(Object.values(formData).every(Boolean));
      setIsFormDataValid(response.message === 'Success');
      response.message === 'Success' ?  setGetTemplates(response.templates) : alert('Invalid Input');
    } else {
      console.error('All form fields must be filled');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto my-8">
      <label className="block mb-4">
        Logo URL:
        <input
          type="text"
          name="logoUrl"
          value={formData.logoUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </label>
      <label className="block mb-4">
        Header Message:
        <input
          type="text"
          name="head"
          value={formData.head}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </label>
      <label className="block mb-4">
        Greeting Message:
        <input
          type="text"
          name="greet"
          value={formData.greet}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </label>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
        Submit
      </button>
    </form>
  );
};

export default Form;
