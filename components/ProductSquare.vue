<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  productId: number
  productName: string
  description: string
  price: number
  rating: number
}>()

// Hardcoded list of image filenames (from public/img/)
const imageFiles = [
  '1d0877fbfab4d58dbbfe58bf5a54207a',
  '4fb99ce8ab6f6483c176eb30fb627a9c',
  '5bd6e815c7daf654e118cc82f80be80a',
  '5f06db0dd6a8067338fbfa3fa6ae6676',
  '8e494f394f50ee3877c607c90b65312c',
  '80ba153dab6f568579fbda44d7bf7b78'
]

const randomImg = imageFiles[Math.floor(Math.random() * imageFiles.length)]
</script>

<template>
  <NuxtLink :to="`/product/${productId}`" class="boundingbox">
    <img
      :src="`/img/${randomImg}.jpg`"
      class="product-image"
      alt="Product image"
    >
    <h3 class="mt-2 px-2 text-lg font-semibold text-gray-100">
      {{ productName }}
    </h3>
    <div class="starfix mt-1 px-2">
      <NuxtRating :read-only="true" :rating-value="rating" />
    </div>
    <p class="px-2 text-sm text-gray-300 mt-1">
      {{ description }}
    </p>
    <div class="priceContainer px-2 mt-2">
      <div style="font-size: 2em; line-height: 2rem;">
        {{ Math.floor(price) }}
      </div>
      <div>
        {{ "." + (+price).toFixed(2).split(".")[1] }}
      </div>
      <div>CZK</div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.boundingbox {
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: #1f2937;
  padding: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
}
.boundingbox:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.priceContainer {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
