"use server"
import { revalidatePath } from "next/cache";
import { verifySession } from "../dal";

// Fetch files
export const fetchFiles = async () => {
    const session = await verifySession(); 
    if (!session?.isAuth) return { error: { message: "User not authenticated" } };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/media/files/folder?folder=Files`, {
            headers: { Authorization: `Bearer ${session.cookie}` },
        });

        if (!response.ok) return { error: { message: "Failed to fetch files from server" } };

        const data = await response.json();
        if (!Array.isArray(data)) return { error: { message: "Invalid file data format" } };

        const transformedData = data.map((file: any) => ({
            id: file.id.toString(),
            name: file.name,
            extension: file.ext,
            createdAt: file.createdAt,
            url: file.url,
        }));

        return transformedData;
    } catch (error: any) {
        return { error: { message: "Error fetching files: " + error.message } };
    }
};

// Delete file
export const deleteFile = async (folder: string, fileId: string) => {
    const session = await verifySession();
    if (!session?.isAuth) return { error: { message: "User not authenticated" } };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/media/delete/${folder}/${fileId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${session.cookie}` },
        });

        if (!response.ok) return { error: { message: `Error ${response.status}: Could not Delete File` } };

        await response.json();
        revalidatePath('/dashboard');
        return { success: { message: "File deleted successfully!" } };

    } catch (error: any) {
        return { error: { message: "Error deleting file: " + error.message } };
    }
};

// Upload file
export const uploadFile = async (folder: string = "Files", file: File) => {
    const session = await verifySession();
    if (!session?.isAuth) return { error: { message: "User not authenticated" } };

    const MAX_FILE_SIZE_MB = 50;
    const maxFileSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

    // Check file size before uploading
    if (file.size > maxFileSizeBytes) {
        return { error: { message: `File too large. Max allowed size is 50MB.` } };
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/media/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.cookie}` },
            body: formData,
        });

        if (res.status === 413) {
            return { error: { message: "File too large. Max allowed size is 50MB." } };
        }

        if (!res.ok) {
            return { error: { message: `Upload failed with status ${res.status}` } };
        }

        const data = await res.json();
        if (!data) return { error: { message: "No data returned from the server." } };

        revalidatePath('/dashboard');
        return { success: data };

    } catch (error: any) {
        return { error: { message: "Error uploading file: " + error.message } };
    }
};
