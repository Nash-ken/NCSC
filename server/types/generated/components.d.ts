import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsButton extends Struct.ComponentSchema {
  collectionName: 'components_elements_buttons';
  info: {
    description: '';
    displayName: 'Button';
  };
  attributes: {
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean;
    label: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['default', 'destructive', 'ghost', 'link', 'outline', 'secondary']
    > &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface LayoutBlog extends Struct.ComponentSchema {
  collectionName: 'components_layout_blogs';
  info: {
    displayName: 'Blog';
  };
  attributes: {
    blogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'elements.button', true>;
    cover: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    subheading: Schema.Attribute.String;
  };
}

export interface LayoutNews extends Struct.ComponentSchema {
  collectionName: 'components_layout_news';
  info: {
    displayName: 'News';
  };
  attributes: {
    news: Schema.Attribute.Relation<'oneToMany', 'api::news.news'>;
  };
}

export interface LayoutRichArea extends Struct.ComponentSchema {
  collectionName: 'components_layout_rich_areas';
  info: {
    description: '';
    displayName: 'Rich Area';
  };
  attributes: {
    Content: Schema.Attribute.Blocks;
  };
}

export interface LayoutTitle extends Struct.ComponentSchema {
  collectionName: 'components_layout_titles';
  info: {
    description: '';
    displayName: 'Title';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['background', 'secondary', 'accent', 'primary', 'muted']
    > &
      Schema.Attribute.DefaultTo<'background'>;
    heading: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.button': ElementsButton;
      'layout.blog': LayoutBlog;
      'layout.hero': LayoutHero;
      'layout.news': LayoutNews;
      'layout.rich-area': LayoutRichArea;
      'layout.title': LayoutTitle;
    }
  }
}
