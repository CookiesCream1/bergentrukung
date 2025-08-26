<script setup lang="ts">
import { ref, computed } from 'vue'
import Topbar from '~/components/Topbar.vue'
import Categories from '~/components/Categories.vue'
import ProductSquare from '~/components/ProductSquare.vue'

definePageMeta({
  auth: false
})

// SEARCH state
const search = ref('')

// Fetch categories and products safely
const { data: categoriesData, pending: categoriesPending, error: categoriesError } = useFetch('/api/public/category', { initialCache: false })
const { data: productsData, pending: productsPending, error: productsError } = useFetch('/api/public/products', { initialCache: false })

// Computed reactive filtered products (always return an array)
const filteredProducts = computed(() => {
  const products = productsData.value ?? []
  if (!search.value) { return products }
  return products.filter(product =>
    product?.productName?.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Computed categories array (unwrap API object)
const categories = computed(() => {
  if (!categoriesData.value) { return [] }
  return categoriesData.value.categories ?? []
})
</script>

<template>
  <div class="toplevel">
    <Topbar v-model="search" class="topbar" />

    <div class="sidebar">
      <template v-if="categoriesPending">
        Loading categories...
      </template>
      <template v-else-if="categoriesError">
        Failed to load categories
      </template>
      <template v-else>
        <Categories
          v-for="category in categories"
          :key="category?.name || category?.id"
          v-bind="category"
        />
      </template>
    </div>

    <div class="main">
      <template v-if="productsPending">
        Loading products...
      </template>
      <template v-else-if="productsError">
        Failed to load products
      </template>
      <template v-else-if="(filteredProducts?.length ?? 0) === 0">
        No products found.
      </template>
      <template v-else>
        <ProductSquare
          v-for="product in filteredProducts"
          :key="product?.productId || product?.name"
          v-bind="product"
        />
      </template>
    </div>
  </div>
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
  height: 100vh;
}

.topbar {
  grid-area: topbar;
}

.sidebar {
  grid-area: sidebar;
  padding: 1rem;
  width: 16rem;
  overflow-y: auto;
}

.main {
  grid-area: main;
  padding: 1rem;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
  justify-content: start;
}

/* Make all ProductSquares consistent size */
.main > * {
  width: 256px;
  height: 400px; /* adjust as needed */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Optional: make images scale nicely */
.main > * img {
  object-fit: cover;
  width: 100%;
  height: 200px;
  border-radius: 4px;
}
</style>
