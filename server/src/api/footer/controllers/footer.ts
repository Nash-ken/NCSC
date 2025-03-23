/**
 * footer controller
 */

import { factories } from '@strapi/strapi'
import { Context } from 'koa';

export default factories.createCoreController('api::footer.footer', ({strapi}) => ({
    async find(ctx: Context) {
        const footer = await strapi.db.query('api::footer.footer').findOne({
            populate: ['pages', 'socials'], // Populate related fields
        });

        // Customize the response to only include specific fields
        const pages = footer.pages.map(page => ({
            title: page.title,
            slug: page.slug,
        }));

        return {
            footer
        };
    }
}));