<template>
  <button @click="emit('onClick')" class="flex items-center gap-x-1.5">
    <span>{{ $t(column.label) }}</span>
    <UIcon
      v-if="sort.column === column.key"
      :name="
        sort.direction === 'asc'
          ? 'i-heroicons-arrow-up-16-solid'
          : sort.direction === 'desc'
            ? 'i-heroicons-arrow-down-16-solid'
            : ''
      "
    >
    </UIcon>
    <UIcon v-else name="i-heroicons-arrows-up-down-16-solid" />
  </button>
</template>

<script setup lang="ts">
import type { Column, Sort } from '~/types'

const emit = defineEmits(['onClick'])

defineProps<{
  column: Column
  sort: Sort
}>()
</script>
