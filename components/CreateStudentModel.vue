<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h1>Create Student</h1>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel()
</script>
