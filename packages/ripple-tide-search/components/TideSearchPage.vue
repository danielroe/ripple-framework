<script setup lang="ts">
import { computed, ref } from 'vue'
import { RplSearchBar, RplHeroHeader } from '#components'
import { useRuntimeConfig, useFetch, useRoute } from '#imports'
import useTideSearch from './../composables/use-tide-search'
import { FilterConfigItem, MappedSearchResult } from 'ripple-tide-search/types'
import { FormKit } from '@formkit/vue'
import { SearchDriverOptions } from '@elastic/search-ui'

interface Props {
  pageTitle: string
  filtersConfig: FilterConfigItem[]
  searchDriverOptions: Omit<SearchDriverOptions, 'apiConnector'>
  searchResultsMappingFn: (item: any) => MappedSearchResult<any>
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: 'Search',
  filtersConfig: () => [],
  searchDriverOptions: () => ({
    initialState: { resultsPerPage: 10 },
    alwaysSearchOnInitialLoad: true,
    searchQuery: {
      search_fields: {
        title: {
          weight: 10
        },
        body: {},
        field_paragraph_body: {}
      }
    },
    autocompleteQuery: {
      suggestions: {
        types: {
          documents: { fields: ['title'] }
        },
        size: 8
      }
    }
  }),
  searchResultsMappingFn: (item): MappedSearchResult<any> => {
    return {
      id: item._meta.id,
      component: 'RplSearchResult',
      props: {
        title: item.title?.raw?.[0],
        url: item.url?.raw?.[0].replace(/\/site-(\d+)/, ''),
        updated: item.changed?.raw?.[0]
      }
    }
  }
})

const route = useRoute()
const { public: config } = useRuntimeConfig()
const siteId = config.tide?.site

const { data: site } = useFetch('/api/tide/site', {
  baseURL: config.API_URL || '',
  params: {
    id: siteId
  }
})

const apiConnectorOptions = {
  ...config.tide?.appSearch,
  // The search request is proxied through the API to avoid CORS issues
  endpointBase: '/api/tide/search'
}

const {
  updateSearchTerm,
  doSearch,
  goToPage,
  searchState,
  searchTermSuggestions,
  results,
  staticFacetOptions,
  filterFormValues
} = await useTideSearch(
  apiConnectorOptions,
  props.searchDriverOptions,
  props.filtersConfig,
  props.searchResultsMappingFn
)

const filtersExpanded = ref(false)

const prevLink = computed(() => {
  if (searchState.value.current <= 1) {
    return null
  }

  const searchParams = new URLSearchParams({
    ...route.query,
    current: `n_${searchState.value.current - 1}_n`
  })

  return {
    url: `${route.path}?${searchParams.toString()}`,
    description: `${searchState.value.current - 1} of ${
      searchState.value.totalPages
    }`
  }
})

const nextLink = computed(() => {
  if (searchState.value.current === searchState.value.totalPages) {
    return null
  }

  const searchParams = new URLSearchParams({
    ...route.query,
    current: `n_${searchState.value.current + 1}_n`
  })

  return {
    url: `${route.path}?${searchParams.toString()}`,
    description: `${searchState.value.current + 1} of ${
      searchState.value.totalPages
    }`
  }
})

const handlePrevClick = () => {
  goToPage(searchState.value.current - 1)
}

const handleNextClick = () => {
  goToPage(searchState.value.current + 1)
}

const handleFilterSubmit = () => {
  doSearch()
}

const handleFilterReset = () => {
  filterFormValues.value = {}
  doSearch()
}

const toggleFilters = () => {
  filtersExpanded.value = !filtersExpanded.value
}

const getFilterOptions = (field) => {
  if (!staticFacetOptions.value?.[field]) {
    return []
  }

  return staticFacetOptions.value?.[field].map((item) => ({
    id: item,
    label: item,
    value: item
  }))
}
</script>

<template>
  <TideBaseLayout :site="site">
    <template #aboveBody>
      <RplHeroHeader
        :title="pageTitle"
        :behind-nav="true"
        :breadcrumbs="true"
        :full-width="true"
        :corner-top="true"
        :corner-bottom="false"
      >
        <div class="tide-search-header">
          <RplSearchBar
            id="tide-search-bar"
            variant="default"
            input-label="Search"
            :inputValue="searchState.searchTerm"
            :suggestions="searchTermSuggestions"
            @on-submit="doSearch"
            @update:input-value="updateSearchTerm"
          />
          <RplSearchBarRefine
            class="tide-search-refine-btn"
            :expanded="filtersExpanded"
            @click="toggleFilters"
          />
          <RplExpandable :expanded="filtersExpanded">
            <RplForm
              v-if="staticFacetOptions !== null"
              id="tide-search-filter-form"
              v-model:model-value="filterFormValues"
              @submit="handleFilterSubmit"
            >
              <div class="rpl-grid rpl-grid--no-row-gap tide-search-filters">
                <div
                  v-for="filter in filtersConfig"
                  :key="filter.field"
                  class="rpl-col-12 rpl-col-6-m"
                >
                  <FormKit
                    :id="filter.field"
                    :name="filter.field"
                    type="RplFormDropdown"
                    :multiple="true"
                    :label="filter.label"
                    :placeholder="filter.placeholder"
                    :options="getFilterOptions(filter.field)"
                  />
                </div>
              </div>
              <RplFormActions
                label="Apply search filters"
                resetLabel="Clear search filters"
                :displayResetButton="true"
                @reset="handleFilterReset"
              />
            </RplForm>
          </RplExpandable>
        </div>
      </RplHeroHeader>
    </template>
    <template #body>
      <RplPageComponent>
        <p class="rpl-type-label rpl-u-padding-b-6">
          Displaying {{ searchState.pagingStart }}-{{
            searchState.pagingEnd
          }}
          of {{ searchState.totalResults }} results
        </p>
      </RplPageComponent>
      <RplPageComponent>
        <div class="rpl-grid">
          <div class="rpl-col-12 rpl-col-8-m">
            <RplResultListing>
              <RplResultListingItem
                v-for="(result, idx) in results"
                :key="`result-${idx}-${result.id}`"
              >
                <component :is="result.component" v-bind="result.props" />
              </RplResultListingItem>
            </RplResultListing>
          </div>
        </div>
      </RplPageComponent>
      <RplPageComponent>
        <RplPageLinks v-if="results && results.length">
          <RplPageLinksItem
            v-if="prevLink"
            :url="prevLink.url"
            label="Previous"
            direction="prev"
            @click.prevent="handlePrevClick"
          >
            {{ prevLink.description }}
          </RplPageLinksItem>
          <RplPageLinksItem
            v-if="nextLink"
            :url="nextLink.url"
            label="Next"
            direction="next"
            @click.prevent="handleNextClick"
          >
            {{ nextLink.description }}
          </RplPageLinksItem></RplPageLinks
        >
      </RplPageComponent>
    </template>
  </TideBaseLayout>
</template>

<style>
.tide-search-header {
  display: flex;
  flex-direction: column;
  margin-top: var(--rpl-sp-6);
}

.tide-search-filters.rpl-grid {
  row-gap: var(--rpl-sp-6);
}

.tide-search-filters .rpl-form__outer {
  margin: 0;
}

.tide-search-refine-btn {
  align-self: flex-end;
  padding: 0;
  margin-top: var(--rpl-sp-5);
}
</style>
