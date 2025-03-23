/**
 * log router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'GET',
      path: '/logs/all', // Your custom endpoint
      handler: 'log.find', // Calls getAllLogs from your controller
      config: {
        auth: {},
        policies: [] // Change to true if protected
      },
    },
  ],
};
