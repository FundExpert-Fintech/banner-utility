'use client'
import React, { useState } from 'react';
import { WhatsappShareButton, WhatsappIcon, FacebookMessengerIcon, FacebookMessengerShareButton, TwitterShareButton, XIcon } from 'react-share';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function TemplateDisplay({ templates, openModal, showLoader }) {
  return (
    <>
      <div className="flex-1">
      {templates.length > 0
        ? <h2 className="text-2xl font-bold mb-4"> Generated Templates
            <p className='text-sm font-light'>To share this image, please download it first.</p>
          </h2>
        : <h2 className="text-2xl font-bold mb-4"> No templates Found!
            <p className='text-sm font-light'>Please contact our support team for more information</p>
          </h2>
      }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          { templates.map((template, index) => (
              <Card key={index + 1} className="w-full">
                <CardContent className="flex flex-col items-center space-y-4">
                  <img
                    src={template.embeddedImage}
                    alt={`Generated template ${index + 1}`}
                    className="w-full aspect-[2/1] object-cover rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => openModal(template.embeddedImage)}>Preview</Button>
                    <a href={template.embeddedImage} download={`template_${index + 1}.png`}>
                      <Button variant="secondary">Download</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>))}
        </div>
      </div>
    </>
  );
};
