<template>
  <div class="rpl-form__outer">
    <RplFormLabel>Theme options</RplFormLabel>
    <RplFormOptionButtons
      v-model="theme"
      :onChange="handleThemeChange"
      :value="theme"
      :options="[
        {
          id: 'docsTheme1',
          label: 'Alt 1',
          value: 'light'
        },
        {
          id: 'docsTheme2',
          label: 'Alt 2',
          value: 'dark'
        },
        {
          id: 'default',
          label: 'vic.gov.au',
          value: 'default'
        }
      ]"
    />
  </div>
  <div class="docs-theme-chooser-examples">
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  id: string
}

const props = defineProps<Props>()

const theme = ref('docsTheme1')

const handleThemeChange = (val) => {
  theme.value = val
}

provide('exampleTheme', theme)
</script>

<style scoped>
.docs-theme-chooser-examples {
  margin-top: var(--rpl-sp-4);
}
</style>
