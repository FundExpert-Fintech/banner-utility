'use client'
import React from 'react';
import { WhatsappShareButton, WhatsappIcon, FacebookMessengerIcon, FacebookMessengerShareButton, TwitterShareButton, XIcon } from 'react-share';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {useState} from "react";
export default function TemplateDisplay({ templates }){
  const [isLightboxOpen,setIsLightboxOpen] = useState(false);
  return (
    <>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">{templates.length > 0 ? 'Generating Templates...' : 'Generated Templates'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {templates.length > 0 ? (templates.map((template, index) => (
            <Card key={index} className="w-full">
              <CardContent className="flex flex-col items-center space-y-4">
                <img
                  src={template.embeddedImage}
                  alt={`Generated template ${index}`}
                  className="w-full aspect-[2/1] object-cover rounded-lg"
                />
                <div className="flex gap-2">
                  <Button onClick={() => setIsLightboxOpen(true)}>Preview</Button>
                  <Button variant="secondary">Download</Button>
                  <Link
                    href={template.embeddedImage}
                    className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                    prefetch={false}
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </Link>
                  <Link
                    href={template.embeddedImage}
                    className="inline-flex items-center gap-1 text-green-500 hover:underline"
                    prefetch={false}
                  >
                    <PhoneIcon className="w-4 h-4" />
                  </Link>
                </div>
                <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                  <DialogContent className="p-6 max-w-2xl">
                    <img
                      src={template.embeddedImage}
                      alt={`Generated template ${index}`}
                      className="w-full aspect-[4/3] object-cover rounded-lg"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <Button variant="secondary">Download</Button>
                      <div className="flex gap-2">
                        <Link
                          href={template.embeddedImage}
                          className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                          prefetch={false}
                        >
                          <FacebookIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          href={template.embeddedImage}
                          className="inline-flex items-center gap-1 text-green-500 hover:underline"
                          prefetch={false}
                        >
                          <PhoneIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))) : (
            [...Array(6)].map((_, index) => (
              <Card key={index} className="w-full">
                <CardContent className="flex flex-col items-center space-y-4">
                  <Skeleton className="w-full aspect-[2/1] rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      {/*<div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Generated Templates</h2>
        <div className='flex flex-row flex-wrap gap-4 sm:gap-6 justify-center sm:justify-between'>
          {templates.map((template, index) => (
             <div key={index+1} className="w-[250px] border-2 p-2 flex flex-col gap-3 rounded-lg">
                <div className="h-full">
                  <img src={template.embeddedImage} alt={index} className="object-cover"/>
                </div>
                <div className="flex justify-between items-center gap-2 h-[43px]">
                  <button className="bg-gray-800 text-white py-2 px-3 rounded-lg w-1/2" onClick={()=>openModal(template.embeddedImage)}>
                    Preview
                  </button>
                  <div className='flex justify-center items-center gap-3 w-1/2'>
                    <FacebookMessengerShareButton url={template.embeddedImage}
                                                  quote="Check out this image on Facebook">
                      <FacebookMessengerIcon size={32} round />
                    </FacebookMessengerShareButton>

                    <WhatsappShareButton url={template.embeddedImage}    title="Check out this image on WhatsApp">
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>*/}
    </>
  );
};
function FacebookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}


function PhoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

