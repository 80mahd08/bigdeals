import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  // ── TABLEAU DE BORD ──
  {
    id: 1,
    label: 'Tableau de bord',
    icon: 'ri-dashboard-2-line',
    link: '/admin/dashboard',
  },

  // ── GÉRER PAIEMENTS ET TRANSACTIONS ──
  {
    id: 2,
    label: 'Gérer paiements et transactions',
    icon: 'ri-money-dollar-circle-line',
    link: '/admin/transactions',
  },

  // ── EXAMINER DEMANDE D'ANNONCEUR ──
  {
    id: 3,
    label: "Examiner demande d'annonceur",
    icon: 'ri-store-2-line',
    link: '/admin/announcers',
  },

  // ── GÉRER ANNONCES ──
  {
    id: 4,
    label: 'Gérer annonces',
    icon: 'ri-stack-line',
    link: '/admin/ads',
  },

  // ── GESTION DES CLIENTS (Valider / Bloquer) ──
  {
    id: 5,
    label: 'Gestion des clients',
    icon: 'ri-group-line',
    link: '/admin/users',
  },

  // ── GÉRER CATÉGORIES ──
  {
    id: 6,
    label: 'Gérer catégories',
    icon: 'ri-list-check',
    link: '/admin/categories',
  },

  // ── PARAMÈTRES (Optional but good for completeness) ──
  {
    id: 10,
    label: 'MENUITEMS.BIGDEALS.SYSTEM.TEXT',
    isTitle: true
  },
  {
    id: 11,
    label: 'Configuration',
    icon: 'ri-settings-4-line',
    link: '/admin/dashboard',
  },
];

export const SELLER_MENU: MenuItem[] = [
  // ── My Store ──
  {
    id: 200,
    label: 'MON ESPACE VENDEUR',
    isTitle: true
  },
  {
    id: 201,
    label: 'Tableau de bord',
    icon: 'ri-dashboard-2-line',
    link: '/announcer/dashboard',
  },
  {
    id: 202,
    label: 'Mes Annonces',
    icon: 'ri-stack-line',
    link: '/announcer/dashboard',
  },
  {
    id: 203,
    label: 'Créer une Annonce',
    icon: 'ri-add-circle-line',
    link: '/announcer/ads/new',
  },
  // ── Shopping ──
  {
    id: 210,
    label: 'MON ESPACE CLIENT',
    isTitle: true
  },
  {
    id: 211,
    label: 'Mon Profil',
    icon: 'ri-user-settings-line',
    link: '/client/profile',
  },
  {
    id: 212,
    label: 'Mon Panier',
    icon: 'ri-shopping-cart-2-line',
    link: '/client/cart',
  },
  {
    id: 213,
    label: 'Mes Favoris',
    icon: 'ri-heart-line',
    link: '/client/favorites',
  },
  {
    id: 214,
    label: 'Mes Commandes',
    icon: 'ri-file-list-3-line',
    link: '/client/orders',
  }
];
