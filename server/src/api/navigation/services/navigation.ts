/**
 * navigation service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::navigation.navigation', ({ strapi }) => ({
    async fetchNavigation() {
      return await strapi.db.query('api::navigation.navigation').findOne({
        populate: {
          logo: {
            select: ['name', 'alternativeText', 'width', 'height', 'url']
          }, // Populate media field
          buttons: true, // Populate repeatable component
          pages: { // Populate related pages and select required fields
            select: ['title', 'slug'],
          },
        },
      });
    },
  }));