<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useCart from '@/data/cart'

const { getItems: items, getTotal: total, clear } = useCart()
const { stripe } = useClientStripe()

const processing = ref(false)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

let elements: any = null
let clientSecret: string | null = null
let saleId: number | null = null

const config = useRuntimeConfig()
console.log('Stripe PK:', config.public.stripe.publishableKey)

onMounted(async () => {
  if (!stripe.value) { return }

  try {
    // 1️⃣ Create sale
    const saleRes = await $fetch('/api/public/checkout', {
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

    saleId = saleRes.saleId

    // 2️⃣ Create PaymentIntent
    const piRes = await $fetch('/api/public/createPaymentIntent', {
      method: 'POST',
      body: {
        amount: Math.floor(total() * 100),
        currency: 'czk',
        saleId
      }
    })

    clientSecret = piRes.clientSecret
    if (!clientSecret) { throw new Error('Missing client secret') }

    // 3️⃣ Stripe Elements (styled & configured)
    elements = stripe.value.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#2563eb',
          borderRadius: '8px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }
      }
    })

    const paymentElement = elements.create('payment', {
      layout: 'tabs', // Card / Apple Pay / Google Pay
      defaultValues: {
        billingDetails: {
          address: { country: 'CZ' }
        }
      }
    })

    paymentElement.mount('#payment-element')
    loading.value = false
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Nepodařilo se inicializovat platbu.'
    loading.value = false
  }
})

const payNow = async () => {
  if (!stripe.value || !elements || !clientSecret || !saleId) {
    errorMessage.value = 'Platba není připravena.'
    return
  }

  processing.value = true
  errorMessage.value = null

  try {
    const { error } = await stripe.value.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/cart/pay?sale_id=${saleId}`
      }
    })

    if (error) {
      errorMessage.value = error.message ?? 'Platba se nezdařila.'
      processing.value = false
      return
    }

    clear()
  } catch (err: any) {
    console.error(err)
    errorMessage.value = 'Platba se nezdařila.'
  } finally {
    processing.value = false
  }
}

</script>

<template>
  <div>
    <Topbar />

    <div class="max-w-md mx-auto mt-12 bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-2 text-center">
        Dokončení platby
      </h2>

      <p class="text-center text-gray-600 mb-6">
        Celkem k zaplacení
        <span class="font-semibold text-black">
          {{ total().toFixed(2) }} CZK
        </span>
      </p>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="h-12 bg-gray-200 rounded" />
        <div class="h-12 bg-gray-200 rounded" />
        <div class="h-12 bg-gray-200 rounded" />
      </div>

      <!-- Stripe Payment Element -->
      <div
        v-show="!loading"
        id="payment-element"
        class="mb-6"
      />

      <UButton
        block
        size="lg"
        color="primary"
        :loading="processing"
        :disabled="processing || loading"
        @click="payNow"
      >
        Zaplatit
      </UButton>

      <p
        v-if="errorMessage"
        class="text-red-600 text-sm mt-4 text-center"
      >
        {{ errorMessage }}
      </p>

      <p class="text-xs text-gray-400 text-center mt-6">
        Platba je zabezpečena službou Stripe
      </p>
    </div>
  </div>
</template>

  <style scoped>
  #payment-element {
    margin-bottom: 1rem;
  }
  </style>
