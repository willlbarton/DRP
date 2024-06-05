import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

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
  "Names",
  "Date Moved In",
  "Date of Birth",
  "Full Time Student? (Y/N)",
];

type FormRefs = {
  [key: string]: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
};

// const Home = () => {
  // const onSubmit = () => {
  //   console.log("yeahh");
  // };

const Home: React.FC = () => {
  const navigate = useNavigate();
  const formRefs = useRef<FormRefs>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values: { [key: string]: string } = Object.keys(formRefs.current).reduce((acc, key) => {
      const ref = formRefs.current[key];
      if (ref) {
        acc[key] = (ref as HTMLInputElement).type === "checkbox" ? (ref as HTMLInputElement).checked.toString() : ref.value;
      }
      return acc;
    }, {} as { [key: string]: string });
    console.log(values);
  };

  return (
    <div className="flex flex-col justify-center px-[200px] py-[100px]">
      <Card className="p-8">
        <CardTitle>
          Hammersmith and Fulham Council Tax Exemption Form
        </CardTitle>
        <CardContent className="mt-8">
          <form className="gap-8 flex flex-col" onSubmit={onSubmit}>
            {FIELDS1.map((field, i) => (
              <div key={i}>
                <Label htmlFor={field} className="font-semibold">
                  {field}
                </Label>
                <Input id={field} placeholder={field} ref={(el) => (formRefs.current[field] = el)} required />
              </div>
            ))}

            <div className="flex overflow-x-auto">
              {TABLE_FIELDS.map((field, i) => (
                <div>
                  <div className="text-nowrap font-semibold overflow-x-auto p-4 border">
                    {field}
                  </div>
                  <div>
                    {[1, 2, 3, 4].map((_, i) => (
                      <Input key={`${field}${i}`} placeholder={""} ref={(el) => (formRefs.current[`${field}${i}`] = el)}/>
                    ))}
                  </div>
                </div>
              ))}
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

            <Button type="submit" onClick={() => navigate("/upload")}> Continue </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

console.log("Home Page Contents successfully loaded.");

export default Home;
