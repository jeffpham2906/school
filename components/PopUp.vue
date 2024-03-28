<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-fit' }">
    <div class="flex flex-col justify-center items-center p-8 gap-6">
      <slot name="message">Bạn có chắc chắn xoá người dùng chứ?</slot>
      <div class="flex gap-6">
        <UButton
          label="Có"
          class="w-20 flex justify-center"
          icon="i-heroicons-check-circle"
          trailing
          @click="emit('onLeftClick')"
          :loading="loading"
        />
        <UButton
          label="Không"
          class="w-20 flex justify-center"
          variant="ghost"
          @click="isOpen = false"
        />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel()
defineProps<{
  loading: boolean
}>()
const emit = defineEmits<{ onLeftClick: [] }>()
</script>
