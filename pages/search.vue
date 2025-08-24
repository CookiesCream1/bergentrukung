<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const products = ref([])

const fetchProducts = async (query: string) => {
  if (!query) {
    products.value = []
    return
  }
  const { data } = await useFetch(`/api/search?query=${encodeURIComponent(query)}`)
  products.value = data.value?.products || []
}

// Watch the query parameter
watch(
  () => route.query.query,
  (newQuery) => {
    fetchProducts(newQuery as string)
  },
  { immediate: true } // fetch immediately on mount if query exists
)
</script>

<template>
  <div>
    <h1>Search Results</h1>
    <p v-if="!products.length">
      No products found.
    </p>
    <ul v-else>
      <li v-for="product in products" :key="product.product_id">
        <strong>{{ product.product_name }}</strong>: {{ product.description }}
      </li>
    </ul>
  </div>
</template>
