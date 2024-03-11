import Vue3Toastify, {
  toast,
  type ToastContainerOptions,
  type ToastOptions,
} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 2000,
  } as ToastOptions) as ToastContainerOptions

  return {
    provide: { toast },
  }
})
