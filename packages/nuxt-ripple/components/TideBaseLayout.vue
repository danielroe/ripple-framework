<template>
  <RplLayout :background="background">
    <template #aboveHeader>
      <RplIconSprite />
      <slot name="aboveHeader"></slot>
      <TideAlerts :siteAlerts="site?.siteAlerts" />
    </template>
    <template #primaryNav>
      <slot name="primaryNav">
        <RplPrimaryNav
          :primaryLogo="{
            src: '/img/primary-nav-logo-primary.svg',
            printSrc: '/img/primary-nav-logo-primary-print.svg',
            altText: 'Victoria government logo',
            href: '/'
          }"
          :secondaryLogo="site?.siteLogo"
          :items="site?.menus.menuMain || []"
          :showQuickExit="site?.showQuickExit"
        >
        </RplPrimaryNav>
      </slot>
    </template>
    <template #breadcrumbs>
      <slot name="breadcrumbs">
        <TideBreadcrumbs
          v-if="showBreadcrumbs"
          :siteMenu="site?.menus.menuMain"
          :currentPath="route.path"
          :currentPageTitle="pageTitle"
        />
      </slot>
    </template>
    <template #aboveBody="{ hasBreadcrumbs }">
      <slot name="aboveBody" :hasBreadcrumbs="hasBreadcrumbs"></slot>
    </template>
    <template #body="{ hasSidebar }">
      <slot name="body" :hasSidebar="hasSidebar"></slot>
      <TideTopicTags
        v-if="!featureFlags?.disableTopicTags && topicTags.length"
        :items="topicTags"
      />
      <TideUpdatedDate v-if="updatedDate" :date="updatedDate" />
    </template>
    <template #belowBody>
      <slot name="belowBody"></slot>
      <TideContentRating
        v-if="showContentRating"
        :siteSectionName="siteSection ? siteSection.name : ''"
      />
    </template>
    <template #aboveSidebar>
      <slot name="aboveSidebar"></slot>
    </template>
    <template #sidebar>
      <slot name="sidebar"></slot>
    </template>
    <template #belowSidebar>
      <slot name="aboveSidebar"></slot>
    </template>
    <template #footer>
      <slot name="footer">
        <RplFooter
          :nav="site?.menus.menuMain"
          :links="site?.menus.menuFooter"
          :copyright="site?.copyright"
          :acknowledgement="site?.acknowledgementFooter"
          :logos="site?.footerLogos"
          :credit="footerImageCaption"
          :variant="featureFlags?.footerTheme || 'default'"
        >
          <template v-if="site?.copyrightHtml" #copyright>
            <div data-cy="footer-copyright" v-html="site?.copyrightHtml"></div>
          </template>
        </RplFooter>
      </slot>
    </template>
  </RplLayout>
</template>

<script setup lang="ts">
// @ts-ignore
import { useHead, useSiteTheme, useAppConfig, useRoute } from '#imports'
import { computed, onMounted, provide, ref } from 'vue'
import { deepmerge } from 'deepmerge-ts'
import { TideSiteData } from '../types'
import { TideTopicTag } from '../mapping/base/topic-tags/topic-tags-mapping'
import { TideSiteSection } from '@dpc-sdp/ripple-tide-api/types'
import hideAlertsOnLoadScript from '../utils/hideAlertsOnLoadScript.js'
import useTidePageMeta from '../composables/use-tide-page-meta'

interface Props {
  site: TideSiteData
  background?: string
  pageTitle: string
  pageLanguage?: string
  footerImageCaption?: string
  topicTags?: TideTopicTag[]
  updatedDate?: string | null
  siteSection: TideSiteSection | null
  page: any
  showContentRating: boolean
}

const props = withDefaults(defineProps<Props>(), {
  background: 'default',
  pageLanguage: 'en-AU',
  footerImageCaption: '',
  topicTags: () => [],
  updatedDate: null,
  siteSection: null,
  showContentRating: false
})

// Feature flags will be available on component instances with inject('featureFlags') - See https://vuejs.org/guide/components/provide-inject.html#inject
// Site flags provided by drupal will override the app config flags
const featureFlags = ref(
  deepmerge(
    useAppConfig()?.ripple?.featureFlags || {},
    props.site?.featureFlags || {}
  )
)
provide('featureFlags', featureFlags.value)

onMounted(() => {
  // Used for knowing when page is ready for cypress testing
  document.body.setAttribute('data-nuxt-hydrated', 'true')
})

const route = useRoute()

const showBreadcrumbs = computed(() => {
  return route.path !== '/'
})

const style = useSiteTheme(
  deepmerge(useAppConfig()?.ripple?.theme || {}, props.site?.theme || {})
)

useHead({
  htmlAttrs: {
    lang: props.pageLanguage || 'en-AU'
  },
  title: props.pageTitle,
  style: style && [
    {
      children: `:root, body { ${style} }`
    }
  ],
  link: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png'
    },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#0054c9' }
  ],
  meta: [
    { name: 'msapplication-TileColor', content: '#0054c9' },
    { name: 'theme-color', content: '#ffffff' }
  ],
  script: [
    {
      innerHTML: hideAlertsOnLoadScript
    }
  ]
})

if (props.page && props.page.meta) {
  useTidePageMeta(props)
}
</script>
