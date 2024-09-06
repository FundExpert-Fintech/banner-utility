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
export default function TemplateDisplay({ templates, openModal }){
  console.log('templates - - - - -', JSON.stringify(templates));
  return (
    <>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">{templates.length > 0 ? ' Generated Templates' : 'Generating Templates...'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {templates.length > 0 ? (templates.map((template, index) => (
            <Card key={index+1} className="w-full">
              <CardContent className="flex flex-col items-center space-y-4">
                <img
                  src={template.embeddedImage}
                  alt={`Generated template ${index}`}
                  className="w-full aspect-[2/1] object-cover rounded-lg"
                />
                <div className="flex gap-2">
                  <Button onClick={() => openModal(template.embeddedImage)}>Preview</Button>
                  <a href={template.embeddedImage} download={`template_${index}.png`} >
                    <Button variant="secondary">Download</Button>
                  </a>
                  <div className='flex justify-center items-center gap-3 w-1/2'>
                    <FacebookMessengerShareButton url={template.url} quote="">
                      <FacebookMessengerIcon size={20} round />
                    </FacebookMessengerShareButton>

                    <WhatsappShareButton url={template.embeddedImage} title="">
                      <WhatsappIcon size={20} round />
                    </WhatsappShareButton>
                  </div>
                </div>
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

