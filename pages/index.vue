<template>
  <div class="">
    <UButton>HomePage</UButton>
    <UButton @click="signOut">Sign Out</UButton>
  </div>
</template>

<script setup lang="ts">
const { signOut } = useAuthStore()
</script>
