<script lang="ts">
export default { name: 'TidePublicationHeader' }
</script>

<template>
  <RplHeroHeader
    :corner-top="true"
    :corner-bottom="true"
    :behind-nav="true"
    :breadcrumbs="hasBreadcrumbs"
    :title="header.title"
  >
    <p class="rpl-type-p-large">{{ header.summary }}</p>
  </RplHeroHeader>
</template>

<script setup lang="ts">
import type { TidePublicationHeader } from '../types'

interface Props {
  header: TidePublicationHeader
  hasBreadcrumbs: boolean
}

defineProps<Props>()
</script>
