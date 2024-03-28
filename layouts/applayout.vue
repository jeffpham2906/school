<template>
  <div>
    <div class="h-screen grid grid-rows-[auto,1fr] grid-cols-[auto,1fr]">
      <div class="row-start-1 row-end-3 px-6 py-3 border-r">
        <h1 class="text-center font-semibold px-4 py-2 mb-6">Logo</h1>
        <NavBar />
      </div>
      <div
        class="flex flex-row-reverse px-4 py-3 items-center gap-2.5 border-b"
      >
        <UIcon
          name="i-heroicons-arrow-left-on-rectangle"
          class="w-6 h-6 rotate-180 cursor-pointer"
          @click="signOut"
        />
        <DarkMode />
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
      <div><slot /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { userData, signOut } = useAuth()
</script>
