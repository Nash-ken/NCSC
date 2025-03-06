export default {
    routes: [
      {
        method: "POST",
        path: "/custom/login",
        handler: "custom-auth.login",
        config: {
          auth: false,
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  