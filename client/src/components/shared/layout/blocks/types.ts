// src/types/index.ts

import { Button, Image } from "@/lib/types";

  // Block types based on the above specific types
  export type RichAreaBlock = Block<RichArea> & { __component: 'layout.rich-area' };
  export type TitleBlock = Block<Title> & { __component: 'layout.title' };
  export type NewsBlock = Block<News> & {__component: 'layout.news' };
  export type HeroBlock = Block<Hero> & { __component: 'layout.hero' };
  export type BlogBlock = Block<Blog> & { __component: 'layout.blog'};
  // Union type for all known blocks
  export type KnownBlock = RichAreaBlock | TitleBlock | NewsBlock | HeroBlock;


// Base Block type with generic content

export type Block<T> = {
    __component: string;
    id: number;
  } & T;
  
  // Specific block types
  export type RichArea = {
    Content: any[]; // Replace with actual content type (e.g., string[], object[])
  };
  
  export type Title = {
    heading: string;
    subheading: string;
    background: string;
  };

  export type Blog = {
    blogs: BlogItem[];
  }

  export type BlogItem = {
    cover: Image;
    title: string;
    description: string;
    date: string;
  }



  export type News = {
    news: NewsItem[]
  }


  export type NewsItem = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    date: string;  // You can format this as a Date object or keep it as a string based on your requirements
    createdAt: string;  // ISO string format for creation date
    updatedAt: string;  // ISO string format for last updated date
    publishedAt: string | null;  // Published date (null if not yet published)
    locale: string | null;  // Optional locale, might not be needed if you're not supporting multiple languages
  };

  export type Hero = {
    heading: string;
    subheading: string;
    description: string; 
    buttons: Button[] | []; // Buttons, if any (each has a label and URL)
    cover: Image | null;  // Optional cover image URL
  };

  