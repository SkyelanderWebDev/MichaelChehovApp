import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsShell from '../views/TabsShell.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/chart',
  },
  {
    // Compatibility with earlier builds and the installed PWA start URL.
    path: '/home',
    redirect: '/chart',
  },
  {
    path: '/',
    component: TabsShell,
    children: [
      {
        path: 'library',
        name: 'Library',
        component: () => import('../views/LibraryPage.vue'),
      },
      {
        path: 'journal',
        name: 'Journal',
        component: () => import('../views/JournalPage.vue'),
      },
      {
        path: 'chart',
        name: 'Chart',
        component: () => import('../views/ChartPage.vue'),
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('../views/MapPage.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/SettingsPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
