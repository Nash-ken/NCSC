export type NavigationResponse = {
    pages: Page[],
    logo: Image,
    buttons: Button[]
}

export type FooterResponse = {

    description: string;
    pages: Page[];
    socials: Button[]
}

export type Image = {
    name: string;
    url: string;
    alternativeText: string;
}

export type Button = {
    label: string;
    href: string;
    isExternal: boolean;
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
}

export type Page = {
    title: string;
    slug: string;
    blocks:[]; // Will improve this below
  };
  

/////////////////////////////////////////////////////////////

export type User = {
    id: number;
    username: string;
    email: string;
    role: string;
    permissions: string[]; // Array of permissions (e.g., "api::media.media.findByFolder")
  } | null;
  

export type Log = {
    id: string
    type: string
    user: string
    source: string
    state: string
    activity: string
    browser: string
    createdAt: string
  }