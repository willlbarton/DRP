import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Card, CardTitle, CardContent } from '@/components/ui/card';

const FormViewer = () => {
  const [pdfBlob, setPdfBlob] = useState(null);

  const fillPdf = async () => {
    const existingPdfBytes = await fetch('/path/to/application_for_council_tax_student_discount.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
  }

  const listFormFields = async () => {
    const existingPdfBytes = await fetch('form.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
  
    fields.forEach(field => {
      const type = field.constructor.name;
      const name = field.getName();
      console.log(`${type}: ${name}`);
    });
  };
  
  listFormFields();

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