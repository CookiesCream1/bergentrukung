<script setup lang="ts">
import { useRoute } from 'vue-router'
import useCart from '@/data/cart'
import Topbar from '~/components/Topbar.vue'

const route = useRoute()
const cart = useCart()

// Hardcoded product images (no DB images)
const imageFiles = [
  '1d0877fbfab4d58dbbfe58bf5a54207a',
  '4fb99ce8ab6f6483c176eb30fb627a9c',
  '5bd6e815c7daf654e118cc82f80be80a',
  '5f06db0dd6a8067338fbfa3fa6ae6676',
  '8e494f394f50ee3877c607c90b65312c',
  '80ba153dab6f568579fbda44d7bf7b78'
]

const randomImg = imageFiles[Math.floor(Math.random() * imageFiles.length)]

// Fetch product data
const { data: product, pending, error } = await useAsyncData(
  `product-${route.params.id}`,
  async () => {
    try {
      return await $fetch(`/api/products/${route.params.id}`)
    } catch (err) {
      console.error('Product fetch error:', err)
      return null
    }
  }
)
</script>

<template>
  <div class="toplevel bg-gray-900 text-gray-100 min-h-screen">
    <!-- Topbar -->
    <Topbar class="topbar bg-gray-800 shadow" />

    <!-- Main Content -->
    <main class="main bg-gray-900 p-6">
      <div v-if="pending" class="text-gray-400 text-center py-10">
        Načítám produkt...
      </div>

      <div v-else-if="error || !product" class="text-red-400 text-center py-10">
        Nepodařilo se načíst produkt.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <!-- Left: Product Image -->
        <div class="product-image-wrapper">
          <img
            :src="`/img/${randomImg}.jpg`"
            alt="Product image"
            class="product-image"
          >
        </div>

        <!-- Right: Product Info -->
        <div class="flex flex-col gap-4">
          <h1 class="text-4xl font-bold text-gray-100">
            {{ product.productName }}
          </h1>

          <!-- Only stars, no numeric value -->
          <div class="flex items-center gap-2">
            <NuxtRating :read-only="true" :rating-value="product.rating" />
          </div>

          <p class="text-gray-300 text-lg">
            {{ product.description }}
          </p>

          <!-- Price -->
          <div
            class="flex items-baseline gap-2 text-3xl font-bold text-gray-100"
          >
            <span>{{ Math.floor(product.price) }}</span>
            <span class="text-xl font-normal">
              .{{ (+product.price).toFixed(2).split(".")[1] }} CZK
            </span>
          </div>

          <!-- Add to Cart -->
          <UButton
            class="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            @click="
              cart.addItem(
                {
                  product_id: product.productId,
                  product_name: product.productName,
                  price: product.price,
                },
                1
              )
            "
          >
            Přidat do košíku
          </UButton>

          <!-- Extra Info -->
          <div class="mt-6 p-4 bg-gray-800 rounded-lg text-gray-300">
            <h2 class="text-xl font-semibold mb-2 text-emerald-400">
              Informace o produktu
            </h2>
            <ul class="list-disc list-inside">
              <li>Product ID: {{ product.productId }}</li>
              <li v-if="product.removed">
                Tento produkt již není dostupný
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.toplevel {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "topbar"
    "main";
  gap: 1rem;
}

.topbar {
  grid-area: topbar;
}

.main {
  grid-area: main;
  display: grid;
  gap: 1.5rem;
}

.product-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.product-image {
  max-width: 400px; /* prevent it from being too wide */
  height: auto;
  border-radius: 0.5rem;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}
</style>
