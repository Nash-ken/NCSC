'use client';

import { useState, useActionState, startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/lib/actions/files";
import { redirect } from "next/navigation";



export const FileInput = () => {
  const [fileName, setFileName] = useState<string>("Upload file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Upload handler wrapped in useActionState
  const uploadHandler = async (prevState: any) => {
    if (!selectedFile) return { error: "No file selected" };

    const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '50');
    const maxFileSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    
  
    if (selectedFile.size > maxFileSizeBytes) {
      toast.error("File too large. Max is 50MB" )
      setSelectedFile(null)
      setFileName("Upload File")
      return { error: "File too large. Max is 50MB" };
    }
  

    const result = await uploadFile("Files", selectedFile);

    if(result === undefined){ 
      toast.error("Session expired. Please log in again to continue.");
      redirect('/login')
    }

    if (result?.success) {
      toast.success("File uploaded!");
      setSelectedFile(null);
      setFileName("Upload file");
      return { success: true };
    } else {
      toast.error(result.error?.message || "Upload failed");
      return { error: result?.error || "Unknown error" };
    }
  };

  const [uploadState, uploadAction, isPending] = useActionState(uploadHandler, null);

  const handleOpenFileDialog = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div className="flex flex-col justify-between space-y-4 w-full mt-3">
      <div className="flex md:justify-end justify-between items-center space-x-3">
        <Button
          onClick={handleOpenFileDialog}
          variant="secondary"
          className="flex items-center min-w-24 max-w-32 overflow-hidden text-ellipsis"
        >
          <Folder className="mr-auto" />
          <p className="overflow-hidden text-ellipsis">{fileName}</p>
        </Button>

        <Button className="min-w-24" onClick={() => startTransition(uploadAction)} disabled={isPending || !selectedFile}>
          {isPending ? <Loader2 className=" animate-spin" /> : "Upload"}
        </Button>
      </div>

      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setSelectedFile(file);
          setFileName(file ? file.name : "Upload file");
        }}
      />
    </div>
  );
};

export default FileInput;
