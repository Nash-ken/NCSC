// path: ./src/api/media/routes/media.ts

export default {
    routes: [
      {
        method: 'GET',
        path: '/media/files/folder',
        handler: 'media.findByFolder', // This calls the `findByFolder` method
        config: {
          auth: {},
          policies: [] // Set to `true` if authentication is required
        },
      },
      {
        method: 'DELETE',
        path: '/media/delete/:folder/:fileId',
        handler: 'media.deleteByFile',
        config: {
          auth: {},
          policies: []
        }
      },
      {
        method: 'POST',
        path: '/media/upload',
        handler: 'media.uploadFile',
        config: {
          auth: {},
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  