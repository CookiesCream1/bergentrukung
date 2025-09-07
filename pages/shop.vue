<script setup lang="ts">
import { ref, computed } from 'vue'
import Topbar from '~/components/Topbar.vue'
import ProductSquare from '~/components/ProductSquare.vue'

definePageMeta({
  auth: false
})

// SEARCH state
const search = ref('')

// Fetch products only (no categories anymore)
const { data: productsData, pending: productsPending, error: productsError } = useFetch('/api/public/products', { initialCache: false })

// Computed reactive filtered products
const filteredProducts = computed(() => {
  const products = productsData.value ?? []
  if (!search.value) { return products }
  return products.filter(product =>
    product?.productName?.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <body>
    <div class="toplevel bg-gray-900 text-gray-100">
      <!-- Topbar -->
      <Topbar v-model="search" class="topbar bg-gray-800 shadow" />

      <!-- Sidebar replaced with Adspace -->
      <aside class="sidebar bg-gray-900 border-r border-gray-700 flex items-center justify-center">
        <div class="adbox bg-gray-800 rounded-lg shadow p-4 text-center">
          <p class="text-gray-400 text-sm">
            Reklamní prostor
          </p>
          <div class="h-48 w-32 bg-gray-700 mt-2 rounded flex items-center justify-center text-xs text-gray-500">
            Banner 600
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="main bg-gray-900">
        <template v-if="productsPending">
          <p class="text-gray-400">
            Načítám produkty...
          </p>
        </template>
        <template v-else-if="productsError">
          <p class="text-red-400">
            Nepodařilo se načíst produkty.
          </p>
        </template>
        <template v-else-if="(filteredProducts?.length ?? 0) === 0">
          <p class="text-gray-400">
            Žádné produkty nebyly nalezeny.
          </p>
        </template>
        <template v-else>
          <ProductSquare
            v-for="product in filteredProducts"
            :key="product?.productId || product?.name"
            v-bind="product"
            class="bg-gray-800 text-gray-100 rounded-lg shadow hover:shadow-lg transition"
          />
        </template>
      </main>
    </div>
  </body>
</template>
<style scoped>

.toplevel {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "topbar topbar"
    "sidebar main";
  gap: 1rem;

  background-color: #111827; /* single full dark background */
  color: #f3f4f6; /* text color */
}

.topbar {
  grid-area: topbar;
}

.sidebar {
  grid-area: sidebar;
  padding: 1rem;
  width: 16rem;
  overflow-y: auto;
  /* no background here */
}

.main {
  grid-area: main;
  padding: 1rem;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
  justify-content: start;
  /* no background here */
}

/* Product cards */
.main > * {
  width: 256px;
  height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #374151;
  background-color: #1f2937; /* only cards have dark box */
  border-radius: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.main > *:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.main > * img {
  object-fit: cover;
  width: 100%;
  height: 200px;
  border-radius: 0.375rem;
}
.body{
 background-color: #1f2937;
}
</style>
