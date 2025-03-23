/**
 * navigation controller
 */

import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::navigation.navigation', ({strapi}) => ({
    async find(ctx: Context) {
        const navigation = await strapi.db.query('api::navigation.navigation').findOne({
            populate: ['logo', 'pages', 'buttons'], // Populate related fields
        });

        // Customize the response to only include specific fields
        const pages = navigation.pages.map(page => ({
            title: page.title,
            slug: page.slug,
        }));

        const logo = navigation.logo ? {
            name: navigation.logo.name,
            url: navigation.logo.url,
            alternativeText: navigation.logo.alternativeText,
        } : null; // Check if logo exists

        return {
            pages,
            logo,
            buttons: navigation.buttons, // Return buttons as is
        };
    }
}));
