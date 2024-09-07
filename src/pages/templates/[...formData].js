import React from 'react';
import TemplateDisplay from '../../components/TemplateDisplay';
import {Card, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

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
        <p>Please fill out all form fields</p>
      )}
    </div>
  );
};

export default TemplatesPage;
