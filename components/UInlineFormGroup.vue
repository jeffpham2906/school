<template>
  <UFormGroup
    :ui="{
      wrapper: 'grid grid-cols-[120px,1fr] items-center gap-4 relative',
      label: { base: 'w-full' },
      error: 'absolute mt-0.5',
    }"
  >
    <slot />
  </UFormGroup>
</template>

<script setup lang="ts"></script>
