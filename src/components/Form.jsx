// components/Form.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {embedTextOnImage, getImages} from '@/pages/api/services';

const Form = ({setIsFormDataValid, setGetTemplates, setEmbeddedImageUrl, embeddedImageUrl}) => {
  const [formData, setFormData] = useState({
    logo: '',
    header: '',
    greetingText: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //
  //   if (formData.header && formData.greetingText) {
  //     try {
  //       const embeddedImage = await embedTextOnImage(
  //         'bfl.png',
  //         formData,
  //         [
  //           {
  //             "top": 3.59375,
  //             "left": 7.494303385416667,
  //             "type": "logo"
  //           },
  //           {
  //             "top": 19.84375,
  //             "left": 6.869303385416667,
  //             "type": "header"
  //           },
  //           {
  //             "top": 82.1875,
  //             "left": 92.91097005208333,
  //             "type": "greetingText"
  //           }
  //         ]
  //       );
  //
  //       // Display the embedded image
  //       setEmbeddedImageUrl(embeddedImage)
  //
  //       // Now you can use the embeddedImage as needed
  //     } catch (error) {
  //       console.error('Error embedding text on image:', error);
  //     }
  //   } else {
  //     console.error('All form fields must be filled');
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //
  //   if (formData.header && formData.greetingText) {
  //     try {
  //       const response = await getImages();
  //       console.log('response - - -', response);
  //       if (response.message === 'Success') {
  //         setIsFormDataValid(response.message === 'Success');
  //         const templates = response.data;
  //         setGetTemplates(templates);
  //       } else {
  //         console.error('Error fetching templates:', response.message);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching templates:', error);
  //     }
  //   } else {
  //     console.error('All form fields must be filled');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.header && formData.greetingText) {
      try {
        // Fetch images
        const response = await getImages();
        console.log('response - - -', response);

        if (response.message === 'Success') {
          const templates = response.data;

          // Embed formData into each template
          const embeddedTemplates = templates.map(async (template) => {
            const embeddedImage = await embedTextOnImage(template.url, formData, template.markers);
            return { ...template, embeddedImage };
          });

          // Wait for all embeddings to complete
          const templatesWithEmbeddedImages = await Promise.all(embeddedTemplates);

          // Set the templates with embedded images
          setGetTemplates(templatesWithEmbeddedImages);

          setIsFormDataValid(true); // Assuming validation passed since we are setting templates

        } else {
          console.error('Error fetching templates:', response.message);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    } else {
      console.error('All form fields must be filled');
    }
  };




  return (
    <div className="container mx-auto my-8">
    <form onSubmit={handleSubmit} >
      <label className="block mb-4">
        Logo URL:
        <input
          type="text"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </label>
      <label className="block mb-4">
        Header Message:
        <input
          type="text"
          name="header"
          value={formData.header}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </label>
      <label className="block mb-4">
        Greeting Message:
        <input
          type="text"
          name="greetingText"
          value={formData.greetingText}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </label>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
        Submit
      </button>
    </form>
    </div>

  );
};

export default Form;
