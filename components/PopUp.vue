<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-fit' }">
    <div class="flex flex-col justify-center items-center p-8 gap-6">
      <slot name="message">{{ $t('confirm_delete') }}</slot>
      <div class="flex gap-6">
        <UButton
          label="Có"
          class="w-20 flex justify-center"
          variant="ghost"
          @click="emit('onLeftClick')"
        />
        <UButton
          label="Không"
          class="w-20 flex justify-center"
          @click="isOpen = false"
        />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel()
const emit = defineEmits<{ onLeftClick: [] }>()
</script>
