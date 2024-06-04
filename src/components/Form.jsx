// components/Form.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {embedTextOnImage, getImages} from '@/pages/api/services';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

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
          console.log(templatesWithEmbeddedImages)
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
    <div className="flex-1 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Fill this form</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo-upload">Logo URL:</Label>
            <Input
              id="logo-upload"
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="header-message">Name to Display:</Label>
            <Input
              id="header-message"
              type="text"
              name="header"
              value={formData.header}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your organisation name"
            />
          </div>
          <div>
            <Label htmlFor="greeting-message">Contact Number:</Label>
            <Input
              id="greeting-message"
              type="text"
              name="greetingText"
              value={formData.greetingText}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your contact details/email address"
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
            Submit
          </button>
        </div>
      </form>
    </div>

    /*<div className="container flex flex-col lg:flex-row gap-8 p-6">
      <div className="flex-1 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Fill this form</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo-upload">Logo:</Label>
            <Input id="logo-upload" type="file" />
          </div>
          <div>
            <Label htmlFor="header-message">Name to Display:</Label>
            <Input id="header-message" placeholder="Enter your organisation name" />
          </div>
          <div>
            <Label htmlFor="greeting-message">Contact Number:</Label>
            <Textarea id="greeting-message" placeholder="Enter your contact details/email address" />
          </div>
          <Button>Submit</Button>
        </div>
      </div>
    </div>*/
   /* <div className="container mx-auto my-8">
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
    </div>*/

  );
};

export default Form;
