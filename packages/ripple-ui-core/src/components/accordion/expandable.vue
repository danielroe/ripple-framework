<script lang="ts">
export default { name: 'RplAccordion' }
</script>

<script setup lang="ts">
import { animateClosing, animateOpening } from 'ripple-ui-core/src/composables/useAnimateHeight';
import { ref, watch } from 'vue';


interface Props {
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
})

const containerRef = ref(null);

watch(() => props.expanded, (wasExpanded, isExpanded) => {
  if (!wasExpanded && isExpanded) {
    if (containerRef.value) {
      animateOpening(containerRef.value)
    }
  } else if (wasExpanded && !isExpanded) {
    if (containerRef.value) {
      animateClosing(containerRef.value)
    }
  }
})
</script>

<template>
  <div ref="containerRef">
    <slot />
  </div>
</template>
