<script setup lang="ts">
import { computed } from 'vue'
import useCart from '@/data/cart'

const { getItems, getTotal: total, clear } = useCart()

// ✅ this is the important fix — reactive, instant removal
const items = computed(() =>
  getItems().filter(item => item.count > 0)
)

const increase = (item: any) => {
  item.count++
}

const decrease = (item: any) => {
  if (item.count > 1) {
    item.count--
  } else {
    item.count = 0
  }
}

const removeItem = (item: any) => {
  item.count = 0
}
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100">
    <Topbar />

    <div class="max-w-4xl mx-auto p-6 space-y-4">
      <!-- CART ITEM -->
      <div
        v-for="item in items"
        :key="item.product_id"
        class="flex gap-4 bg-neutral-800 rounded-xl p-4 shadow"
      >
        <!-- IMAGE -->
        <img
          :src="item.image_url || '/placeholder.png'"
          alt=""
          class="w-24 h-24 object-cover rounded-lg"
        >

        <!-- INFO -->
        <div class="flex-1">
          <h3 class="text-lg font-semibold">
            {{ item.product_name }}
          </h3>

          <p class="text-sm text-neutral-400">
            {{ Number(item.price).toFixed(2) }} CZK / ks
          </p>

          <!-- QUANTITY CONTROLS -->
          <div class="flex items-center gap-3 mt-3">
            <button
              class="px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600"
              @click="decrease(item)"
            >
              −
            </button>

            <span class="min-w-[2ch] text-center">
              {{ item.count }}
            </span>

            <button
              class="px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600"
              @click="increase(item)"
            >
              +
            </button>
          </div>
        </div>

        <!-- PRICE + REMOVE -->
        <div class="flex flex-col justify-between items-end">
          <button
            class="text-red-400 hover:text-red-300 text-sm"
            title="Remove item"
            @click="removeItem(item)"
          >
            🗑
          </button>

          <div class="text-lg font-semibold">
            {{ (item.price * item.count).toFixed(2) }} CZK
          </div>
        </div>
      </div>

      <!-- TOTAL -->
      <div class="flex justify-end text-xl font-bold pt-4 border-t border-neutral-700">
        Total: {{ Number(total()).toFixed(2) }} CZK
      </div>

      <!-- ACTIONS -->
      <div class="flex justify-between pt-4">
        <UButton
          class="bg-neutral-700 hover:bg-neutral-600"
          @click="clear()"
        >
          Vyprázdnit košík
        </UButton>

        <UButton
          class="bg-emerald-600 hover:bg-emerald-500"
          @click="navigateTo('/cart/pay')"
        >
          Pokračovat k platbě
        </UButton>
      </div>
    </div>
  </div>
</template>
