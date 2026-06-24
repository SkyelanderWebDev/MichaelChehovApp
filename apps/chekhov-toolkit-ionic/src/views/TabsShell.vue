<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom" class="studio-tab-bar">
        <ion-tab-button tab="library" href="/library" class="studio-tab" @click="go('/library')">
          <ion-icon aria-hidden="true" :icon="bookOutline" />
          <ion-label>Library</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="journal" href="/journal" class="studio-tab" @click="go('/journal')">
          <ion-icon aria-hidden="true" :icon="journalOutline" />
          <ion-label>Journal</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="chart" href="/chart" class="studio-tab chart-tab" @click="go('/chart')">
          <span class="chart-orb" aria-hidden="true">
            <ion-icon :icon="sunnyOutline" />
          </span>
          <ion-label>Chart</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="map" href="/map" class="studio-tab" @click="go('/map')">
          <ion-icon aria-hidden="true" :icon="mapOutline" />
          <ion-label>Map</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="history" href="/history" class="studio-tab" @click="go('/history')">
          <ion-icon aria-hidden="true" :icon="timeOutline" />
          <ion-label>History</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings" class="studio-tab" @click="go('/settings')">
          <ion-icon aria-hidden="true" :icon="settingsOutline" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { bookOutline, journalOutline, mapOutline, settingsOutline, sunnyOutline, timeOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

function go(path: string): void {
  if (router.currentRoute.value.path === path) return;
  void router.push(path);
}
</script>

<style scoped>
:deep(ion-tabs),
:deep(ion-tab-bar),
:deep(ion-tab-button) {
  overflow: visible;
}

:deep(ion-tab-button)::part(native) {
  contain: none;
  overflow: visible;
}

.studio-tab-bar {
  border-top: 1px solid var(--border-subtle);
  height: calc(80px + env(safe-area-inset-bottom));
  padding-top: 18px;
  padding-bottom: env(safe-area-inset-bottom);
  /* Let the raised center Chart orb overflow above the bar. */
  contain: none;
  overflow: visible;
  position: relative;
  z-index: 50;
}

.studio-tab {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  min-height: 44px;
  overflow: visible;
  position: relative;
  z-index: 1;
}

.studio-tab ion-icon {
  font-size: 1.45rem;
}

.studio-tab ion-label {
  margin-top: 3px;
}

/* Center signature tab: raised brass-ringed sigil. */
.chart-tab {
  overflow: visible;
  z-index: 3;
}

.chart-orb {
  align-items: center;
  background: var(--surface-paper);
  border: 2px solid var(--accent-primary);
  border-radius: 999px;
  box-shadow: var(--shadow-orb);
  color: var(--text-on-paper);
  display: flex;
  height: 46px;
  justify-content: center;
  margin-top: -18px;
  position: relative;
  transition: box-shadow 180ms ease, transform 180ms ease;
  width: 46px;
  z-index: 4;
}

.chart-orb ion-icon {
  font-size: 1.5rem;
}

.chart-tab.tab-selected .chart-orb {
  box-shadow: 0 0 0 5px var(--accent-soft), var(--shadow-orb);
  color: var(--accent-primary);
  transform: translateY(-2px);
}

.chart-tab ion-label {
  font-weight: 800;
}
</style>
