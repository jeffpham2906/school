<template>
  <div class="flex">
    <USelectMenu
      v-model="model"
      multiple
      :options="options"
      :ui="{ rounded: 'rounded-r-none' }"
      :size="size"
    >
      <template #label>
        <span v-if="model.length < 1">{{ $t(label) }}</span>
        <span v-else>
          {{ `${model.length} ${$t('selected')}` }}
        </span>
      </template>
      <template #option="{ option }">
        {{ $t(option) }}
      </template>
    </USelectMenu>
    <UButton
      icon="i-heroicons-x-mark-20-solid"
      color="gray"
      class="opacity-50 hover:opacity-100 rounded-l-none ring-0 border border-gray-400 dark:border-gray-500"
      @click="emit('onRemove')"
      size="2xs"
      variant="outline"
    />
  </div>
</template>

<script setup lang="ts">
const model = defineModel({ type: Array, default: [] })
defineProps<{
  options: unknown[]
  label: string
  size?: string
}>()
const emit = defineEmits(['onRemove'])
</script>
