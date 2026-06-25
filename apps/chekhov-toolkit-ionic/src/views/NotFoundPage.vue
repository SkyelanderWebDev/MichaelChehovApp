<template>
  <ion-page>
    <ion-content class="not-found-page">
      <main class="page-shell">
        <section class="studio-panel not-found-card" aria-labelledby="not-found-title">
          <p class="kicker">404</p>
          <h1 id="not-found-title">Page not found</h1>
          <p class="panel-copy">This route is not part of the beta app shell.</p>
          <ion-button color="primary" @click="router.push('/chart')">Return to Chart</ion-button>
        </section>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonPage } from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.not-found-card {
  display: grid;
  gap: 10px;
  margin-top: 10vh;
}

.not-found-card h1 {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 8vw, 2.5rem);
  font-weight: 600;
  line-height: 1.02;
  margin: 0;
}

.not-found-card ion-button {
  justify-self: start;
  min-height: 44px;
}
</style>
