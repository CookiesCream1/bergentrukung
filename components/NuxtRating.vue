<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    ratingCount?: number
    ratingSize?: string
    activeColor?: string
    inactiveColor?: string
    ratingValue?: number
    ratingContent?: string
    readOnly?: boolean
  }>(),
  {
    ratingCount: 5,
    ratingSize: '32px',
    activeColor: '#ffc700',
    inactiveColor: 'gray',
    ratingValue: 0,
    ratingContent: '\u2605',
    readOnly: true
  }
)

const emit = defineEmits<{
  ratingHovered: [value: number]
  ratingSelected: [value: number]
}>()

const maxRating = computed(() => Math.max(props.ratingCount, 1))

const clamp = (value: number) => Math.min(Math.max(value, 0), maxRating.value)

const selectedValue = ref(clamp(props.ratingValue))
const hoveredValue = ref<number | null>(null)

watch(
  () => props.ratingValue,
  (value) => {
    selectedValue.value = clamp(value)
  }
)

const displayValue = computed(() => {
  if (props.readOnly) {
    return clamp(props.ratingValue)
  }

  return hoveredValue.value ?? selectedValue.value
})

const starString = computed(() =>
  Array.from({ length: maxRating.value }, () => props.ratingContent).join(' ')
)

const fillWidth = computed(() => `${(displayValue.value / maxRating.value) * 100}%`)

const cssVars = computed(() => ({
  '--rating-size': props.ratingSize,
  '--rating-active-color': props.activeColor,
  '--rating-inactive-color': props.inactiveColor
}))

const clearHover = () => {
  if (props.readOnly) {
    return
  }

  hoveredValue.value = null
}

const setHover = (value: number) => {
  if (props.readOnly) {
    return
  }

  hoveredValue.value = value
  emit('ratingHovered', value)
}

const selectRating = (value: number) => {
  if (props.readOnly) {
    return
  }

  selectedValue.value = value
  emit('ratingSelected', value)
}
</script>

<template>
  <div
    class="nuxt-rating"
    :class="{ 'nuxt-rating--readonly': readOnly }"
    :style="cssVars"
    :role="readOnly ? 'img' : 'radiogroup'"
    :aria-label="`${displayValue} out of ${maxRating}`"
    @mouseleave="clearHover"
  >
    <template v-if="readOnly">
      <span
        class="nuxt-rating__track"
        aria-hidden="true"
      >{{ starString }}</span>
      <span
        class="nuxt-rating__fill"
        :style="{ width: fillWidth }"
        aria-hidden="true"
      >{{ starString }}</span>
    </template>

    <template v-else>
      <button
        v-for="value in maxRating"
        :key="value"
        type="button"
        class="nuxt-rating__button"
        :aria-label="`Rate ${value} out of ${maxRating}`"
        :aria-checked="value === selectedValue"
        role="radio"
        @mouseenter="setHover(value)"
        @focus="setHover(value)"
        @click="selectRating(value)"
      >
        <span
          class="nuxt-rating__star"
          :class="value <= displayValue ? 'nuxt-rating__star--active' : 'nuxt-rating__star--inactive'"
        >{{ ratingContent }}</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
.nuxt-rating {
  --rating-letter-spacing: 0.08em;
  position: relative;
  display: inline-grid;
  align-items: center;
  line-height: 1;
  font-size: var(--rating-size);
}

.nuxt-rating:not(.nuxt-rating--readonly) {
  display: inline-flex;
  gap: 0.1em;
}

.nuxt-rating__track,
.nuxt-rating__fill {
  grid-area: 1 / 1;
  white-space: nowrap;
  user-select: none;
  letter-spacing: var(--rating-letter-spacing);
}

.nuxt-rating__track {
  color: var(--rating-inactive-color);
}

.nuxt-rating__fill {
  overflow: hidden;
  color: var(--rating-active-color);
}

.nuxt-rating__button {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  line-height: 1;
}

.nuxt-rating__star {
  display: inline-block;
}

.nuxt-rating__star--active {
  color: var(--rating-active-color);
}

.nuxt-rating__star--inactive {
  color: var(--rating-inactive-color);
}
</style>
