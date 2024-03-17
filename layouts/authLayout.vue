<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div
      class="bg-white rounded-md w-full max-w-80 shadow-sm p-6 text-gray-700"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const authState = useAuthStore()
const loadingAuth = ref(true)
onMounted(async () => {
  if (authState.isAuthenticated) {
    return await navigateTo('/')
  }
  loadingAuth.value = false
})
</script>
