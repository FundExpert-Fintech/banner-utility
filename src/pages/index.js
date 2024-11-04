import React, { useEffect, useState } from 'react';
import Form from '../components/Form';
import TemplatesPage from './templates/[...formData]';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FacebookMessengerIcon, FacebookMessengerShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

const ModalContent = ({ selectedImage, onClose }) => (
  <Dialog open={!!selectedImage} onOpenChange={onClose}>
    <DialogContent className="p-6 max-w-3xl">
      <img
        src={selectedImage}
        alt={`Generated template`}
        className="w-full aspect-[4/3] object-contain rounded-lg"
      />
      <div className="flex justify-between items-center mt-4">
        <a href={selectedImage} download={`template_${Math.random()}.png`}>
          <Button variant="secondary">Download</Button>
        </a>
        <div className="flex gap-2">
          <p>To share this image, please download it first.</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const Home = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isFormDataValid, setIsFormDataValid] = useState(false);
  const [getTemplates, setGetTemplates] = useState([]);
  const [embeddedImageUrl, setEmbeddedImageUrl] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlRoleId = urlParams.get('roleId');
    const urlApplicationId = urlParams.get('appId')

    if (urlToken && urlRoleId) {
      // If token and roleId are in the URL, clear localStorage and store new values
      localStorage.clear();
      localStorage.setItem('auth_token', urlToken);
      localStorage.setItem('roleId', urlRoleId);
      localStorage.setItem('appId', urlApplicationId);
      validateToken(urlToken);
    } else {
      // Use token from localStorage if URL doesn't have token
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        validateToken(storedToken);
      } else {
        setIsTokenValid(false);
      }
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch('http://marketing-module-be.fundexpert.in/user/identify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const data = await response.json();
      setIsTokenValid(true);
      setResponseData(data.user);
      localStorage.setItem('responseData', JSON.stringify(data.user));
      removeTokenFromUrl();
    } catch (error) {
      console.error('Error validating token:', error);
      setIsTokenValid(false);
      localStorage.clear();  // Clear storage if validation fails
    }
  };

  const removeTokenFromUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    url.searchParams.delete('roleId');
    url.searchParams.delete('appId');
    window.history.replaceState({}, document.title, url.toString());
  };

  const openModal = (item) => {
    setIsModalOpen(true);
    setSelectedImage(item);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };

  return (
    <>
      {isTokenValid ? (
        <div className="container flex flex-col lg:flex-row gap-8 p-6">
          <Form
            setIsFormDataValid={setIsFormDataValid}
            setGetTemplates={setGetTemplates}
            isFormDataValid={isFormDataValid}
            embeddedImageUrl={embeddedImageUrl}
            setEmbeddedImageUrl={setEmbeddedImageUrl}
            responseData={responseData}
            setShowLoader={setShowLoader}
          />
          <div className="flex-1">
            <TemplatesPage
              setIsFormDataValid={setIsFormDataValid}
              getTemplates={getTemplates}
              isFormDataValid={isFormDataValid}
              setSelectedImage={setSelectedImage}
              openModal={openModal}
              showLoader={showLoader}
            />
          </div>
        </div>
      ) : (
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight">
          Something went wrong! please refresh/close this page and try again
        </p>

      )}
      <ModalContent selectedImage={selectedImage} onClose={closeModal} />
    </>
  );
};

export default Home;
