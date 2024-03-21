<template>
  <UCard
    :ui="{
      base: '',
      ring: '',
      shadow: '',
      divide: '',
    }"
  >
    <template #header>
      <HeaderPage>Add Teacher</HeaderPage>
    </template>
    <UForm>
      <UFormGroup label="Name">
        <UInput />
      </UFormGroup>
    </UForm>
  </UCard>
</template>

<script setup lang="ts"></script>
