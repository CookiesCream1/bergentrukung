<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import useCart from '@/data/cart'

const cfg = useRuntimeConfig()
const stripe = await useClientStripe().loadStripe(cfg.public.stripe.key)

const cardName = ref('')
const cardNumber = ref('')
const expMonth = ref('')
const expYear = ref('')
const cvv = ref('')

const cart = useCart()

const submitPayment = async () => {
  // Simple validation
  if (!cardName.value || !cardNumber.value || !expMonth.value || !expYear.value || !cvv.value) {
    alert('Please fill in all payment fields!')
    return
  }

  try {
    const { clientSecret, error } = await $fetch('/api/public/createPaymentIntent', {
      query: { amount: Math.floor(cart.getTotal() * 100), currency: 'czk' }
    })

    if (error) {
      console.error(error)
      return
    }

    if (!clientSecret) { return }

    stripe?.redirectToCheckout({
      successUrl: '/cart/edit',
      cancelUrl: '/'
    })
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="payment-form">
    <h2>Payment Details</h2>

    <label>Name on Card:</label>
    <UInput v-model="cardName" placeholder="John Doe" />

    <label>Card Number:</label>
    <UInput v-model="cardNumber" placeholder="1111-2222-3333-4444" maxlength="19" />

    <div class="flex">
      <div>
        <label>Exp Month:</label>
        <select v-model="expMonth">
          <option value="">
            Month
          </option>
          <option v-for="m in 12" :key="m" :value="m">
            {{ m }}
          </option>
        </select>
      </div>

      <div>
        <label>Exp Year:</label>
        <select v-model="expYear">
          <option value="">
            Year
          </option>
          <option v-for="y in 10" :key="y" :value="2024 + y - 1">
            {{ 2024 + y - 1 }}
          </option>
        </select>
      </div>

      <div>
        <label>CVV:</label>
        <UInput v-model="cvv" type="number" placeholder="123" />
      </div>
    </div>

    <UButton @click="submitPayment">
      Checkout
    </UButton>
  </div>
</template>

<style scoped>
.payment-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flex {
  display: flex;
  gap: 10px;
}

.flex > div {
  flex: 1;
}
</style>
