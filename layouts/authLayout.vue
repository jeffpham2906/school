<template>
  <ClientOnly>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div
        class="bg-white rounded-md w-full max-w-80 shadow-sm p-6 text-gray-700"
      >
        <slot />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts"></script>
