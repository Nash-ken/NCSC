export default {
    routes: [
      {
        method: "GET",
        path: "/pages/fetch-all",
        handler: "page.fetchAll",
        config: {
          auth: false, // Change to true if authentication is required
        },
      },
      {
        method: "GET",
        path: "/pages/:slug",
        handler: "page.findBySlug",
        config: {
          auth: false,
        },
      },
    ],
  };
  