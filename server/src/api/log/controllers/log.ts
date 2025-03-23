/**
 * log controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::log.log', ({ strapi }) => ({
  // Custom controller function to fetch all logs
  async find(ctx) {
    try {
      const logs = await strapi.db.query('api::log.log').findMany({
        orderBy: { createdAt: 'desc' }, // Optional: order logs by newest first
      });

      ctx.send(logs)
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch logs: ' + error.message };
    }
  },
}));
