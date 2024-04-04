<template>
  <USelectMenu
    v-model="model"
    :options="options"
    :disabled="disabled"
    :multiple="multiple"
    :placeholder="placeholder"
  >
    <template #label>
      <slot name="labelValue" />
    </template>
    <template #option="{ option }">
      <span>
        {{ $t(option) }}
      </span>
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
defineProps<{
  options: string[]
  disabled?: boolean
  multiple?: boolean
  placeholder?: string
}>()

const model = defineModel()
</script>
