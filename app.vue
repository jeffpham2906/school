<template>
  <NuxtLayout
    ><NuxtLoadingIndicator />
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>
<script setup lang="ts">
// const loadingAuth = ref(true)
// const authState = useAuthStore()
// onMounted(async () => {
//   try {
//     if (authState.isAuthenticated) {
//       return
//     } else {
//       return await navigateTo('/auth/login')
//     }
//   } catch (error) {
//     console.log(error)
//   } finally {
//     loadingAuth.value = false
//   }
// })
</script>
