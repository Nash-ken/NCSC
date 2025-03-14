"use client";

import { startTransition, useActionState, useState } from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadFileToStrapi } from "@/lib/actions"; // Import the function
import { Loader2 } from "lucide-react";

const FilesHeader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, action, pending] = useActionState(async () => {
    if(selectedFile) {
    const file = await uploadFileToStrapi(selectedFile)
    setSelectedFile(null);
    return file;
    }
  }, undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  

  return (
    <>
      <CardTitle>Files</CardTitle>
      <CardDescription>Download Files</CardDescription>
      <Input
        type="file"
        name="upload"
        id="upload"
        className="ml-auto w-fit"
        onChange={handleFileChange}
        disabled={pending}
      />
      <Button variant="secondary" onClick={() => startTransition(action)} disabled={pending || !selectedFile}>
        {pending ? <Loader2 className=" animate-spin" /> : "Upload"}
      </Button>
    </>
  );
};

export default FilesHeader;
