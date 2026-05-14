import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Tableau de bord',
    icon: 'ri-dashboard-2-line',
    link: '/admin/dashboard',
  },
  {
    id: 5,
    label: 'Gestion des utilisateurs',
    icon: 'ri-group-line',
    link: '/admin/users',
  },
  {
    id: 3,
    label: "Demandes d'annonceurs",
    icon: 'ri-store-2-line',
    link: '/admin/announcers',
  },
  {
    id: 6,
    label: 'Gestion des annonces',
    icon: 'ri-stack-line',
    link: '/admin/ads',
  },
  {
    id: 7,
    label: 'Paiements annonceurs',
    icon: 'ri-money-dollar-circle-line',
    link: '/admin/annonceur-payments',
  },
  {
    id: 8,
    label: 'Signalements',
    icon: 'ri-flag-line',
    link: '/admin/reports',
  },
  {
    id: 9,
    label: 'Commandes',
    icon: 'ri-shopping-cart-2-line',
    link: '/admin/orders',
  },
  {
    id: 11,
    label: 'Configuration',
    icon: 'ri-settings-4-line',
    link: '/admin/settings',
  },
];

export const SELLER_MENU: MenuItem[] = [
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
    link: '/announcer/announcements',
  },
  {
    id: 203,
    label: 'Créer une Annonce',
    icon: 'ri-add-circle-line',
    link: '/announcer/announcements/create',
  },
  {
    id: 204,
    label: 'Avis Clients',
    icon: 'ri-star-line',
    link: '/announcer/reviews',
  },
  {
    id: 205,
    label: 'Mes Ventes',
    icon: 'ri-shopping-bag-3-line',
    link: '/announcer/orders',
  },
  {
    id: 210,
    label: 'NAVIGATION',
    isTitle: true
  },
  {
    id: 211,
    label: 'Retour à la marketplace',
    icon: 'ri-arrow-go-back-line',
    link: '/',
  }
];
