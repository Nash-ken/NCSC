/**
 * footer router
 */


export default {
    routes: [
        {
            method: 'GET',
            path: '/footer',
            handler: 'footer.find',
            config: {
                auth: false
            }
        }
    ],
}