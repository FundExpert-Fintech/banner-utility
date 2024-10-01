import React from 'react';
import TemplateDisplay from '../../components/TemplateDisplay';
import {Skeleton} from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
const TemplatesPage = ({isFormDataValid, getTemplates, openModal, showLoader}) => {
  console.log('isFormDataValid ---', isFormDataValid);

  return (
    <div>
      {isFormDataValid ? (
        showLoader ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
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
            ))}
          </div>
        ) : (
          <TemplateDisplay templates={getTemplates} openModal={openModal} />
        )
      ) : (
        <>
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Form Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <InstructionStep
                number={1}
                title="Upload Logo"
                description="Click on the 'Choose file' button, select your Logo and click on the upload button. Supported formats may include .jpg, .png, .svg or .gif."
              />
              <InstructionStep
                number={2}
                title="Name to Display"
                description="Enter the Name of your choice. This will be reflected on the template."
              />
              <InstructionStep
                number={3}
                title="Contact Number"
                description="Enter your primary contact information (Number/Email). This will be reflected on the template."
              />
              <InstructionStep
                number={4}
                title="Submit"
                description="Once all the above mandatory information is filled, click on the 'Submit' button to view the templates."
              />
              <InstructionStep
                number={5}
                title="Preview and Download Templates"
                description="After submitting the form, all dynamic templates will appear on the screen. You can preview each template and download your preferred ones."
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TemplatesPage;


function InstructionStep({ number, title, description }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}