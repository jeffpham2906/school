<template>
  <div>
    <h1 class="text-center text-3xl my-4 dark:text-gray-200">Login</h1>
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
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UButton
        type="submit"
        class="w-32 flex items-center justify-center mx-auto !mt-10"
        >Login</UButton
      >
      <UButton
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
import type { UserLogin } from '~/types'
import { userLoginSchema } from '~/schema'

definePageMeta({
  layout: 'auth-layout',
})

const state = reactive<UserLogin>({
  username: '',
  password: '',
})
const form = ref()
const { signIn, isLoggedIn } = useAuth()
const route = useRoute()
const onSubmit = async (event: FormSubmitEvent<UserLogin>) => {
  const { execute, error } = await signIn(event.data, route.query.redirect_url)
  await execute()
  if (error.value) {
    form.value.setErrors([{ path: 'username', message: error.value.message }])
  }
}

const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
onMounted(() => {
  if (isLoggedIn.value) {
    return navigateTo(String(route.query.redirect_url) ?? '/')
  }
  if (route.query.expired === 'true' && route.fullPath.startsWith('/auth')) {
    useToast().add({ title: 'Phiên đăng nhập đã hết hạn', timeout: 2000 })
    return
  }
})
</script>
