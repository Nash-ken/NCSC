/**
 * navigation router
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/navigation',
            handler: 'navigation.find',
            config: {
                auth: false
            }
        }
    ],
}