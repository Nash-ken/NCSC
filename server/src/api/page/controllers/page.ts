import { factories } from "@strapi/strapi";
import { Context } from "koa";

export default factories.createCoreController("api::page.page", ({ strapi }) => ({
  async findBySlug(ctx: Context) {
    const { slug } = ctx.params;

    const page = await strapi.db.query("api::page.page").findOne({
      where: { slug },
    });

    if (!page) {
      return ctx.throw(404, "Page not found");
    }

    return page;
  },

  async fetchAll(ctx: Context) {
    // Query all pages, selecting only 'title' and 'slug'
    const pages = await strapi.db.query("api::page.page").findMany({
      select: ["title", "slug"], // Select only title and slug
    });

    // Remove duplicates based on the 'slug'
    const uniquePages = pages.filter((value, index, self) => 
      index === self.findIndex((t) => (
        t.slug === value.slug
      ))
    );

    return uniquePages;
  },
}));
