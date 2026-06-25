<template>
  <ion-page>
    <ion-content class="map-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Coming soon</p>
          <h1>Connect</h1>
          <p class="page-subtitle">
            A future home for the Michael Chekhov community around you. Not part of this beta yet.
          </p>
        </header>

        <section class="studio-panel coming-card" aria-label="Nearby studios and teachers, coming soon">
          <span class="coming-icon" aria-hidden="true">
            <ion-icon :icon="locationOutline" />
          </span>
          <h2>Studios &amp; teachers near you</h2>
          <p class="panel-copy">
            Find nearby Michael Chekhov studios and teachers. This arrives in a later beta. Nothing
            here uses your location today.
          </p>
        </section>

        <section class="studio-panel coming-card" aria-label="Events calendar, coming soon">
          <span class="coming-icon" aria-hidden="true">
            <ion-icon :icon="calendarOutline" />
          </span>
          <h2>Upcoming events &amp; calendar</h2>
          <p class="panel-copy">
            Workshops, intensives, and gatherings on one calendar. Also planned for a later beta.
          </p>
        </section>

        <section class="studio-panel coming-card" aria-label="Class or show group chat, coming soon">
          <span class="coming-icon" aria-hidden="true">
            <ion-icon :icon="chatbubblesOutline" />
          </span>
          <h2>Class &amp; show group chat</h2>
          <p class="panel-copy">
            A shared group chat for a class or a show, one space for the whole ensemble. Group
            conversations only; there is no one-to-one direct messaging. Planned for a later beta.
          </p>
        </section>

        <p class="map-footnote">
          Today’s Practice lives in the Journal tab; the Chart of Inspired Action lives in Chart.
        </p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonIcon, IonPage } from '@ionic/vue';
import { calendarOutline, chatbubblesOutline, locationOutline } from 'ionicons/icons';
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

.map-footnote {
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.45;
  margin: 0;
  text-align: center;
}
</style>
