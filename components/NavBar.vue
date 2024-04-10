<template>
  <div>
    <UVerticalNavigation
      :links="links"
      class="w-36"
      :ui="{ base: 'gap-2.5 mb-2', size: 'text-base' }"
    >
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">
          {{ $t(link.label) }}
        </span>
      </template>
    </UVerticalNavigation>
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
    label: 'nav_teachers',
    icon: 'i-heroicons-user-group',
    to: '/teachers',
  },
  {
    label: 'nav_students',
    icon: 'i-heroicons-academic-cap',
    to: '/students',
  },
  {
    label: 'nav_classes',
    icon: 'i-heroicons-rectangle-group',
    to: '/classes',
  },
]
</script>
