// pages/index.js
import React from 'react';
import Form from '../components/Form';
import Modal from "../components/Modal";
import {useState} from "react";
import TemplatesPage from './templates/[...formData]';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isFormDataValid, setIsFormDataValid] = useState(false);
  const [getTemplates, setGetTemplates] = useState([]);
  const [embeddedImageUrl, setEmbeddedImageUrl] = useState(null);
  const openModal = (item) => {
    console.log('item - -  - - called', item);
    setIsModalOpen(true);
    setSelectedImage(item);
  };
  console.log('setGetTemplates - - ', getTemplates);


  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container flex flex-col lg:flex-row gap-8 p-6">
      <Form setIsFormDataValid={setIsFormDataValid} setGetTemplates={setGetTemplates} isFormDataValid={isFormDataValid}  embeddedImageUrl={embeddedImageUrl} setEmbeddedImageUrl={setEmbeddedImageUrl}/>
      {/*
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
*/}
      <div className="flex-1">
        <TemplatesPage setIsFormDataValid={setIsFormDataValid} getTemplates={getTemplates} isFormDataValid={isFormDataValid} setSelectedImage={setSelectedImage}  openModal={openModal}/>
      </div>
    </div>

    /*<div className="container mx-auto my-8">
      <div className="flex flex-col md:flex-row p-4 md:p-6">
        <Modal isOpen={isModalOpen}  onClose={closeModal} selectedImage={selectedImage} >
          <img src={selectedImage} alt="img"/>
          <br/>
        </Modal>
        <div className="w-full md:w-[40%] p-3 md:p-5">
          <h1 className="text-2xl font-bold mb-8">Fill this form</h1>
          <Form setIsFormDataValid={setIsFormDataValid} setGetTemplates={setGetTemplates} isFormDataValid={isFormDataValid}  embeddedImageUrl={embeddedImageUrl} setEmbeddedImageUrl={setEmbeddedImageUrl}/>
        </div>
        <div className=" w-full md:w-full p-3 md:p-5">
          <TemplatesPage setIsFormDataValid={setIsFormDataValid} getTemplates={getTemplates} isFormDataValid={isFormDataValid} setSelectedImage={setSelectedImage}  openModal={openModal}/>
        </div>
      </div>
    </div>*/
  );
};

export default Home;
