<template>
  <p class="source-attribution">{{ ACTOR_STRUGGLES_SOURCE_ATTRIBUTION }}</p>
</template>

<script setup lang="ts">
import { ACTOR_STRUGGLES_SOURCE_ATTRIBUTION } from '@/data/actorStruggles';
</script>

<style scoped>
.source-attribution {
  background: var(--surface);
  border: 1px dashed var(--border-subtle);
  border-radius: 14px;
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.4;
  margin: 0;
  padding: 10px 12px;
}
</style>
