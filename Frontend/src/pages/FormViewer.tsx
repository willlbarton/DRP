import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { db, storage } from '@/firebase/firebase';
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from '@/contexts/authContexts';
import { Button } from '@/components/ui/button';

const FormViewer = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const { currentUser } = useAuth();

  const fillPdf = async () => {
    const existingPdfBytes = await fetch('form.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    fields.forEach(async field => {
      switch (field.constructor.name) {
        case 'PDFTextField2':
          const name = field.getName();
          var dst = ""
          switch (name) {
            case 'Name':
              dst = "Name"
              console.log("Name")
              break;
            case 'Address':
              dst = "Address"
              break;
            case 'Postcode':
              dst = "Postcode"
              break;
            case 'Property address':
              dst = "Property Address"
              break;
            case 'Names of all residents':
              dst = "Name0"
              break;
            case 'Names of all residents1':
              dst = "Name1"
              break;
            case 'Names of all residents2':
              dst = "Name2"
              break;
            case 'Names of all residents3':
              dst = "Name3"
              break;
            case 'Names of all residents4':
              dst = "Name4"
              break;
            case 'Names of all residents5':
              dst = "Name5"
              break;
            case 'date moved in 2':
              dst = "Date Moved In0"
              break;
            case '1':
              dst = "Date Moved In1"
              break;
            case '2':
              dst = "Date Moved In2"
              break;
            case '1_3':
              dst = "Date Moved In3"
              break;
            case '2_3':
              dst = "Date Moved In4"
              break;
            case '2_5':
              dst = "Date Moved In5"
              break;
            case 'date of birth 2':
              dst = "Date of Birth0"
              break;
            case '1_2':
              dst = "Date of Birth1"
              break;
            case '2_2':
              dst = "Date of Birth2"
              break;
            case '1_4':
              dst = "Date of Birth3"
              break;
            case '2_4':
              dst = "Date of Birth4"
              break;
            case '2_6':
              dst = "Date of Birth5"
              break;
          }
          const userId = currentUser?.uid || 'defaultUID';
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);
          console.log(dst)
          const val = docSnap.data()?.[dst];
          console.log(val)
          form.getTextField(name).setText(val || '');
          console.log(name + ":"+form.getTextField(name).getText())
      }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    console.log(pdfUrl);
  }

  const download = async () => {
    fillPdf();
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
  
  //listFormFields();

  return (
    <div className="flex flex-col w-screen">
      <Card className="p-8 self-center w-[90%] max-w-[800px]">
        <CardTitle className='text-center'>
          Download filled out form
        </CardTitle>
        <CardContent className="flex flex-col gap-8 mt-8">
          <Button onClick={fillPdf}>Get filled in form</Button>
            {pdfUrl && (
              <Button>
              <a href={pdfUrl} download="filled_form.pdf">
                Download Filled PDF
              </a>
              </Button>
            )}
        </CardContent>
        </Card>
    </div>
  )
}

export default FormViewer