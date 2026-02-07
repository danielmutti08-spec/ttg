
import { Article, NavItem, Category, SiteConfig } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Destinations', href: '#', view: 'destinations' },
  { label: 'The Vault', href: '#', view: 'home' },
  { label: 'About', href: '#', view: 'home' },
];

export const CATEGORIES: string[] = Object.values(Category);

export const INITIAL_SITE_CONFIG: SiteConfig = {
  heroImageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=90&w=2400',
  heroTitle: 'Explore the',
  heroSubtitle: 'Raw perspectives and untold stories from the furthest corners of the globe.',
  heroHighlight: 'Unseen.'
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'cinque-terre-cloud',
    title: 'Le Cinque Terre: Un Viaggio tra Borghi Sospesi tra Cielo e Mare',
    location: 'LIGURIA, ITALY',
    category: Category.ADVENTURE,
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600',
    cardImageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800',
    heroImageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600',
    description: "Cinque perle colorate incastonate nella roccia, dove i vigneti sfidano la gravità e ogni vicolo racconta storie di pescatori e tradizioni millenarie. Scopri la magia della Riviera Ligure più autentica.",
    content: `Incastonate lungo la costa frastagliata della Liguria, le Cinque Terre rappresentano uno dei paesaggi più iconici e fotografati d'Italia. Questi cinque borghi marinari – Monterosso al Mare, Vernazza, Corniglia, Manarola e Riomaggiore – sono un capolavoro dove l'uomo e la natura convivono in perfetta armonia.

## Un Patrimonio UNESCO da Esplorare

Dal 1997, le Cinque Terre sono Patrimonio dell'Umanità UNESCO, riconoscimento che celebra secoli di lavoro umano nel plasmare terrazzamenti a vigneto su pendii impossibili. Passeggiare tra i sentieri che collegano i borghi significa immergersi in panorami mozzafiato dove il blu intenso del Mar Ligure incontra il verde brillante della macchia mediterranea.

## Vernazza: Il Cuore Pulsante

Considerato da molti il borgo più bello, Vernazza incanta con la sua piazzetta affacciata sul porto, le case color pastello e l'antica torre genovese. Il tramonto qui è un'esperienza da non perdere: i raggi dorati illuminano le facciate creando giochi di luce indimenticabili.

> "Vernazza non è solo un luogo, è un'emozione che si imprime nel cuore di ogni viaggiatore."

## Manarola e i Vigneti Eroici

Manarola è famosa per i suoi **vigneti a strapiombo sul mare**, dove si produce lo Sciacchetrà, prezioso vino dolce ligure. Il panorama dal belvedere è semplicemente spettacolare, soprattutto al crepuscolo quando le luci del borgo si accendono creando un'atmosfera magica.

## Consigli Pratici per la Visita

Il periodo migliore va da **aprile a giugno** e **settembre-ottobre**, evitando la folla estiva. Il treno è il modo più comodo per spostarsi tra i borghi, ma i sentieri escursionistici offrono le viste più spettacolari. Non dimenticate di assaggiare le specialità locali: focaccia ligure croccante, acciughe fresche di Monterosso, e ovviamente il pesto genovese autentico preparato ancora con il mortaio.`,
    intel: { 
      bestTime: "Aprile-Giugno, Settembre-Ottobre",
      budget: "Moderato",
      mustTry: "Sciacchetrà, Focaccia, Pesto al mortaio",
      vibe: "Romantico & Pittoresco"
    },
    published: true
  },
  {
    id: 'amalfi-cloud',
    title: 'Hidden Gems of the Amalfi Coast',
    location: 'CAMPANIA, ITALY',
    category: Category.EUROPE,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
    cardImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
    heroImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1600',
    description: 'Beyond the glittering facades of Positano and the bustling squares of Amalfi lies a different coast. One where lemon groves hang heavy over forgotten stone paths.',
    content: `## The Forgotten Path to Ravello

While most visitors take the winding bus route up the mountain, those seeking true tranquility opt for the ancient mule tracks. These **scalinatella** weave through terrace after terrace of citrus trees.

> The real magic of the coast isn't in the maps, but in the stairs you didn't plan to climb.

![The vertical gardens of Ravello produce the world's finest lemons.](https://images.unsplash.com/photo-1533604131587-3282c3f3ecbb?auto=format&fit=crop&q=80&w=1200)`,
    intel: { 
      bestTime: 'May to September', 
      budget: 'High / Luxury', 
      mustTry: 'Limoncello Spritz',
      vibe: 'Authentic & Vertical'
    },
    published: true
  }
];
