<template>
  <div>
    <div
      class="mb-1 flex items-center justify-between cursor-pointer"
      @click="showDetail = !showDetail"
    >
      <span>{{ $t(label) }}</span>
      <UButton icon="i-heroicons-chevron-down" size="xs" variant="ghost" />
    </div>
    <div v-show="showDetail" class="flex flex-col gap-1">
      <UCheckbox
        v-for="option in options"
        :key="option"
        :label="$t(option)"
        :modelValue="selectedList.includes(option)"
        @change="handleChange(option)"
      >
      </UCheckbox>
    </div>
  </div>
  <UDivider v-if="!isLastItem" class="my-2" />
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  options: string[]
  autoShow?: boolean
  isLastItem?: boolean
}>()
const selectedList = defineModel<string[]>({
  default: [],
  required: true,
})
const handleChange = (label: string) => {
  const index = selectedList.value.findIndex((e) => e === label)
  if (index === -1) {
    selectedList.value.push(label)
  } else {
    selectedList.value.splice(index, 1)
  }
}

const showDetail = ref(props.autoShow || false)
</script>
