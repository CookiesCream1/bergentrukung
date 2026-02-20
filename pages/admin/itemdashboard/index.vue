<script setup lang="ts">
import TopBar from '@/components/Topbar.vue'

const { data: products, refresh } = await useFetch('/api/admin/products', {
  lazy: true
})

const toggle = (id: number, OnOff: boolean) => {
  $fetch('/api/admin/products', {
    method: 'PATCH',
    body: { id, OnOff }
  }).then(() => refresh())
}
</script>

<template>
  <div class="admin-page">
    <TopBar />

    <!-- HEADER -->
    <div class="admin-header">
      <h1>Product administration</h1>

      <NuxtLink to="itemdashboard/new" class="btn primary">
        + Add new product
      </NuxtLink>
    </div>

    <!-- PRODUCT LIST -->
    <ul class="product-grid">
      <li
        v-for="product in products"
        :key="product.productId"
        class="product-card"
      >
        <div class="info">
          <p class="name">
            {{ product.productName }}
          </p>

          <span
            class="status"
            :class="product.removed ? 'removed' : 'active'"
          >
            {{ product.removed ? 'REMOVED' : 'ACTIVE' }}
          </span>
        </div>

        <div class="actions">
          <button
            class="btn success"
            :disabled="product.removed === 0"
            @click="toggle(product.productId, true)"
          >
            Add back
          </button>

          <button
            class="btn danger"
            :disabled="product.removed === 1"
            @click="toggle(product.productId, false)"
          >
            Remove
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* PAGE */
.admin-page {
  min-height: 100vh;
  background: #0f172a;
  color: #e5e7eb;
}

/* HEADER */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
}

.admin-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

/* GRID */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 24px;
}

/* CARD */
.product-card {
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.35);
}

/* INFO */
.info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.name {
  font-weight: 600;
  font-size: 1.05rem;
}

/* STATUS */
.status {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 999px;
  width: fit-content;
}

.status.active {
  background: rgba(34,197,94,0.15);
  color: #22c55e;
}

.status.removed {
  background: rgba(239,68,68,0.15);
  color: #ef4444;
}

/* ACTIONS */
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* BUTTONS */
.btn {
  border: none;
  padding: 8px 14px;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn.primary {
  background: #22c55e;
  color: #022c22;
}

.btn.success {
  background: #16a34a;
  color: white;
}

.btn.danger {
  background: #dc2626;
  color: white;
}

.btn:hover:not(:disabled) {
  filter: brightness(1.1);
}
</style>
