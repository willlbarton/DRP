import React from 'react'
import { PDFDocument } from 'pdf-lib';
import { Card, CardTitle, CardContent } from '@/components/ui/card';

const FormViewer = () => {
  return (
    <div className="flex flex-col w-screen">
      <Card className="p-8 self-center w-[90%] max-w-[800px]">
        <CardTitle>
          Download filled out form
        </CardTitle>
        <CardContent className="mt-8">
          
        </CardContent>
        </Card>
    </div>
  )
}

export default FormViewer