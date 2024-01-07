// pages/index.js
import React from 'react';
import Form from '../components/Form';
import Modal from "../components/Modal";
import {useState} from "react";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const openModal = (item) => {
    console.log('item', item);
    setIsModalOpen(true);
    setSelectedImage(item);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const cardImgs = [
    {
      img: "/1.png"
    },
    {
      img: "/2.png"
    },
    {
      img: "/3.png"
    },
    {
      img: "/4.png"
    }
  ]

  return (
    <div className="container mx-auto my-8">
      <div className="flex flex-col md:flex-row p-4 md:p-6">
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <img src='1.png' alt="img"/>

        </Modal>
        <div className="w-full md:w-[40%] p-3 md:p-5">
          <h1 className="text-4xl font-bold mb-8">Fill this form</h1>
          <Form />
        </div>
        <div className=" w-full md:w-full p-3 md:p-5 flex flex-row flex-wrap gap-4">
          {cardImgs.map((item, index) =>
             <div key={index} className="w-[250px] border-2 p-2 flex flex-col gap-3 rounded-lg">
                <div className="h-full">
                  <img src={item.img} alt={index} className="object-cover"/>
                </div>
                <div className="flex justify-between items-center gap-2 h-[43px]">
                  <button className="bg-blue-600 text-white py-2 px-3 rounded-lg w-full" onClick={()=>openModal(item)}>
                    Preview
                  </button>
                  <button className="bg-blue-600 text-white py-2 px-3 rounded-lg w-full">
                    Share
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;
