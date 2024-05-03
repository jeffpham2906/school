<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-fit' }">
    <UCard>
      <div class="mb-4">
        <slot>{{ message }}?</slot>
      </div>
      <div class="flex justify-around gap-2">
        <UButton
          :label="$t('yes')"
          class="w-20 flex justify-center"
          variant="ghost"
          @click="emit('onAccept')"
        />
        <UButton
          :label="$t('no')"
          class="w-20 flex justify-center"
          @click="handleRightClick"
        />
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string
  }>(),
  {
    message: 'Confirm something',
  }
)
const isOpen = defineModel()
const emit = defineEmits(['onAccept', 'onRefuse'])
const handleRightClick = () => {
  isOpen.value = false
  emit('onRefuse')
}
</script>
