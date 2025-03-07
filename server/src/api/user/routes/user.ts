
  export default {
    routes: [
        {
            method: 'POST',
            path: '/user/reset-password',
            handler: 'user.generateResetPasswordToken',
            config: {
              policies: [],
              middlewares: [],
            },
          },
          {
            method: 'POST',
            path: '/user/change-password',
            handler: 'user.changePassword',
            config: {
              policies: [],
              middlewares: [],
            },
          },
    ],
  };
  