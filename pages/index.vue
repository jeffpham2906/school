<template>
  <div class="p-20">
    <UButton>HomePage</UButton>
    <UButton to="/user">UserPage</UButton>
    <UButton @click="signOut">Sign Out</UButton>
  </div>
</template>

<script setup lang="ts">
const { signOut } = useAuthStore()
</script>
