import { strapi } from "@strapi/client";

export const client = strapi({
    baseURL: 'http://localhost:1337/api',
    auth: `${process.env.CLIENT_TOKEN}`
})