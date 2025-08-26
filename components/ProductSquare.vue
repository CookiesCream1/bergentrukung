<script setup lang="ts">
import useCart from '@/data/cart'

defineProps<{
  productId: number
  productName: string
  description: string
  price: number
  rating: number
}>()

const cart = useCart()

// Hardcoded list of image filenames (from public/img/)
const imageFiles = [
  '1d0877fbfab4d58dbbfe58bf5a54207a',
  '4fb99ce8ab6f6483c176eb30fb627a9c',
  '5bd6e815c7daf654e118cc82f80be80a',
  '5f06db0dd6a8067338fbfa3fa6ae6676',
  '8e494f394f50ee3877c607c90b65312c',
  '80ba153dab6f568579fbda44d7bf7b78',
  '83aa1734a1a1303d2b0f1153baabd259',
  '5763bba08e0142329fe8fcfe7d389590',
  '338797d618ac97d97bb693e48cb3af9e',
  '5114511630033b851b078ce496979c92',
  'c686ac45baf0676ab66df99310fa0ff6',
  'cd0d37cdd70dfdecd6ba613323a8ca73',
  'faaeec62a40d3de50f95fe420405adde'
]

// Function to pick a random image for this instance
function pickRandomImage () {
  return imageFiles[Math.floor(Math.random() * imageFiles.length)]
}

// Each component instance gets its own random image
const randomImg = pickRandomImage()
</script>

<template>
  <div class="boundingbox">
    <img
      :src="`/img/${randomImg}.jpg`"
      class="product-image"
      alt="Product image"
    >
    <h3 style="padding-left: 5%">
      {{ productName }}
    </h3>
    <div class="starfix">
      <NuxtRating :read-only="true" :rating-value="rating" />
    </div>
    <p>{{ description }}</p>
    <div class="priceContainer">
      <div style="font-size: 2em; line-height: 2rem">
        {{ Math.floor(price) }}
      </div>
      <div>
        {{ "." + (+price).toFixed(2).split(".")[1] }}
      </div>
      <div>CZK</div>
    </div>
    <div
      class="px-2 py-1 bg-gray-200 rounded-md w-full flex justify-end bottom-0 right-0"
      style="background-color: antiquewhite; margin-bottom: 10px;"
    >
      <UButton
        class="px-2 py-1 bg-gray-200 rounded-md"
        @click="cart.addItem({ product_id: productId, product_name: productName, price }, 1)"
      >
        buy
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.boundingbox {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
