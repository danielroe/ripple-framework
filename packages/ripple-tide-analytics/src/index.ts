import {
  tidePageBaseMapping,
  tidePageBaseIncludes
} from '@dpc-sdp/ripple-tide-api'
import type { RplTideMapping } from '@dpc-sdp/ripple-tide-api/types'

const tideAnalyticsModule: RplTideMapping = {
  component: '@dpc-sdp/ripple-tide-analytics/component',
  schema: '@dpc-sdp/ripple-tide-analytics/types',
  mapping: {
    ...tidePageBaseMapping({
      withSidebarContacts: false,
      withSidebarRelatedLinks: false
    }),
    header: {
      title: 'title',
      summary: 'field_landing_page_intro_text'
    },
    summary: 'field_landing_page_summary',
  },
  includes: [
    ...tidePageBaseIncludes({
      withSidebarContacts: false,
      withSidebarRelatedLinks: false
    }),
  ]
}

export default tideAnalyticsModule
