export default {
    routes: [
      {
        method: "POST",
        path: "/account/login",
        handler: "account.login",
        config: {
          auth: false,
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/account/reset-password',
        handler: 'account.generateResetPasswordToken',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/account/change-password',
        handler: 'account.changePassword',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  