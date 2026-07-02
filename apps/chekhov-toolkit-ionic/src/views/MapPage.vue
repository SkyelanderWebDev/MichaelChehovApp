<template>
  <ion-page>
    <ion-content class="map-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Community</p>
          <h1>Connect</h1>
          <p class="page-subtitle">
            The future home for the Michael Chekhov community around you. These spaces arrive in
            later beta updates; here is what Connect will hold.
          </p>
        </header>

        <section class="studio-panel coming-card" aria-label="Nearby studios and teachers, planned">
          <span class="coming-icon" aria-hidden="true">
            <ion-icon :icon="locationOutline" />
          </span>
          <span class="planned-pill">Planned</span>
          <h2>Studios &amp; teachers near you</h2>
          <p class="panel-copy">
            Find nearby Michael Chekhov studios and teachers. Nothing here uses your location today.
          </p>
        </section>

        <section class="studio-panel coming-card" aria-label="Events calendar, planned">
          <span class="coming-icon" aria-hidden="true">
            <ion-icon :icon="calendarOutline" />
          </span>
          <span class="planned-pill">Planned</span>
          <h2>Upcoming events &amp; calendar</h2>
          <p class="panel-copy">
            Workshops, intensives, and gatherings on one calendar.
          </p>
        </section>

        <button
          class="studio-panel coming-card chat-entry-card"
          type="button"
          data-testid="connect-chat-entry"
          @click="openChat"
        >
          <span class="coming-icon" aria-hidden="true">
            <ion-icon :icon="chatbubblesOutline" />
          </span>
          <span class="planned-pill beta-pill">Beta</span>
          <span class="chat-entry-title">Class &amp; show group chat</span>
          <span class="panel-copy chat-entry-copy">
            A shared group chat for a class or a show, one space for the whole ensemble. Group
            conversations only; there is no one-to-one direct messaging.
          </span>
          <span class="chat-entry-cta">
            Open group chat
            <ion-icon :icon="chevronForwardOutline" aria-hidden="true" />
          </span>
        </button>

        <p class="map-footnote">
          Today’s Practice lives in the Journal tab; the Chart of Inspired Action lives in Chart.
        </p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonIcon, IonPage } from '@ionic/vue';
import {
  calendarOutline,
  chatbubblesOutline,
  chevronForwardOutline,
  locationOutline,
} from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

function openChat(): void {
  router.push('/connect/chat');
}
</script>

<style scoped>
.coming-card {
  display: grid;
  gap: 8px;
  justify-items: start;
}

.coming-icon {
  align-items: center;
  background: var(--accent-soft);
  border-radius: 999px;
  color: var(--accent-primary);
  display: flex;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.coming-icon ion-icon {
  font-size: 1.4rem;
}

.planned-pill {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 5px 9px;
  text-transform: uppercase;
}

.chat-entry-card {
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
  width: 100%;
}

/* Buttons only allow phrasing content, so the heading/copy are styled spans. */
.chat-entry-title {
  color: var(--text-primary);
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 5.5vw, 1.7rem);
  font-weight: 600;
  line-height: 1.06;
}

.chat-entry-copy {
  display: block;
}

.beta-pill {
  background: var(--accent-soft);
  border-color: transparent;
  color: var(--accent-primary);
}

.chat-entry-cta {
  align-items: center;
  color: var(--accent-primary);
  display: inline-flex;
  font-size: 0.88rem;
  font-weight: 800;
  gap: 2px;
}

.map-footnote {
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.45;
  margin: 0;
  text-align: center;
}
</style>
