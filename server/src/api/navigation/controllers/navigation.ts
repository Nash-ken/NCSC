/**
 * navigation controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::navigation.navigation', ({ strapi }) => ({
    async findNavigation(ctx) {
      try {
        const navigationData = await strapi.service('api::navigation.navigation').fetchNavigation();
        return ctx.send(navigationData);
      } catch (error) {
        ctx.throw(500, 'Error fetching navigation data');
      }
    },
  }));
