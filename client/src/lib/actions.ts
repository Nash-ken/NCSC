"use server";

import { verifySession } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { strapi } from "./api";

export const deleteFile = async (id: number) => {
  try {
    const session = await verifySession(); // Ensure authentication
    const response = await fetch(`${strapi.baseURL}/upload/files/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.userId}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete file");
    }
    revalidatePath('/')
    return { success: true, id };
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
};


export const uploadFileToStrapi = async (file: File): Promise<any> => {
    if (!file) throw new Error("No file selected");
  
    const formData = new FormData();
    formData.append("files", file);
  
    try {
        const session = await verifySession(); 
        const response = await fetch("http://localhost:1337/api/upload", {
        headers: { Authorization: `Bearer ${session.userId}` },
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      console.log("Response:", result);
  
      if (!response.ok) {
        return null;
      }
      revalidatePath("/")
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      return null
    }
  };

  ///////////////////////////////////////////////////////////////////////////

  export const fetchLogs = async () => {
    try {
      const response = await fetch(`${strapi.baseURL}/logs`);
      if(!response.ok) return null;

      const { data } = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  }
  