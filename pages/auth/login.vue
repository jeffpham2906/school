<template>
  <div>
    <h1 class="text-center text-3xl my-4 dark:text-gray-200">
      {{ $t('welcome') }}
    </h1>
    <UForm
      :schema="userLoginSchema"
      :state="state"
      class="space-y-4 p-4"
      @submit="onSubmit"
      @error="onError"
      ref="form"
    >
      <UFormGroup :label="$t('username')" name="username" required>
        <UInput v-model="state.username" />
        <template #error="{ error }">
          <span>{{ error && $t(error) }}</span>
        </template>
      </UFormGroup>
      <UFormGroup :label="$t('password')" name="password" required>
        <UInput v-model="state.password" type="password" />
        <template #error="{ error }">
          <span>{{ error && $t(error) }}</span>
        </template>
      </UFormGroup>
      <UCheckbox v-model="isSaved" :label="$t('save_login_infor')" />
      <UButton
        type="submit"
        class="w-32 flex items-center justify-center mx-auto !mt-10"
      >
        {{ $t('login') }}
      </UButton>
      <UButton
        variant="link"
        class="mx-auto flex items-center justify-center w-32"
      >
        {{ $t('sign_up') }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { userLoginSchema } from '~/schema'

definePageMeta({
  layout: 'auth-layout',
})
const isSaved = ref(false)
const loginInforSaved = useCookie<UserLogin>('login_infor')
const state = reactive<UserLogin>({
  username: '',
  password: '',
})
onMounted(() => {
  if (loginInforSaved.value?.password && loginInforSaved.value?.username) {
    state.username = loginInforSaved.value.username
    state.password = loginInforSaved.value.password
  }
})
const form = ref()
const { signIn, isLoggedIn } = useAuth()
const route = useRoute()
const onSubmit = async (event: FormSubmitEvent<UserLogin>) => {
  const { error } = await signIn(event.data, route.query.redirect_url)
  if (error.value) {
    form.value.setErrors([{ path: 'username', message: error.value.message }])
    return
  }
  loginInforSaved.value = event.data
}

const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
onMounted(async () => {
  if (isLoggedIn.value) return navigateTo('/teachers')
  if (route.query.expired === 'true') {
    useToast().add({ title: '' + route.query.message, timeout: 2000 })
    return
  }
})
</script>
