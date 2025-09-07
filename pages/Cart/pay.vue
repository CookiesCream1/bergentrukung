<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import useCart from '@/data/cart'

const { getTotal: total, clear } = useCart()
const { stripe } = useClientStripe()

let ClientSecret: string | undefined
const processing = ref(false)
const errorMessage = ref<string | null>(null)
let elements: any = null

// Load payment intent + setup Stripe elements
watch(
  stripe,
  async () => {
    if (stripe.value) {
      try {
        const { clientSecret, error } = await $fetch(
          '/api/public/createPaymentIntent',
          { query: { amount: Math.floor(total() * 100), currency: 'czk' } }
        )

        if (error) {
          console.error(error)
          errorMessage.value = error.message ?? 'Failed to create payment intent.'
          return
        }

        if (clientSecret) {
          ClientSecret = clientSecret
          // Create elements only once
          elements = stripe.value.elements({ clientSecret })
          const paymentElement = elements.create('payment')
          paymentElement.mount('#payment-element')
        }
      } catch (err: any) {
        console.error(err)
        errorMessage.value = 'Unexpected error while creating payment intent.'
      }
    }
  },
  { immediate: true }
)

const payNow = async () => {
  if (!ClientSecret || !stripe.value || !elements) {
    errorMessage.value = 'Stripe not ready yet. Try again in a moment.'
    return
  }

  try {
    processing.value = true
    errorMessage.value = null

    const result = await stripe.value.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/cart/edit'
      }
    })

    if (result.error) {
      console.error(result.error)
      errorMessage.value = result.error.message ?? 'Payment failed. Please try again.'
    }
  } catch (err: any) {
    console.error(err)
    errorMessage.value = 'Payment failed. Please try again.'
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div>
    <Topbar />

    <div class="p-6 max-w-lg mx-auto">
      <h2 class="text-2xl font-bold mb-4">
        Platba
      </h2>

      <div class="mb-4">
        <p class="text-lg">
          Cena: <span class="font-semibold">{{ total() }} CZK</span>
        </p>
      </div>

      <div id="payment-element" class="mb-4">
        <!-- Stripe injects Payment Element here -->
      </div>

      <UButton
        class="px-4 py-2 bg-blue-600 text-white rounded-md"
        :disabled="processing"
        @click="payNow"
      >
        {{ processing ? 'Processing...' : 'Zaplatit' }}
      </UButton>

      <div v-if="errorMessage" class="text-red-600 mt-3">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#payment-element {
  margin-top: 1rem;
}
</style>
