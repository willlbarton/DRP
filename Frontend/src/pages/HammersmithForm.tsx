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
import { Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";

const LIGHT_GREEN = "#05e82e";
const LIGHT_RED = "#ed3261";
const TURQUOISE = "#e405e8";
const LIGHT_ORANGE = "#fcba03";

const FIELDS1 = [
  "Name",
  "Home Address",
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
  "Full Time Student?"
];

type FormRefs = {
  [key: string]: HTMLInputElement | HTMLButtonElement | null;
};

function validateProofOfStudy
  (text : string,
  setProofMessage: ((arg0: string) => void), 
  setColor: ((arg0: string) => void),
  postcode : string) {
  const pdfText = text.toLowerCase();
  // Only check proof of study if something has been uploaded.
  if (text != "") {
    // Check if transcript
    if (pdfText.includes("transcript")) {
      setProofMessage("You uploaded a Transcript, not a Statement of Registration");
      setColor(LIGHT_RED);
    }
    else if (pdfText.includes("imperial") && !pdfText.includes("statement of registration")) {
      setProofMessage("This Imperial College London document is not a Statement of Registration");
      setColor(LIGHT_RED)
    } else {
      // Check names and postcode matches.
      if (pdfText.replace(" ", "").includes(postcode.toLowerCase().replace(" ",""))) {
        // This is probably correct, but we could have warnings.
        if (!pdfText.includes("registration")) {
          setProofMessage("Hmm... This doesn't look like a registration document.")
          setColor(LIGHT_ORANGE);
        } else {
          setProofMessage("This looks correct!");
          setColor(LIGHT_GREEN);
        }
      } else {
        setProofMessage("Your proof of study should contain your Postcode: " + postcode);
        setColor(LIGHT_RED)
      }
    }
  }
}

const HammersmithForm: React.FC = () => {
  const [proofMessageVisible, setProofMessageVisible] = useState(false);
  const [proofMessage, setProofMessage] = useState("");
  // Initially blue.
  const [proofMessageBackgroundColor, setProofMessageBackgroundColor] = useState(LIGHT_GREEN);
  const [proofOfStudyFileText, setProofOfStudyFileText] = useState("");

  const [postcode, setPostcode] = useState("");
  
  const {currentUser} = useAuth()
  
  const navigate = useNavigate();
  const formRefs = useRef<FormRefs>({});

  const handleFieldChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (i == 2) {
      setPostcode(e.target.value);
      validateProofOfStudy(proofOfStudyFileText, setProofMessage, setProofMessageBackgroundColor, postcode);
    }
  }
  
  const onStudyProofUpload = (event:any) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, `proofOfStudy/${currentUser?.uid}/${file.name}`);
    uploadBytes(storageRef, file)
    pdfToText(file)
        .then(text => {
          setProofOfStudyFileText(text);
          validateProofOfStudy(text, setProofMessage, setProofMessageBackgroundColor, postcode);
          })
          .catch(error => {
            setProofMessage("Failed to get text from your file.");
            setProofMessageBackgroundColor(TURQUOISE);
            setProofOfStudyFileText(""); // no file uploaded.
            console.error("Upload failed")
            });
    setProofMessageVisible(true)
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = currentUser?.uid || 'defaultUID';
    const docRef = doc(db, 'users', userId);
    const values: { [key: string]: string | boolean } = Object.keys(formRefs.current).reduce((acc, key) => {
      const ref = formRefs.current[key];
      if (ref) {
        if ((ref as HTMLElement).getAttribute('aria-checked') !== null) {
          const isChecked = (ref as HTMLInputElement).getAttribute('aria-checked') === 'true';
          acc[key] = isChecked
        } else {
          const val = (ref as HTMLInputElement).value;
          acc[key] = val;
        }
        setDoc(docRef, { [key]: acc[key] }, { merge: true });
      }
      return acc
    }, {} as { [key: string]: string | boolean });
    navigate("/form-viewer");
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
              {i == 0 || i === 1 || i === 4 ? ( // Check if the index is 2 or 5 (0-based index)
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" className="ml-2"><Info className="size-4"/></Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                  {i === 1 ? (
                    <span>Address you live at. Mail will be sent here.</span>
                  ) : (i == 4) ? (
                    <span>Address of the property eligible for council tax exemption</span>
                  ) : <span>First name and Surname only</span>}
                  </HoverCardContent>
                </HoverCard>
              ) : null}
              {i === 3 ? (
                <Input
                  id={field}
                  onChange={(e) => handleFieldChange(i, e)}
                  placeholder={field}
                  ref={(el) => (formRefs.current[field] = el)}
                  pattern="\d{8}"
                  maxLength={8}
                  required
                />
              ) : (
                <Input
                  id={field}
                  onChange={(e) => handleFieldChange(i, e)}
                  placeholder={field}
                  ref={(el) => (formRefs.current[field] = el)}
                  required
                />
              )}
            </div>
          ))}
            <div>
              <p className="font-semibold mx-auto underline text-center">Resident Information</p>
              <div className="overflow-x-auto">
                <Table className="min-w-full border">
                  <TableHeader>
                    <TableRow>
                      {TABLE_FIELDS.map((field, i) => (
                        <TableHead key={i} className="font-semibold p-4 border">
                          {field}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5, 6].map((rowIndex) => (
                      <TableRow key={rowIndex} className="border">
                        {TABLE_FIELDS.map((field, colIndex) => (
                          <TableCell key={colIndex} className="p-2 border">
                            {field !== "Full Time Student?" ? (
                              <Input
                                className="border border-none rounded-none outline-none focus-visible:ring-0 w-full"
                                ref={(el) => (formRefs.current[`${field}${rowIndex}`] = el)}
                              />
                            ) : (
                              <div className="flex justify-center">
                                <Checkbox ref={(el) => formRefs.current[`${field}${rowIndex}`] = el} className="m-2"/>
                              </div>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
