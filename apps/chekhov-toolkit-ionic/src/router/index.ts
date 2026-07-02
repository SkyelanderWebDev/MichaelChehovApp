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
        // Connect tab. Path stays /map so existing links and the PWA history
        // keep resolving; only the tab label changed to "Connect".
        path: 'map',
        name: 'Map',
        component: () => import('../views/MapPage.vue'),
      },
      {
        path: 'connect/chat',
        name: 'ChatRooms',
        component: () => import('../views/ChatRoomsPage.vue'),
      },
      {
        path: 'connect/chat/:roomId',
        name: 'ChatRoom',
        component: () => import('../views/ChatRoomPage.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/SettingsPage.vue'),
      },
      {
        path: ':pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFoundPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
