<script setup lang="ts">
import useCart from '@/data/cart'
const { getItems: items, getTotal: total, clear } = useCart()
const cfg = useRuntimeConfig()
const stripe = await useClientStripe().loadStripe(cfg.public.stripe.key)
const checkout = async () => {
  const { clientSecret, error } = await $fetch(
    '/api/public/createPaymentIntent',
    { query: { amount: Math.floor(total() * 100), currency: 'czk' } }
  )
  if (error) {
    console.error(error)
    return
  }
  if (clientSecret === undefined) {
    return
  }
  stripe?.redirectToCheckout({
    successUrl: '/cart/edit',
    cancelUrl: '/'
  })
}
</script>

<template>
  <div>
    <Topbar />
    <div
      v-for="item of items()"
      :key="item.product_name"
      class="temdisp flex items-center justify-between p-4 shadow rounded-lg"
    >
      <div>
        {{ item.product_name }}
      </div>
      <span class="font-semibold">
        <div>
          price:
          {{ item.price }}
        </div>
      </span>
    </div>
    <div class="flex justify-end" style="margin-right: 20px">
      total of: {{ total() }}
    </div>
    <br>
    <div class="checkoutzone">
      <UButton class="px-2 py-1 bg-gray-200 rounded-md" @click="clear()">
        clear cart
      </UButton>
      <UButton class="px-2 py-1 bg-gray-200 rounded-md" @click="checkout">
        checkout
      </UButton>
    </div>
  </div>
</template>
