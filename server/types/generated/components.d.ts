import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksFeatured extends Struct.ComponentSchema {
  collectionName: 'components_blocks_featureds';
  info: {
    description: '';
    displayName: 'Featured';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    subheading: Schema.Attribute.String;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    description: '';
    displayName: 'Hero';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'elements.button', true>;
    description: Schema.Attribute.Text;
    header: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface BlocksList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_lists';
  info: {
    displayName: 'List';
  };
  attributes: {
    cards: Schema.Attribute.Component<'elements.card', true>;
  };
}

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
    size: Schema.Attribute.Enumeration<['default', 'sm', 'lg', 'icon']>;
    variant: Schema.Attribute.Enumeration<
      ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    >;
  };
}

export interface ElementsCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.featured': BlocksFeatured;
      'blocks.hero': BlocksHero;
      'blocks.list': BlocksList;
      'elements.button': ElementsButton;
      'elements.card': ElementsCard;
    }
  }
}
