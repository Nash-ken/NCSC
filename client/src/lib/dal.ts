import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";
import { strapi } from "./api";
import { notFound } from "next/navigation";

export const verifySession = cache(async () => {
  try {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return { isAuth: false, userId: "" };

    const session = await decrypt(cookie);
    return session?.userId
      ? { isAuth: true, userId: session.userId }
      : { isAuth: false, userId: "" };
  } catch (error) {
    console.error("Error verifying session:", error);
    return { isAuth: false, userId: "" };
  }
});

export const getUser = cache(async () => {
  try {
    const session = await verifySession();
    if (!session.isAuth) return null;

    const response = await fetch(`${strapi.baseURL}/users/me?populate[role][fields]=name&populate[role][fields]=type`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${session.userId}` },
    });

    if (!response.ok) return null;
   
    return (await response.json()) as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
});

export type User = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: "local";
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  role: { documentId: string; id: number; name: string; type: string }
};

/////////////////////////////////////////////////////////////////////////

export type Page = {
  title: string;
  slug: string;
  blocks: []
};

export type Block<T> = {
  __component: string;
  id: number;
} & T;

export type HeroType = {
  header: string;
  description: string;
  image: unknown;
  buttons: Button[];
}

export type FeaturedType = {
  heading: string;
  description: string;
  subheading: string;
}

export type ListType = {
  cards: { title: string; description: string }[];
}

/////////////////////////////////////////////////////////////////////////

type Button = {
  id: number;
  label: string;
  href: string;
  isExternal: boolean;
  variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
  size: "default" | "sm" | "lg" | "icon" | null | undefined;
}

type Navigation = {
  id: number;
  documentId: string;
  createdAt: string; // or Date if you parse it into a Date object
  updatedAt: string; // or Date if you parse it into a Date object
  publishedAt: string | null;
  locale: string | null;
  logo: MediaImage;
  pages: Page[];
  buttons: Button[];
};

type MediaImage = {
  name: string;
  alternativeText: string;
  width: number;
  height: number;
  url: string;
};

export const fetchNavigation = async (): Promise<Navigation> => {
  try {
    const response = await fetch(`${strapi.baseURL}/navigation`);
    if (!response.ok) throw new Error(response.statusText);
    
    // Parse the response and return it as a Navigation object
    const data: Navigation = await response.json();

    // Ensure the structure is consistent (fallback for missing fields)
    return data ?? {
      id: 0,
      documentId: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: null,
      locale: null,
      logo: null,
      pages: [],
      buttons: [],
    };
  } catch (error) {
    console.error("Error fetching navigation:", error);
    
    // Return a default empty Navigation object with pages as an empty array
    return {
      id: 0,
      documentId: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: null,
      locale: null,
      logo: {
        name: "",
        alternativeText: "",
        width: 0,
        height: 0,
        url: ""
      },
      pages: [],
      buttons: [],
    };
  }
};


export const fetchPage = async (slug: string): Promise<Page | never> => {
  try {
    const response = await fetch(`${strapi.baseURL}/pages/${slug}`);
    if (!response.ok) notFound();
    return (await response.json()) as Page;
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
};

//////////////////////////////////////////////////////////////

export const fetchFiles = async () => {
  try {
    const session = await verifySession();
    const response = await fetch(`${strapi.baseURL}/upload/files`, {
      headers: { Authorization: `Bearer ${session.userId}` },
    });

    if (!response.ok) return [];

    const files = await response.json();
    
    // Map API response to FileData structure
    return files.map((file: any) => ({
      id: file.id.toString(),
      name: file.name,
      size: file.size * 1024, // Convert KB to bytes
      ext: file.ext.replace(".", ""), // Remove the dot from extension
      createdAt: file.createdAt, // Use createdAt as upload date
      url: process.env.NEXT_PUBLIC_API_URL + file.url
    }));
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
};


export type MediaFile = {
  id: number;
  createdAt: string;
  publishedAt: string;
  ext: string;
  name: string;
  size: number;
  url: string;
};


export type LogEntry = {
  type: string;
  result: string;
  identifier: string;
  date: Date;
  ipv4: string;
  reason: string | null;
  agent: string | null;
  role: string;
}