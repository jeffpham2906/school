<template>
  <UCard class="" :ui="{ shadow: '', ring: '' }">
    <template #header>
      <HeaderPage>{{ $t('nav_home') }}</HeaderPage>
    </template>
  </UCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'applayout',
})
</script>
