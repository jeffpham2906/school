<template>
  <div>
    <UVerticalNavigation
      :links="links"
      class="w-36"
      :ui="{ base: 'gap-2.5 mb-2', size: 'text-base' }"
    />
  </div>
</template>

<script setup lang="ts">
interface Link {
  label: string
  icon: string
  to: string
}
const links: Link[] = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Student',
    icon: 'i-heroicons-academic-cap',
    to: '/student',
  },
  {
    label: 'Teacher',
    icon: 'i-heroicons-user-group',
    to: '/teacher',
  },
]
</script>
