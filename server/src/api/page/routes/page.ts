/**
 * page router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::page.page');


module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/pages/:slug',
        handler: 'page.findBySlug',
        config: {
          auth: false, // You can set this to `true` if you want authentication
        },
      },
    ],
  };