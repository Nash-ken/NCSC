/**
 * page router
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/pages/all',
            handler: 'page.find',
            config: {
              auth: false,
            }
        },
        {
          method: 'GET',
          path: '/pages/:slug',
          handler: 'page.findOne',
          config: {
            auth: false,
          },
        },
       
    ],
}
