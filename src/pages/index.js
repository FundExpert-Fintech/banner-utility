// pages/index.js
import React from 'react';
import Form from '../components/Form';
import Modal from "../components/Modal";
import {useState} from "react";
import TemplatesPage from './templates/[...formData]';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isFormDataValid, setIsFormDataValid] = useState(false);
  const [getTemplates, setGetTemplates] = useState([]);
  const [embeddedImageUrl, setEmbeddedImageUrl] = useState(null);
  const openModal = (item) => {
    console.log('item', item);
    setIsModalOpen(true);
    setSelectedImage(item);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto my-8">
      <div className="flex flex-col md:flex-row p-4 md:p-6">
        <Modal isOpen={isModalOpen}  onClose={closeModal} selectedImage={selectedImage} >
          <img src={`/`+selectedImage} alt="img"/>
        </Modal>
        <div className="w-full md:w-[40%] p-3 md:p-5">
          <h1 className="text-2xl font-bold mb-8">Fill this form</h1>
          <Form setIsFormDataValid={setIsFormDataValid} setGetTemplates={setGetTemplates} isFormDataValid={isFormDataValid}  embeddedImageUrl={embeddedImageUrl} setEmbeddedImageUrl={setEmbeddedImageUrl}/>
        </div>
        <div className=" w-full md:w-full p-3 md:p-5">
          {embeddedImageUrl && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <img src={embeddedImageUrl} alt="Embedded Image" className="max-w-full" />
              {/*{embeddedImageUrl}*/}
            </div>
          )}
          {/*<TemplatesPage setIsFormDataValid={setIsFormDataValid} getTemplates={getTemplates} isFormDataValid={isFormDataValid} setSelectedImage={setSelectedImage}  openModal={openModal}/>*/}
        </div>
      </div>
    </div>
  );
};

export default Home;
