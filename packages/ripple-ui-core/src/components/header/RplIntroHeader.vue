<script setup lang="ts">
import RplHeader from './RplHeader.vue'
import { IRplHeaderLinksList } from './constants'
import RplIcon from '../icon/RplIcon.vue'
import RplHeaderLinks from './RplHeaderLinks.vue'
import { RplIconNames } from '../icon/constants'

interface Props {
  title: string
  content?: string
  links?: IRplHeaderLinksList
  iconName?: (typeof RplIconNames)[number]
}

withDefaults(defineProps<Props>(), {
  content: undefined,
  links: undefined,
  iconName: undefined
})
</script>

<template>
  <RplHeader class="rpl-header--intro">
    <template v-if="iconName" #upper>
      <RplIcon class="rpl-header__icon" :name="iconName" size="l" />
    </template>
    <template #title>
      <h2 class="rpl-header__title rpl-type-h2" data-cy="title">{{ title }}</h2>
    </template>
    <div v-if="$slots.default" data-cy="summary">
      <slot></slot>
    </div>
    <template v-if="links" #aside>
      <RplHeaderLinks
        :title="links?.title"
        :items="
          (links.items || []).map((item) => ({
            ...item,
            icon: item.icon || 'icon-arrow-right'
          }))
        "
        :more-link="links.more"
      />
    </template>
  </RplHeader>
</template>
