<template>
  <div class="flex flex-col justify-center">
    <h1 class="text-center text-3xl mt-2">Sign up</h1>
    <UForm
      :schema="userSignUpSchema"
      :state="state"
      class="space-y-3 p-4"
      @submit="onSubmit"
      @error="onError"
    >
      <UFormGroup label="Username" name="username" required>
        <UInput v-model="state.username" />
      </UFormGroup>
      <UFormGroup label="Password" name="password" required>
        <UInput v-model="state.password" type="password" autocomplete="" />
      </UFormGroup>
      <UFormGroup label="Confirm Password" name="confirmPassword" required>
        <UInput
          v-model="state.confirmPassword"
          type="password"
          autocomplete=""
        />
      </UFormGroup>
      <UButton type="submit" class="block mx-auto">Sign up</UButton>
      <p class="text-center">
        Already have account?
        <UButton to="/auth/login" variant="link">Login</UButton>
      </p>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import * as yup from 'yup'
definePageMeta({
  layout: 'auth-layout',
})

const state = reactive({
  username: undefined,
  password: undefined,
  confirmPassword: undefined,
})

const userSignUpSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(6, 'Username at least 6 character'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password at least 6 character'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Password not match')
    .required('Confirm password is required'),
})

const onSubmit = async (event: FormSubmitEvent<unknown>) => {
  console.log(event.data)
}

const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
