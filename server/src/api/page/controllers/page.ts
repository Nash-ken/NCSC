import { factories } from "@strapi/strapi";
import { Context } from "koa";

const blocks = {
  "blocks.hero": {
    populate: {
    buttons: true,
    image: true
    }
  },
  "blocks.featured": {
            
  },
  "blocks.list": {
    populate: {
      cards: true
    }
  }
}

export default factories.createCoreController("api::page.page", ({ strapi }) => ({
  async findBySlug(ctx: Context) {
    const { slug } = ctx.params;

    const populateConfig = {
      blocks: {
        on: blocks,
      }
    }

    const page = await strapi.db.query("api::page.page").findOne({
      where: { slug },
      populate: populateConfig
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
