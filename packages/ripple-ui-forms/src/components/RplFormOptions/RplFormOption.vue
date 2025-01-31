<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RplIcon } from '@dpc-sdp/ripple-ui-core/vue'
import useFormkitFriendlyEventEmitter from '../../composables/useFormkitFriendlyEventEmitter'

export interface RplFormOptionProps {
  type?: 'radio' | 'checkbox'
  id: string
  label: string
  checked?: boolean
  disabled?: boolean
  variant?: 'default' | 'reverse'
  onChange: (checked: boolean) => void
  onValue?: boolean | string | number
  offValue?: boolean | string | number
  showRequiredInLabel?: boolean
}

const props = withDefaults(defineProps<RplFormOptionProps>(), {
  type: 'checkbox',
  disabled: false,
  variant: 'default',
  onChange: () => undefined,
  onValue: true,
  offValue: false,
  showRequiredInLabel: false
})

const emit = defineEmits<{ (e: 'onChange', value: boolean): void }>()

const classes = computed(() => {
  return ['rpl-form-option', `rpl-form-option--${props.variant}`]
})

const handleChange = (e: Event) => {
  const el = e.target as HTMLInputElement
  const newValue = el.checked ? props.onValue : props.offValue

  // TODO - Wire up event bus handling here
  useFormkitFriendlyEventEmitter(props, emit, 'onChange', newValue)
}
</script>

<template>
  <div :class="classes">
    <input
      :id="id"
      :type="type"
      class="rpl-form-option__input"
      :disabled="disabled"
      :checked="checked"
      v-bind="$attrs"
      @change="handleChange"
    />
    <label class="rpl-form-option__label" :for="id">
      <span
        v-if="type === 'checkbox'"
        class="rpl-form-option__mark rpl-form-option__check"
      >
        <RplIcon
          class="rpl-form-option__mark-tick"
          name="icon-check"
          size="s"
        />
      </span>
      <span
        v-if="type === 'radio'"
        class="rpl-form-option__mark rpl-form-option__radio"
      >
        <span class="rpl-form-option__mark-tick rpl-form-option__radio-tick" />
      </span>
      <span class="rpl-form-option__label-text rpl-type-p">
        {{ label }}
        <span
          v-if="showRequiredInLabel"
          class="rpl-form-label__required rpl-type-label-small"
        >
          (Required)
        </span>
      </span>
    </label>
  </div>
</template>

<style src="./RplFormOption.css"></style>
