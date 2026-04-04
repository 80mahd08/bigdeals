import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.BIGDEALS.DASHBOARDS.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MENUITEMS.BIGDEALS.DASHBOARDS.ANALYTICS',
    icon: 'ri-dashboard-2-line',
    link: '/admin',
  },
  {
    id: 3,
    label: 'MENUITEMS.BIGDEALS.DASHBOARDS.SALES',
    icon: 'ri-bar-chart-line',
    link: '/admin',
  },
  {
    id: 4,
    label: 'MENUITEMS.BIGDEALS.MARKETPLACE.TEXT',
    isTitle: true
  },
  {
    id: 5,
    label: 'MENUITEMS.BIGDEALS.MARKETPLACE.ADS.TEXT',
    icon: 'ri-stack-line',
    isCollapsed: true,
    subItems: [
      {
        id: 51,
        label: 'MENUITEMS.BIGDEALS.MARKETPLACE.ADS.ALL',
        link: '/ads',
        parentId: 5
      },
      {
        id: 52,
        label: 'MENUITEMS.BIGDEALS.MARKETPLACE.ADS.PENDING',
        link: '/ads',
        parentId: 5,
        badge: { variant: 'badge-soft-danger', text: '5' }
      },
      {
        id: 53,
        label: 'MENUITEMS.BIGDEALS.MARKETPLACE.ADS.CATEGORIES',
        link: '/admin',
        parentId: 5
      },
      {
        id: 54,
        label: 'MENUITEMS.BIGDEALS.MARKETPLACE.ADS.FEATURED',
        link: '/ads',
        parentId: 5
      }
    ]
  },
  {
    id: 6,
    label: 'MENUITEMS.BIGDEALS.MARKETPLACE.SELLERS.TEXT',
    icon: 'ri-store-2-line',
    isCollapsed: true,
    subItems: [
      {
        id: 61,
        label: 'MENUITEMS.BIGDEALS.MARKETPLACE.SELLERS.TEXT',
        link: '/admin',
        parentId: 6
      },
      {
        id: 62,
        label: 'MENUITEMS.BIGDEALS.MARKETPLACE.SELLERS.VERIFICATION',
        link: '/admin',
        parentId: 6,
        badge: { variant: 'badge-soft-warning', text: 'New' }
      },
      {
        id: 63,
        label: 'MENUITEMS.BIGDEALS.MARKETPLACE.SELLERS.SUBSCRIPTIONS',
        link: '/admin',
        parentId: 6
      }
    ]
  },
  {
    id: 7,
    label: 'MENUITEMS.BIGDEALS.MARKETPLACE.CLIENTS',
    icon: 'ri-user-settings-line',
    link: '/admin',
  },
  {
    id: 8,
    label: 'MENUITEMS.BIGDEALS.SUPPORT.TEXT',
    isTitle: true
  },
  {
    id: 9,
    label: 'MENUITEMS.BIGDEALS.SUPPORT.TICKETS',
    icon: 'ri-customer-service-2-line',
    link: '/admin',
    badge: { variant: 'bg-primary', text: '3' }
  },
  {
    id: 10,
    label: 'MENUITEMS.BIGDEALS.SUPPORT.REVIEWS',
    icon: 'ri-chat-voice-line',
    link: '/admin',
  },
  {
    id: 11,
    label: 'MENUITEMS.BIGDEALS.FINANCE.TEXT',
    isTitle: true
  },
  {
    id: 12,
    label: 'MENUITEMS.BIGDEALS.FINANCE.INVOICES',
    icon: 'ri-file-list-3-line',
    link: '/admin',
  },
  {
    id: 13,
    label: 'MENUITEMS.BIGDEALS.FINANCE.TRANSACTIONS',
    icon: 'ri-money-dollar-circle-line',
    link: '/admin',
  },
  {
    id: 14,
    label: 'MENUITEMS.BIGDEALS.SYSTEM.TEXT',
    isTitle: true
  },
  {
    id: 15,
    label: 'MENUITEMS.BIGDEALS.SYSTEM.CONFIG',
    icon: 'ri-settings-4-line',
    link: '/admin',
  },
  {
    id: 16,
    label: 'MENUITEMS.BIGDEALS.SYSTEM.I18N',
    icon: 'ri-global-line',
    link: '/admin',
  },
  {
    id: 17,
    label: 'MENUITEMS.BIGDEALS.SYSTEM.ROLES',
    icon: 'ri-shield-user-line',
    link: '/admin',
  }
];
