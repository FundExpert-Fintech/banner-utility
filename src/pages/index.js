import React, { useEffect, useState } from 'react';
import Form from '../components/Form';
import TemplatesPage from './templates/[...formData]';
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {FacebookMessengerIcon, FacebookMessengerShareButton, WhatsappIcon, WhatsappShareButton} from "react-share";
const Home = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isFormDataValid, setIsFormDataValid] = useState(false);
  const [getTemplates, setGetTemplates] = useState([]);
  const [embeddedImageUrl, setEmbeddedImageUrl] = useState(null);
  const [responseData, setResponseData] = useState(null);
  useEffect(() => {
    const savedData = localStorage.getItem('responseData');
    if (savedData) {
      setResponseData(JSON.parse(savedData));
      setIsTokenValid(true);
    }else{
      const validateToken = async (token) => {
        try {
          const response = await fetch('http://marketing-module-be.fundexpert.in/user/identify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setIsTokenValid(true);
            const data = await response.json();
            setResponseData(data.user);
            localStorage.setItem('responseData', JSON.stringify(data.user));
          } else {
            setIsTokenValid(false);
          }
        } catch (error) {
          console.error('Error validating token:', error);
        }
      };

      const urlParams = new URLSearchParams(window.location.search);
      const authToken = urlParams.get('token');

      if (authToken) {
        validateToken(authToken);
      } else {
        console.error('No auth token found in URL');
      }
    }
  }, []);

  const openModal = (item) => {
    console.log('called- - - ', item)
    setIsModalOpen(true);
    setSelectedImage(item);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isTokenValid && (
        <div className="container flex flex-col lg:flex-row gap-8 p-6">
          <Form setIsFormDataValid={setIsFormDataValid} setGetTemplates={setGetTemplates} isFormDataValid={isFormDataValid}  embeddedImageUrl={embeddedImageUrl} setEmbeddedImageUrl={setEmbeddedImageUrl} responseData={responseData}/>
          <div className="flex-1">
            <TemplatesPage setIsFormDataValid={setIsFormDataValid} getTemplates={getTemplates} isFormDataValid={isFormDataValid} setSelectedImage={setSelectedImage}  openModal={openModal}/>
          </div>
        </div>
      )}
      {!isTokenValid && <p>Token is invalid or missing.</p>}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-6 max-w-3xl">
          <img
            src={selectedImage}
            alt={`Generated template`}
            className="w-full aspect-[4/3] object-contain rounded-lg"
          />
          <div className="flex justify-between items-center mt-4">

            <a href={selectedImage} download={`template_${Math.random()}.png`} >
              <Button variant="secondary">Download</Button>
            </a>
            <div className="flex gap-2">
                <FacebookMessengerShareButton url={selectedImage} quote="Check out this image on Facebook">
                  <FacebookMessengerIcon size={20} round />
                </FacebookMessengerShareButton>
                <WhatsappShareButton url={selectedImage} title="Check out this image on WhatsApp">
                  <WhatsappIcon size={20} round />
                </WhatsappShareButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;