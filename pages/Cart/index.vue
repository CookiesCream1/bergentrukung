<script setup lang="ts">
import { ref, watch } from 'vue'
import useCart from '@/data/cart'

const { getItems: items, getTotal: total, clear } = useCart()
const { stripe } = useClientStripe()
let ClientSecret: string | undefined
const showOverrideButton = ref(false)

const checkout = () => {
  showOverrideButton.value = true
  if (ClientSecret === undefined) { return }
  stripe.value.confirmPayment({
    clientSecret: ClientSecret,
    confirmParams: { return_url: 'https://www.google.com/' }
  })
}

watch(
  stripe,
  async () => {
    if (stripe.value) {
      const { clientSecret, error } = await $fetch('/api/public/createPaymentIntent', {
        query: { amount: Math.floor(total() * 100), currency: 'czk' }
      })
      if (error) { console.error(error) }
      if (clientSecret !== null) { ClientSecret = clientSecret }
    }
  },
  { immediate: true }
)

const override = async () => {
  try {
    const response = await $fetch('/api/public/checkout', {
      method: 'POST',
      body: {
        total_price: total(),
        product_arr: items().map(v => ({
          product_id: v.product_id,
          price: v.price,
          count: v.count
        }))
      }
    })

    const { saleId } = response
    clear()
    await navigateTo({ path: '/cart/edit', query: { sale_id: saleId } })
  } catch (error) {
    console.error('Checkout failed:', error)
  }
}
</script>

<template>
  <div>
    <Topbar />

    <div v-for="item of items()" :key="item.product_id" class="temdisp flex items-center justify-between p-4 shadow rounded-lg">
      <div class="flex items-center gap-2">
        <span class="font-semibold">{{ item.product_name }}</span>
        <span class="text-gray-400">×{{ item.count }}</span> <!-- Counter -->
      </div>
      <span class="font-semibold">{{ (item.price * item.count).toFixed(2) }} CZK</span>
    </div>

    <div class="flex justify-end mt-4" style="margin-right: 20px">
      Total: {{ total().toFixed(2) }} CZK
    </div>

    <div class="checkoutzone mt-4">
      <UButton class="px-2 py-1 bg-gray-200 rounded-md" @click="clear()">
        Clear cart
      </UButton>
      <UButton class="px-2 py-1 bg-gray-200 rounded-md" @click="navigateTo('Cart/pay')">
        Checkout
      </UButton>
    </div>

    <div v-if="showOverrideButton" class="flex justify-end mt-4">
      <UButton class="px-2 py-1 bg-red-500 text-white rounded-md" @click="override">
        Override
      </UButton>
    </div>

    <div id="linkAuthenticationElement" />
  </div>
</template>
