import { computed, ref } from 'vue'
import type { Ref } from 'vue'

export default (url: string) => {
  const pathRegex = /^\/.*/i
  const urlRegex = /^(https?:\/\/)/i

  const urlRef: Ref<string | null> = ref(url)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const printUrl = computed(() => {
    if (pathRegex.test(url)) {
      return `${baseUrl}${url}`
    }

    if (!urlRegex.test(url)) {
      return null
    }

    return url
  })

  return printUrl
}
