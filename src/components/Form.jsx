// components/Form.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {embedTextOnImage, getImages} from '@/pages/api/services';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card";
const Form = ({setIsFormDataValid, setGetTemplates, setEmbeddedImageUrl, embeddedImageUrl, responseData}) => {
  const [formData, setFormData] = useState({
    logo: '',
    header: '',
    text: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          logo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.header && formData.text) {
      try {
        // Fetch images
        const response = await getImages();
        console.log('response - - -', response);

        if (response.message === 'Success') {
          const templates = response.data;

          // Embed formData into each template
          const embeddedTemplates = templates.map(async (template) => {
            console.log('template- - - - ', template);
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
            <Label htmlFor="logo-upload">Logo:</Label>
            <Input
              id="logo-upload"
              type="file"
              onChange={handleLogoUpload}
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
              name="text"
              value={formData.text}
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
      <br/>
      {responseData &&
        <Card>
        <CardContent className="grid grid-cols-1 gap-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <div className="space-y-1">
            <div className="text-lg font-semibold">Hi, {responseData.name}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500 dark:text-gray-400">Email:</div>
            <div>{responseData.contactInfo.email ? responseData.contactInfo.email : 'NA'}</div>
          </div>
          <div className="space-y-1 ">
            <div className="text-gray-500 dark:text-gray-400">Mobile:</div>
            <div>{responseData.contactInfo.mobile ? responseData.contactInfo.mobile  : 'NA'}</div>
          </div>
        </CardContent>
      </Card>}
    </div>
  );
};

export default Form;
