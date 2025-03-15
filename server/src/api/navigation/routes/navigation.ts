import { factories } from '@strapi/strapi';

export default  {
  routes: [
    {
      // Custom route for fetching navigation data
      method: 'GET',
      path: '/navigation', // Custom URL path
      handler: 'navigation.findNavigation', // The controller action
      config: {
        auth: false, // Whether authentication is required
      },
    },
  ],
};
