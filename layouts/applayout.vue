<template>
  <div>
    <div
      class="h-screen grid grid-rows-[auto,1fr] grid-cols-[auto,1fr] dark:bg-gray-900"
    >
      <div class="row-start-1 row-end-3 px-6 py-3 border-r">
        <h1 class="text-center font-semibold px-4 py-2 mb-6"></h1>
        <NavBar />
      </div>
      <div
        class="flex flex-row-reverse px-4 py-3 items-center gap-2.5 border-b"
      >
        <UIcon
          name="i-heroicons-arrow-left-on-rectangle"
          class="w-6 h-6 rotate-180 cursor-pointer"
          @click="isOpenConfirmSignOut = true"
        />
        <PopupConfirm
          v-model="isOpenConfirmSignOut"
          @on-accept="signOut"
          :message="$t('are_you_sure_to_sign_out')"
        />

        <DarkMode />
        <USelectMenu
          v-model="language"
          :options="locales"
          padding="2xs"
          variant="outline"
          class="w-fit"
          option-attribute="name"
        >
        </USelectMenu>
        <UIcon name="i-heroicons-user" class="w-6 h-6" />
        <UFormGroup>
          <template #label>
            <div class="flex items-center gap-1">
              <UAvatar
                src="https://dev-minio.vais.vn/asahi-e-school-mng/public/avataaars.png"
                alt="avater"
                size="sm"
              />
              <span>{{ userData?.username || '' }}</span>
            </div>
          </template>
        </UFormGroup>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { userData, signOut } = useAuth()
const { locale, locales, setLocale } = useI18n()
const isOpenConfirmSignOut = ref(false)
const language = computed({
  get: () => locale.value,
  set: (value) => {
    setLocale(value.iso)
  },
})
</script>
