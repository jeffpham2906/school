<template>
  <UCard
    class="h-full relative"
    :ui="{
      base: '',
      ring: '',
      shadow: '',
      divide: '',
    }"
  >
    <HeaderPage>{{ $t('students_title') }}</HeaderPage>
  </UCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'applayout',
})
</script>
