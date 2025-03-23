export default {
  routes: [
    {
      method: "POST",
      path: "/auth/login",
      handler: "auth.login",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/refresh',
      handler: 'auth.refresh',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/me',
      handler: 'auth.me', // Points to the `me` method in the `user.ts` controller
      
    },
    {
      method: 'POST',
      path: '/auth/reset-password',
      handler: 'auth.requestPasswordReset', // This will point to the `requestPasswordReset` method in the `auth` controller
      config: {
        auth: false, // No authentication required for this route
        policies: [],
        middlewares: [],
      },
    },
    {
      "method": "POST",
      "path": "/auth/change-password",
      "handler": "auth.changePassword",
      "config": {
        auth: false
      }
    }
  ],
};
