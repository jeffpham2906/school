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
const state = reactive<UserLogin>({
  username: '',
  password: '',
})
const form = ref()
const { signIn, status } = useAuth()
// const isLoading = computed(() => status.value === 'loading')
const onSubmit = async (event: FormSubmitEvent<UserLogin>) => {
  await signIn(event.data).catch((err) =>
    form.value.setErrors([{ message: err.data?.message, path: 'username' }])
  )
}

const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
onMounted(() => {
  if (status.value === 'authorization') {
    return navigateTo('/')
  }
  if (
    useRoute().query.expired === 'true' &&
    useRoute().fullPath.startsWith('/auth')
  ) {
    useToast().add({ title: 'Phiên đăng nhập đã hết hạn' })
    return
  }
})
</script>
