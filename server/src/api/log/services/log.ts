import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::log.log', ({ strapi }) => ({
  // Function to create a new log entry based on the provided attributes
  async createLog(logData: {
    Type: 'Authentication' | 'File'; 
    User: string;
    State: 'Success' | 'Failure';
    Activity: string;
    Source: string;
    Browser: string;
  }) {
    // The core service method to create the log
    try {
      const createdLog = await strapi.db.query('api::log.log').create({
        data: {
          Type: logData.Type,
          User: logData.User,
          State: logData.State,
          Activity: logData.Activity,
          Source: logData.Source,
          Browser: logData.Browser
        },
      });

      return createdLog;
    } catch (error) {
      throw new Error('Error creating log entry: ' + error.message);
    }
  },
}));
