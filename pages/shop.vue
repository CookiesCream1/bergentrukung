<script setup lang="ts">
import { ref, computed } from 'vue'
import Topbar from '~/components/Topbar.vue'
import ProductSquare from '~/components/ProductSquare.vue'

definePageMeta({
  auth: false
})

const search = ref('')

// Fetch products only
const { data: productsData, pending: productsPending, error: productsError } =
  useFetch('/api/public/products')

const filteredProducts = computed(() => {
  const products = productsData.value ?? []
  if (!search.value) { return products }
  return products.filter(product =>
    product?.productName?.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <div class="toplevel">
    <!-- Topbar -->
    <div class="topbar-area">
      <Topbar v-model="search" />
    </div>

    <!-- Sidebar Ads -->
    <aside class="sidebar">
      <div class="adbox">
        <p class="text-gray-400 text-sm">
          Reklamní prostor
        </p>
        <div class="adbanner">
          Banner 600
        </div>
      </div>
    </aside>

    <!-- Main Product Grid -->
    <main class="main">
      <template v-if="productsPending">
        <p class="loading">
          Načítám produkty...
        </p>
      </template>

      <template v-else-if="productsError">
        <p class="error">
          Nepodařilo se načíst produkty.
        </p>
      </template>

      <template v-else-if="(filteredProducts?.length ?? 0) === 0">
        <p class="empty">
          Žádné produkty nebyly nalezeny.
        </p>
      </template>

      <template v-else>
        <ProductSquare
          v-for="p in filteredProducts"
          :key="p.productId"
          v-bind="p"
        />
      </template>
    </main>
  </div>
</template>

<style scoped>
/* OVERALL GRID */
.toplevel {
  height: 100%;
  display: grid;
  grid-template-columns: 16rem 1fr;
  grid-template-rows: auto 1fr;

  grid-template-areas:
    "topbar topbar"
    "sidebar main";

  gap: 1rem;

  background-color: var(--bg-dark);
  color: var(--text-main);
  padding: 0; /* no random body padding */
}

/* AREA MAPPING */
.topbar-area {
  grid-area: topbar;
}

.sidebar {
  grid-area: sidebar;
  padding: 1rem;
  border-right: 1px solid var(--border);
}

.main {
  grid-area: main;
  padding: 1rem;

  display: grid;
  gap: 1.5rem;

  /* Responsive product grid */
  grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
}

/* ADS */
.adbox {
  background-color: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
}

.adbanner {
  margin-top: 1rem;
  height: 200px;
  width: 100%;
  background: var(--bg-deeper);
  border-radius: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

/* States */
.loading,
.error,
.empty {
  color: var(--text-secondary);
}
.error {
  color: #f87171;
}
</style>
