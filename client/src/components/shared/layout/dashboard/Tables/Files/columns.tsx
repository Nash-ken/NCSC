"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { deleteFile } from "@/lib/actions/files"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { startTransition, useState } from "react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Define the shape of the file data
export type File = {
  id: string
  name: string
  extension: string
  createdAt: string // Assuming it is a string timestamp
  url: string // URL for downloading the file
}

const deleteId = async (folder: string, fileId: string) => {
  
  const file = await deleteFile(folder, fileId)
  if(file?.error) {
    toast.error(file.error.message)
  }
  if(file?.success) {
    toast.success(file.success.message)
  }
}

const handleDownload = async (file: { name: string; url: string }) => {
  const fileUrl = process.env.NEXT_PUBLIC_STRAPI_URL + file.url;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

// Define the columns for the table
export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "name", // Accessor for the file name
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
        const fullName = row.getValue("name") as string;
        const nameWithoutExtension = fullName.split('.').slice(0, -1).join('.');
        return <span>{nameWithoutExtension}</span>;
      },
  },
  
  {
    accessorKey: "extension", // Accessor for the file extension
    header: "Extension",
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
      return <span>{formatted}</span>;
    },
  },
  {
    id: "download", 
    cell: ({ row }) => {
      const file = row.original // Get the original file object from the row
      const [openDialog, setOpenDialog] = useState(false);

      const handleConfirmDownload = () => {
        setOpenDialog(false); // Close the dialog
        startTransition(() => handleDownload({ name: file.name, url: file.url }));
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(file.id)} // Copy file ID to clipboard
            >
              Copy file ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenDialog(true)}>Download</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => startTransition(() => deleteId('Files', file.id))}
            >
              Delete file</DropdownMenuItem>
          </DropdownMenuContent>

          {/* AlertDialog for confirmation before download */}
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger />
            <AlertDialogContent>
            
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Download</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Are you sure you want to download this file?
              </AlertDialogDescription>
              <div className="flex justify-end space-x-2">
                <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDownload}>
                  Confirm
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenu>
      );
    },
    header: "Download", // Column header for actions
  },
]
