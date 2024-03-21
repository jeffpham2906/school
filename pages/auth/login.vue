<template>
  <div>
    <h1 class="text-center text-3xl my-4">Login</h1>
    <UForm
      :schema="userLoginSchema"
      :state="state"
      class="space-y-4 p-4"
      @submit="onSubmit"
      @error="onError"
      ref="form"
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
import type { UserAndTokenResponse, UserLogin } from '~/types'
definePageMeta({
  layout: 'auth-layout',
})

const state = reactive<UserLogin>({
  username: '',
  password: '',
})
const form = ref()
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
const config = useRuntimeConfig()
const { setTokenAuth } = useTokens()
const onSubmit = async (event: FormSubmitEvent<UserLogin>) => {
  loading.value = true
  form.value.clear()
  const { data } = await $fetch<{ data: UserAndTokenResponse }>(
    `${config.public.baseUrl}/v2/auth/login`,
    {
      method: 'POST',
      body: event.data,
      onResponseError({ response }) {
        form.value.setErrors([
          { message: response._data?.message, path: 'username' },
        ])
      },
    }
  ).finally(() => (loading.value = false))
  const user = data.user
  const token = data.tokens.access.token
  const refreshToken = data.tokens.refresh.token
  const refreshTokenExpire = data.tokens.refresh.expires
  if (user && token && refreshToken && refreshTokenExpire) {
    authState.setUser(user)
    setTokenAuth(token, refreshToken, refreshTokenExpire)
    return await navigateTo('/')
  } else {
    useToast().add({
      title: 'Lỗi không tìm được data user',
      icon: 'i-heroicons-x-circle',
      color: 'red',
      timeout: 3000,
    })
  }
  state.password = ''
  state.username = ''
}

const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
