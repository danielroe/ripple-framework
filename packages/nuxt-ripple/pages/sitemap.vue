<script lang="ts">
export default {
  name: 'TideWrapper'
}
</script>

<script setup lang="ts">
import { RplHeroHeader } from '#components'
import { useTideSite } from '#imports'

const site = await useTideSite()
</script>

<template>
  <TideBaseLayout
    :site="site"
    :page="{}"
    :pageTitle="`Sitemap - ${site.name}`"
    pageLanguage="en-AU"
  >
    <template #aboveBody="{ hasBreadcrumbs }">
      <RplHeroHeader
        title="Sitemap"
        :behind-nav="true"
        :breadcrumbs="hasBreadcrumbs"
      />
    </template>
    <template #body>
      <RplSitemap :items="site.menus.menuMain" />
    </template>
    <template #sidebar>
      <span />
    </template>
  </TideBaseLayout>
</template>
