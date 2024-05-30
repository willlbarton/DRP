import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

const Upload = () => {
  const onSubmit = () => {console.log("Submitted")}
  return (
    <div className="flex flex-col justify-center px-[200px] py-[100px]">
      <form onSubmit={onSubmit}>
        <Card className="p-4">
          <CardTitle>Upload Proof of Study</CardTitle>
          <CardContent className="mt-7">
            <Input
              type="file"
              id="pdfUpload"
              name="pdfUpload"
              accept="application/pdf"
              className="w-[300px] -ml-6"
              required
            />
          </CardContent>
          <h2 className="font-semibold mt-1">What is Proof of Study?</h2>
          <p>
            That would be proof of registration for the{" "}
            <span className="underline">current</span> academic year, NOT the
            previous year's transcript.
          </p>
          <Button type="submit" className="w-full mt-[200px]">
            Submit
          </Button>
        </Card>
      </form>
    </div>
  );
};

export default Upload;