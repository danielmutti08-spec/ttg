
export type BlockType = 'paragraph' | 'heading' | 'image' | 'quote';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // Text for paragraphs/headings/quotes, URL/Base64 for images
  caption?: string; // Optional caption for images
  source?: string; // Optional source for quotes
}

export interface Article {
  id: string;
  slug: string; // URL identifier
  title: string;
  location: string;
  category: string;
  imageUrl: string; // Fallback / Legacy
  cardImageUrl?: string; // Versione per le anteprime (3:4 o 1:1)
  heroImageUrl?: string; // Versione per l'header (16:9)
  quote?: string; // Legacy top quote
  description?: string;
  content?: string; // Legacy support
  blocks?: ContentBlock[]; // New block-based system
  intel?: {
    bestTime: string;
    budget: string;
    mustTry: string;
    vibe?: string;
  };
  // Metadati per sincronizzazione Cloud
  published?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface SiteConfig {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroHighlight: string;
}

export interface NavItem {
  label: string;
  href: string;
  view: 'home' | 'destinations' | 'guides' | 'about' | 'contact' | 'admin';
}

export enum Category {
  ALL = 'All Posts',
  ADVENTURE = 'Adventure',
  LUXURY = 'Luxury',
  BUDGET = 'Budget',
  CULTURE = 'Culture',
  OCEANIA = 'Oceania',
  NORDIC = 'Nordic States',
  ASIA = 'Asia',
  EUROPE = 'Europe'
}
