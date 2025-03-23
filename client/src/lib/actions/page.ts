"use server"

import { FooterResponse, NavigationResponse, Page } from "../types";

// A utility function for handling fetch requests, can be reused for multiple API calls
const fetchFromAPI = async <T>(url: string): Promise<T | null> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        return (await response.json()) as T;
    } catch (error) {
        return null;
    }
};

// Fetch navigation data
export const fetchNavigation = async (): Promise<NavigationResponse> => {
    const navigation = await fetchFromAPI<NavigationResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/navigation`);
    
    // Return default if navigation data doesn't exist
    return navigation || {
        pages: [],
        logo: { url: "/next.svg", name: 'Default Logo', alternativeText: 'Logo Image' },
        buttons: [],
    };
};

export const fetchFooter = async (): Promise<FooterResponse> => {
    const response = await fetchFromAPI<{footer: FooterResponse}>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/footer`);

    

    return response?.footer ?? {
        description: '',
        pages: [],
        socials: [],
        // fill with other default fields if needed
      };
}

// Fetch all pages
export const fetchPages = async (): Promise<Page[] | null> => {
    return await fetchFromAPI<Page[]>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages/all`);
};

// Fetch a single page based on slug
export const fetchPage = async (slug: string): Promise<Page | null> => {
    const page = await fetchFromAPI<Page>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages/${slug}`);
    if (!page) return null;
    return page as Page;
};
