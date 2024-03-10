<template>
  <div>
    <h1 class="text-center text-3xl my-4">Login</h1>
    <UForm
      :schema="userLoginSchema"
      :state="state"
      class="space-y-4 p-4"
      @submit="onSubmit"
      @error="onError"
    >
      <UFormGroup label="Username" name="username" required>
        <UInput v-model="state.username" />
      </UFormGroup>
      <UFormGroup label="Password" name="password" required>
        <UInput v-model="state.password" />
      </UFormGroup>
      <UButton
        type="submit"
        class="w-32 flex items-center justify-center mx-auto !mt-10"
        :loading="loading"
        >Login</UButton
      >
      <UButton
        to="/auth/signup"
        variant="link"
        class="mx-auto flex items-center justify-center w-32"
      >
        Sign up
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import * as yup from 'yup'
import type { UserLogin } from '~/types'
definePageMeta({
  layout: 'auth-layout',
})

const state = reactive<UserLogin>({
  username: '',
  password: '',
})

const userLoginSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(6, 'Username at least 6 character'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password at least 6 character'),
})
const authState = useAuthStore()
const loading = ref(false)

const onSubmit = (event: FormSubmitEvent<UserLogin>) => {
  loading.value = true
  authState.login(event.data).finally(() => (loading.value = false))
}

const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
