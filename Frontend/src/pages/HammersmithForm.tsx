import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useAuth } from "@/contexts/authContexts";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase/firebase.ts";
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import pdfToText from 'react-pdftotext'

const LIGHT_GREEN = "#05e82e";
const LIGHT_RED = "#ed3261";
const TURQUOISE = "#e405e8";

const FIELDS1 = [
  "Name",
  "Address",
  "Postcode",
  "Council Tax Reference Number",
  "Property Address",
];

const FIELDS2 = [
  "Name of Landlord/Letting Agent",
  "Address of Landlord/Letting Agent",
];

const FIELDS3 = ["Email", "Signature", "Telephone Number"];

const TABLE_FIELDS = [
  "Name",
  "Date Moved In",
  "Date of Birth",
  "Full Time Student? (Y/N)",
];

type FormRefs = {
  [key: string]: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
};

function validateProofOfStudy (text : string, setProofMessage: ((arg0: string) => void), setColor: ((arg0: string) => void)) {
  const pdfText = text.toLowerCase();
  // Check if transcript
  if (pdfText.includes("transcript")) {
    setProofMessage("You uploaded a Transcript, not a Statement of Registration");
    setColor(LIGHT_RED);
    console.log("!Warning!: You uploaded a Transcript, not a Statement of Registration.");
  }
  else if (pdfText.includes("imperial")) {
    if (!pdfText.includes("statement of registration")) {
      setProofMessage("This Imperial College London document is not a Statement of Registration");
      setColor(LIGHT_RED)
      console.log("!Warning!: this Imperial College document is not a Statement of Registration");
    } else {
      setProofMessage("This looks correct!");
      setColor(LIGHT_GREEN);
      console.log("Verified!");
    }
  } else {
    setProofMessage("This looks correct!");
    setColor(LIGHT_GREEN);
    console.log ("verified!");
  }
}

const HammersmithForm: React.FC = () => {
  const [proofMessageVisible, setProofMessageVisible] = useState(false);
  const [proofMessage, setProofMessage] = useState("");
  // Initially blue.
  const [proofMessageBackgroundColor, setProofMessageBackgroundColor] = useState(LIGHT_GREEN);
  
  const {currentUser} = useAuth()
  
  
  console.log(currentUser?.uid)
  
  const navigate = useNavigate();
  const formRefs = useRef<FormRefs>({});
  
  const onStudyProofUpload = (event:any) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, `proofOfStudy/${currentUser?.uid}/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
    pdfToText(file)
        .then(text => {
          validateProofOfStudy(text, setProofMessage, setProofMessageBackgroundColor);
          })
          .catch(error => {
            setProofMessage("Failed to get text from your file.");
            setProofMessageBackgroundColor(TURQUOISE);
            console.error("Upload failed")
            });
    setProofMessageVisible(true)
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = currentUser?.uid || 'defaultUID';
    const docRef = doc(db, 'users', userId);
    const values: { [key: string]: string } = Object.keys(formRefs.current).reduce((acc, key) => {
      const ref = formRefs.current[key];
      if (ref) {
        const val = (ref as HTMLInputElement).type === "checkbox" ? (ref as HTMLInputElement).checked.toString() : ref.value;
        acc[key] = val;
        setDoc(docRef, { [key]: val }, { merge: true })
      }
      return acc;
    }, {} as { [key: string]: string });
    console.log(values);
  };

  useEffect(() => {
    if(!currentUser) {
      navigate("/login")
    }
  }, [])

  return (
    <div className="flex flex-col justify-center w-screen">
      <Card className="p-8 self-center w-[90%] max-w-[800px]">
        <CardTitle>
          Hammersmith and Fulham Council Tax Exemption Form
        </CardTitle>
        <CardContent className="mt-8">
          <form id="hammersmithform" className="gap-8 flex flex-col" onSubmit={onSubmit}>
          {FIELDS1.map((field, i) => (
            <div key={i} className="mb-4">
              <Label htmlFor={field} className="font-semibold">
                {field}
              </Label>
              {i === 1 || i === 4 ? ( // Check if the index is 2 or 5 (0-based index)
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" className="ml-2">i</Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                  {i === 1 ? (
                    <span>Address you live at. Mail will be sent here.</span>
                  ) : (
                    <span>Address of the property eligible for council tax exemption</span>
                  )}
                  </HoverCardContent>
                </HoverCard>
              ) : null}
              <Input id={field} placeholder={field} ref={(el) => (formRefs.current[field] = el)} required />
            </div>
          ))}

            <div className="">
              <p className = "font-semibold mx-auto underline text-center">Resident Information</p>
              <div  className="flex overflow-x-auto">
                {TABLE_FIELDS.map((field, i) => (
                  <div key={i}>
                    <div className="text-nowrap font-semibold overflow-x-auto p-4 border">
                      {field}
                    </div>
                    <div>
                      {[1, 2, 3, 4, 5, 6].map((_, i) => (
                        <Input className="border rounded-none outline-none focus-visible:ring-0" key={`${field}${i}`} ref={(el) => (formRefs.current[`${field}${i}`] = el)}/>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {FIELDS2.map((field, i) => (
              <div key={i}>
                <Label htmlFor={field}>{field}</Label>
                <Input id={field} placeholder={field} ref={(el) => (formRefs.current[field] = el)} required />
              </div>
            ))}

            <p>
              <span className="font-semibold">Declaration:</span> I declare that
              the details stated in this form are correct to the best of my
              knowledge and belief
              <Checkbox required className="m-2" />
            </p>

            {FIELDS3.map((field, i) => (
              <div key={i}>
                <Label htmlFor={field} className="font-semibold">
                  {field}
                </Label>
                <Input id={field} placeholder={field} ref={(el) => (formRefs.current[field] = el)} required />
              </div>
            ))}
            <div className="space-y-4">
              <p className = "font-semibold underline">Upload Proof of Study</p>
              <Input
                type="file"
                id="pdfHammersmithUpload"
                name="pdfHammersmithUpload"
                accept="application/pdf"
                className="w-[300px]"
                onChange={onStudyProofUpload}
                required
              />
              {proofMessageVisible &&
                <div style={{backgroundColor : proofMessageBackgroundColor, textAlign:"center"}}>
                  {proofMessage}
                </div>
              }
              <div>
              <h2 className="font-semibold mt-1">What is Proof of Study?</h2>
              <p>
                That would be proof of registration for the{" "}
                <span className="underline">current</span> academic year, NOT the
                previous year's transcript.
              </p>
              </div>
            </div>
            <Button type="submit" onSubmit={onSubmit}> Submit </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HammersmithForm;
