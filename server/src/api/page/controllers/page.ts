/**
 * page controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::page.page');


module.exports = {
    async findBySlug(ctx) {
      // Get the slug from the request parameters
      const { slug } = ctx.params;
  
      // Query the database to find the page by slug
      const page = await strapi.db.query('api::page.page').findOne({
        where: { slug }, // Look for the page with the given slug
      });
  
      // If the page is not found, return a 404 error
      if (!page) {
        return ctx.throw(404, 'Page not found');
      }
  
      // Return the page data
      return page;
    }
  };