<script setup lang="ts">
// @ts-ignore
import { useRuntimeConfig, useRouter, useNuxtApp } from '#imports'

import { RplSearchBar } from '#components'
import { isExternalUrl } from '@dpc-sdp/ripple-ui-core'

const router = useRouter()
const { $app_hostname } = useNuxtApp()

const props = defineProps<{
  placeholder: string
  searchUrl: string
  openInNewWindow: boolean
}>()

const handleSubmit = (value) => {
  const searchPath = encodeURI(
    props.searchUrl.replace('[SEARCH-KEYWORDS]', encodeURIComponent(value))
  )

  const isInternalUrl = !isExternalUrl(searchPath, $app_hostname)

  if (props.openInNewWindow) {
    window.open(searchPath, '_blank')
  } else if (isInternalUrl) {
    router.push(searchPath)
  } else {
    window.location.href = searchPath
  }
}
</script>

<template>
  <div class="tide-search-banner rpl-u-screen-only">
    <div class="rpl-container">
      <RplSearchBar
        variant="reverse"
        :placeholder="placeholder"
        @on-submit="handleSubmit"
      />
    </div>
  </div>
</template>

<style>
.tide-search-banner {
  background: var(--rpl-clr-neutral-200);
  padding: var(--rpl-sp-7) 0;

  @media (--rpl-bp-l) {
    padding: var(--rpl-sp-9) 0;
  }
}
</style>
