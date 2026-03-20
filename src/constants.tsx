
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
    slug: 'cinque-perle-colorate-liguria',
    title: 'Le Cinque Terre: Un Viaggio tra Borghi Sospesi tra Cielo e Mare',
    location: 'LIGURIA, ITALY',
    category: Category.ADVENTURE,
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600',
    cardImageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800',
    heroImageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600',
    description: "Cinque perle colorate incastonate nella roccia, dove i vigneti sfidano la gravità e ogni vicolo racconta storie di pescatori e tradizioni millenarie. Scopri la magia della Riviera Ligure più autentica.",
    content: `
      <p>
        Incastonate lungo la costa frastagliata della Liguria, le Cinque Terre rappresentano uno dei paesaggi più iconici e fotografati d'Italia. Questi cinque borghi marinari – Monterosso al Mare, Vernazza, Corniglia, Manarola e Riomaggiore – sono un capolavoro dove l'uomo e la natura convivono in perfetta armonia.
      </p>

      <h2 class="text-[1.8rem] font-bold text-slate-900 mt-16 mb-8 leading-tight">Un Patrimonio UNESCO da Esplorare</h2>

      <p class="text-lg md:text-xl leading-[1.7] text-slate-600 mb-8">Dal 1997, le Cinque Terre sono Patrimonio dell'Umanità UNESCO, riconoscimento che celebra secoli di lavoro umano nel plasmare terrazzamenti a vigneto su pendii impossibili. Passeggiare tra i sentieri che collegano i borghi significa immergersi in panorami mozzafiato dove il blu intenso del Mar Ligure incontra il verde brillante della macchia mediterranea.</p>

      <h2 class="text-[1.8rem] font-bold text-slate-900 mt-16 mb-8 leading-tight">Vernazza: Il Cuore Pulsante</h2>

      <p class="text-lg md:text-xl leading-[1.7] text-slate-600 mb-8">Considerato da molti il borgo più bello, Vernazza incanta con la sua piazzetta affacciata sul porto, le case color pastello e l'antica torre genovese. Il tramonto qui è un'esperienza da non perdere: i raggi dorati illuminano le facciate creando giochi di luce indimenticabili.</p>

      <blockquote class="my-16 bg-blue-50/40 rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden">
        <p class="text-2xl md:text-3xl font-serif italic text-slate-900 leading-snug">"Vernazza non è solo un luogo, è un'emozione che si imprime nel cuore di ogni viaggiatore."</p>
      </blockquote>

      <h2 class="text-[1.8rem] font-bold text-slate-900 mt-16 mb-8 leading-tight">Manarola e i Vigneti Eroici</h2>

      <p class="text-lg md:text-xl leading-[1.7] text-slate-600 mb-8">Manarola è famosa per i suoi <strong>vigneti a strapiombo sul mare</strong>, dove si produce lo Sciacchetrà, prezioso vino dolce ligure. Il panorama dal belvedere è semplicemente spettacolare, soprattutto al crepuscolo quando le luci del borgo si accendono creando un'atmosfera magica.</p>

      <h2 class="text-[1.8rem] font-bold text-slate-900 mt-16 mb-8 leading-tight">Consigli Pratici per la Visita</h2>

      <p class="text-lg md:text-xl leading-[1.7] text-slate-600 mb-8">Il periodo migliore va da <strong>aprile a giugno</strong> e <strong>settembre-ottobre</strong>, evitando la folla estiva. Il treno è il modo più comodo per spostarsi tra i borghi, ma i sentieri escursionistici offrono le viste più spettacolari. Non dimenticate di assaggiare le specialità locali: focaccia ligure croccante, acciughe fresche di Monterosso, e ovviamente il pesto genovese autentico preparato ancora con il mortaio.</p>
    `,
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
    slug: 'hidden-gems-amalfi',
    title: 'Hidden Gems of the Amalfi Coast',
    location: 'CAMPANIA, ITALY',
    category: Category.EUROPE,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
    cardImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
    heroImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1600',
    description: 'Beyond the glittering facades of Positano and the bustling squares of Amalfi lies a different coast. One where lemon groves hang heavy over forgotten stone paths.',
    content: `
      <p>
        While most visitors take the winding bus route up the mountain, those seeking true tranquility opt for the ancient mule tracks. These <strong>scalinatella</strong> weave through terrace after terrace of citrus trees.
      </p>

      <h2 class="text-[1.8rem] font-bold text-slate-900 mt-16 mb-8 leading-tight">The Forgotten Path to Ravello</h2>

      <blockquote class="my-16 bg-blue-50/40 rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden">
        <p class="text-2xl md:text-3xl font-serif italic text-slate-900 leading-snug">The real magic of the coast isn't in the maps, but in the stairs you didn't plan to climb.</p>
      </blockquote>

      <figure class="my-12 flex flex-col items-center w-full mx-auto">
        <div class="w-full max-w-[800px] rounded-[12px] overflow-hidden shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1533604131587-3282c3f3ecbb?auto=format&fit=crop&q=80&w=1200" 
            alt="The vertical gardens of Ravello produce the world's finest lemons." 
            class="w-full h-auto object-cover block"
          />
        </div>
        <figcaption class="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 text-center max-w-[600px]">
          The vertical gardens of Ravello produce the world's finest lemons.
        </figcaption>
      </figure>
    `,
    intel: { 
      bestTime: 'May to September', 
      budget: 'High / Luxury', 
      mustTry: 'Limoncello Spritz',
      vibe: 'Authentic & Vertical'
    },
    published: true
  }
];
