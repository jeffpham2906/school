<template>
  <div v-if="loadingAuth">Loading...</div>
  <div v-else>
    <h1>Default layout</h1>
    <slot />
  </div>
</template>

<script setup lang="ts">
const loadingAuth = ref(true)
onMounted(() => {
  loadingAuth.value = false
})
</script>
