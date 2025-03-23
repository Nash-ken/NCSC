import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::page.page', ({strapi}) => ({
    async findOne(ctx: Context) {
        const { slug } = ctx.params;

        const page = await strapi.db.query("api::page.page").findOne({
            where: { slug },
            populate: {
                'blocks': {
                    populate: true
                }
            }
        })

        if(!page) return ctx.throw(404, `Page not found: ${slug}`)

        return page;
    },
    async find(ctx: Context) {
        const pages = strapi.db.query('api::page.page').findMany({
            select: ['title', 'slug']
        })

        return pages;
    }
}))