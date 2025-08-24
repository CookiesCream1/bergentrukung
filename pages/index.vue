<script setup lang="ts">
import { ref, computed } from 'vue'
import Topbar from '~/components/Topbar.vue'
import ProductSquare from '~/components/ProductSquare.vue'

definePageMeta({ auth: false })

// Fetch categories and products
const { data: fetchedCategories } = await useFetch('/api/public/category')
const { data: fetchedProducts } = await useFetch('/api/public/products')

// Ensure they are arrays
const categories = computed(() =>
  Array.isArray(fetchedCategories.value) ? fetchedCategories.value : []
)
const products = computed(() =>
  Array.isArray(fetchedProducts.value) ? fetchedProducts.value : []
)

// Selected categories for filtering
const selectedCategories = ref<string[]>([])

// Filtered products based on selected categories
const filteredProducts = computed(() => {
  if (!selectedCategories.value.length) { return products.value }
  return products.value.filter(p =>
    selectedCategories.value.includes(p.category_name ?? p.category)
  )
})

// Toggle category selection
function toggleCategory (name: string) {
  if (selectedCategories.value.includes(name)) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== name)
  } else {
    selectedCategories.value.push(name)
  }
}
</script>

<template>
  <div class="toplevel">
    <Topbar class="topbar" />

    <div class="sidebar">
      <div v-if="categories.length">
        <div
          v-for="cat in categories"
          :key="cat.category_id ?? cat.name"
          style="margin-bottom: 0.5rem;"
        >
          <input
            :id="cat.name"
            type="checkbox"
            :value="cat.name"
            @change="toggleCategory(cat.name)"
          >
          <label :for="cat.name">{{ cat.name }}</label>
        </div>
      </div>
      <div v-else>
        Issue retrieving categories
      </div>
    </div>

    <div class="main">
      <ProductSquare
        v-for="product in filteredProducts"
        :key="product.product_id ?? product.name"
        v-bind="product"
      />
    </div>
  </div>
</template>

<style scoped>
.toplevel {
  display: grid;
  grid-template-columns: 16rem 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "topbar topbar"
    "sidebar main";
  gap: 1rem;
}

.topbar {
  grid-area: topbar;
}

.sidebar {
  grid-area: sidebar;
  padding: 1rem;
  border-right: 1px solid #ccc;
}

.main {
  grid-area: main;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 1rem;
}
</style>
