import React, { useState, useEffect } from 'react';
import { PDFDocument, PDFTextField, PDFRadioGroup } from 'pdf-lib';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { db, storage } from '@/firebase/firebase'; // Ensure storage is imported
import { ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from '@/contexts/authContexts';
import { Button } from '@/components/ui/button';


const FormViewer = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | undefined>();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const pdfRef = ref(storage, 'form.pdf');
        const url = await getDownloadURL(pdfRef);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF URL:', error);
      }
    };

    fetchPdfUrl();
  }, []);

  const fillPdf = async () => {
    try {
      if (!pdfUrl) {
        console.error('PDF URL not available');
        return;
      }

      const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
      console.log("Bytes: ", existingPdfBytes);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      console.log("Fields: ", fields);

      const userId = currentUser?.uid || 'defaultUID';
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("No such document!");
        return;
      }

      const fieldUpdatePromises = fields.map(async field => {
        const fieldName = field.getName();
        let dst = '';
        let value = '';

        console.log(`Processing field: ${fieldName}`);

        if (field instanceof PDFTextField) {
          console.log("Text field")
          switch (fieldName) {
            case 'Name':
              dst = 'Name';
              break;
            case 'knowledge and belief':
              dst = 'Name';
              break;
            case 'Address':
              dst = 'Home Address';
              break;
            case 'Postcode':
              dst = 'Postcode';
              break;
            case 'Property address':
              dst = 'Property Address';
              break;
            case 'Names of all residents':
              dst = 'Name1';
              break;
            case 'Names of all residents1':
              dst = 'Name2';
              break;
            case 'Names of all residents2':
              dst = 'Name3';
              break;
            case 'Names of all residents3':
              dst = 'Name4';
              break;
            case 'Names of all residents4':
              dst = 'Name5';
              break;
            case 'Names of all residents5':
              dst = 'Name6';
              break;
            case 'date moved in 2':
              dst = 'Date Moved In1';
              break;
            case '1':
              dst = 'Date Moved In2';
              break;
            case '2':
              dst = 'Date Moved In3';
              break;
            case '1_3':
              dst = 'Date Moved In4';
              break;
            case '2_3':
              dst = 'Date Moved In5';
              break;
            case '2-5':
              dst = 'Date Moved In6';
              break;
            case 'date of birth 2':
              dst = 'Date of Birth1';
              break;
            case '1_2':
              dst = 'Date of Birth2';
              break;
            case '2_2':
              dst = 'Date of Birth3';
              break;
            case '1_4':
              dst = 'Date of Birth4';
              break;
            case '2_4':
              dst = 'Date of Birth5';
              break;
            case '2-6':
              dst = 'Date of Birth6';
              break;
            case 'Date':
              const date = new Date();
              form.getTextField(fieldName).setText(date.toLocaleDateString());
              break;
            case 'Email':
              dst = 'Email';
              break;
            case 'Tel no':
              dst = 'Telephone Number';
              break;
            case 'Name and address of landlord':
              const lname = docSnap.data()?.["Name of Landlord/Letting Agent"];
              const address = docSnap.data()?.["Address of Landlord/Letting Agent"];
              form.getTextField('Name and address of landlord').setText(`${lname} / ${address}`);
              break;
            case 'Council tax account ref':
              form.getTextField(fieldName).setText(docSnap.data()?.["Council Tax Reference Number"][0]);
              break;
            case 'Council tax account ref1':
              form.getTextField(fieldName).setText(docSnap.data()?.["Council Tax Reference Number"][1]);
              break;
            case 'Council tax account ref2':
              form.getTextField(fieldName).setText(docSnap.data()?.["Council Tax Reference Number"][2]);
              break;
            case 'Council tax account ref3':
              form.getTextField(fieldName).setText(docSnap.data()?.["Council Tax Reference Number"][3]);
              break;
            case 'Council tax account ref4':
              form.getTextField(fieldName).setText(docSnap.data()?.["Council Tax Reference Number"][4]);
              break;
            case 'Council tax account ref5':
              form.getTextField(fieldName).setText(docSnap.data()?.["Council Tax Reference Number"][5]);
              break;
            case 'Council tax account ref6':
              form.getTextField(fieldName).setText(docSnap.data()?.["Council Tax Reference Number"][6]);
              break;
            case 'Council tax account ref7':
              form.getTextField(fieldName).setText(docSnap.data()?.["Council Tax Reference Number"][7]);
              break;
          }

          if (!form.getTextField(fieldName).getText()) {
            value = docSnap.data()?.[dst] || '';
            form.getTextField(fieldName).setText(value);
          }

          console.log(`${fieldName}: ${form.getTextField(fieldName).getText()}`);
        } else if (field instanceof PDFRadioGroup) {
          console.log("Radio group")
          switch (fieldName) {
            case "yes or no":
              dst = "Full Time Student?1";
              break;
            case "yes or no 2":
              dst = "Full Time Student?2";
              break;
            case "yes or no 3":
              dst = "Full Time Student?3";
              break;
            case "yes or no 4":
              dst = "Full Time Student?4";
              break;
            case "yes or no 5":
              dst = "Full Time Student?5";
              break;
            case "yes or no 6":
              dst = "Full Time Student?6";
              break;
          }

          value = docSnap.data()?.[dst] || '';
          const radio = form.getRadioGroup(fieldName);
          const options = radio.getOptions();
          if (value) {
            radio.disableRequired();
            radio.clear();
            radio.select('Choice1');
            radio.enableRequired();
          } else {
            radio.select(options[1]);
          }

          console.log(`${fieldName}: ${radio.getSelected()}`);
        }
      });

      await Promise.all(fieldUpdatePromises);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfBlob(blob);
    } catch (error) {
      console.error('Error filling PDF:', error);
    }
  };

  const listFormFields = async () => {
    try {
      const existingPdfBytes = await fetch('/form.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const fields = form.getFields();
    
      fields.forEach(field => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`${type}: ${name}`);
      });
    } catch (error) {
      console.error('Error listing form fields:', error);
    }
  };
  
  listFormFields();

  return (
    <div className="flex flex-col w-screen">
      <Card className="p-8 self-center w-[90%] max-w-[800px]">
        <CardTitle className='text-center'>
          Download filled out form
        </CardTitle>
        <CardContent className="flex flex-col gap-8 mt-8">
          <Button onClick={fillPdf}>Get filled in form</Button>
          {pdfUrl && (
            <a href={pdfUrl} download="filled_form.pdf" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <Button>
                Download Filled PDF
              </Button>
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FormViewer;
