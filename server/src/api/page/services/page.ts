/**
 * page service
 */

import { factories } from '@strapi/strapi';


export default factories.createCoreService('api::page.page', ({ strapi }) => ({
    async findPages() {
      const pages = await strapi.db.query('api::page.page').findMany({
        select: ['title', 'slug'],
      });
  
      // Remove duplicates based on the 'slug'
      const uniquePages = pages.filter((value, index, self) =>
        index === self.findIndex((t) => t.slug === value.slug)
      );
  
      return uniquePages;
    },
  }));

