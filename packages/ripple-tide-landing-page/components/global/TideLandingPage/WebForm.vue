<script setup lang="ts">
import { useRuntimeConfig } from '#imports'
import { FormKitSchemaNode } from '@formkit/core'
import { $fetch } from 'ohmyfetch'
import { nextTick, ref, watch } from 'vue'
import { RplFormAlert } from '@dpc-sdp/ripple-ui-forms'

interface Props {
  formId: string
  hideFormOnSubmit: boolean
  successMessageTitle: string
  successMessageHTML: string
  errorMessageTitle: string
  errorMessageHTML: string
  schema: Array<FormKitSchemaNode>
}

const props = withDefaults(defineProps<Props>(), {
  hideFormOnSubmit: false,
  successMessageTitle: 'Form submitted',
  errorMessageTitle: 'Form not submitted'
})

const honeypotId = `${props.formId}-important-email`
const isHoneypotTriggered = () => {
  const honeypotElement: HTMLInputElement = document.querySelector(
    `#${honeypotId}`
  )

  return honeypotElement && !!honeypotElement.value
}

/**
 * Post form data to Tide API
 * @param {string} formId - webform Id
 * @param {Object} formData - form data
 */
const postForm = async (formId, formData = {}) => {
  const { public: config } = useRuntimeConfig()

  const formResource = 'webform_submission'

  const body = {
    data: {
      type: formResource,
      attributes: {
        remote_addr: '0.0.0.0', // A IP placeholder for Tide validation, incase the IP is required.
        data: JSON.stringify(formData)
      }
    }
  }

  // TODO: Add better error handling/log for form API error.
  // It's blocked by Tide webform response issue SDPA-477.
  // Currently the Tide webform has no right response.
  const url = `api/tide/${formResource}/${formId}`
  const { data, error } = await $fetch(url, {
    method: 'POST',
    baseURL: config.API_URL || '',
    body,
    params: {
      site: config.tide.site
    },
    headers: {
      'Content-Type': 'application/vnd.api+json;charset=UTF-8'
    }
  })

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('Form submission failed')
  }

  return true
}

const submissionState = ref({
  status: 'idle',
  title: '',
  message: ''
})

const serverSuccessRef = ref<RplFormAlert>(null)

const submitHandler = async (values) => {
  submissionState.value = {
    status: 'submitting',
    title: '',
    message: ''
  }

  // If there's a value in the honeypot, just show a success message without actually submitting the form
  if (isHoneypotTriggered()) {
    submissionState.value = {
      status: 'success',
      title: props.successMessageTitle,
      message: props.successMessageHTML
    }

    return
  }

  try {
    await postForm(props.formId, values)

    submissionState.value = {
      status: 'success',
      title: props.successMessageTitle,
      message: props.successMessageHTML
    }
  } catch (error) {
    console.error(error)

    submissionState.value = {
      status: 'error',
      title: props.errorMessageTitle,
      message: props.errorMessageHTML
    }
  }
}

// Scroll to and focus on success and error messages when they appear
watch(
  () => submissionState.value.status,
  async (newStatus, oldStatus) => {
    if (oldStatus === 'submitting' && newStatus === 'success') {
      await nextTick()
      if (serverSuccessRef.value) {
        serverSuccessRef.value.focus()
      }
    }
  }
)
</script>

<template>
  <div
    :style="{
      '--local-max-width': '595px'
    }"
  >
    <RplFormAlert
      v-if="hideFormOnSubmit && submissionState.status === 'success'"
      ref="serverSuccessRef"
      :status="submissionState.status"
      :title="submissionState.title"
      data-component-type="form-server-message"
      :restrictWidth="true"
    >
      <template #default>
        <RplContent :html="submissionState.message" />
      </template>
    </RplFormAlert>
    <RplForm
      v-else
      :id="formId"
      :schema="schema"
      :submissionState="submissionState"
      @submit="submitHandler"
    >
      <template #belowForm>
        <div class="tide-webform-important-email">
          <label for="honeypotId">Important email</label>
          <input :id="honeypotId" type="text" autocomplete="off" />
        </div>
      </template>
      <template #default="{ value }">
        <slot :value="value" />
      </template>
    </RplForm>
  </div>
</template>

<style>
.tide-webform-important-email {
  display: none !important;
  visibility: hidden !important;
}
</style>
