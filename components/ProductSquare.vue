<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    productId: number
    productName: string
    description?: string | null
    price: number
    rating: number
    imageName?: string | null
    image_name?: string | null
  }>()

// normalize image name (snake_case OR camelCase)
const normalizedImageName = computed(() => {
  return props.imageName || props.image_name || null
})

const imageSrc = computed(() => {
  if (!normalizedImageName.value) {
    return '/img/placeholder.jpg'
  }

  return normalizedImageName.value.endsWith('.jpg')
    ? `/img/${normalizedImageName.value}`
    : `/img/${normalizedImageName.value}.jpg`
})
</script>

<template>
  <NuxtLink
    :to="`/product/${productId}`"
    class="boundingbox"
  >
    <img
      :src="imageSrc"
      class="product-image"
      alt="Product image"
      loading="lazy"
    >

    <h3 class="mt-2 px-2 text-lg font-semibold text-neutral-100">
      {{ productName }}
    </h3>

    <div class="starfix mt-1 px-2">
      <NuxtRating
        :read-only="true"
        :rating-value="rating"
      />
    </div>

    <p
      v-if="description"
      class="px-2 text-sm text-neutral-300 mt-1 line-clamp-3"
    >
      {{ description }}
    </p>

    <div class="priceContainer px-2 mt-3">
      <span class="text-2xl">
        {{ Math.floor(price) }}
      </span>
      <span class="text-lg">
        .{{ (+price).toFixed(2).split('.')[1] }}
      </span>
      <span class="text-sm">CZK</span>
    </div>
  </NuxtLink>
</template>

  <style scoped>
  .boundingbox {
    border: 1px solid var(--border);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-panel);
    padding: 1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    text-decoration: none;
  }

  .boundingbox:hover {
    transform: translateY(-2px);
    border-color: var(--zamazon-green);
    box-shadow: 0 8px 20px rgba(74, 222, 128, 0.25);
  }

  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    background-color: #111;
  }

  .priceContainer {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    font-weight: bold;
    color: var(--zamazon-green);
  }
  </style>
