<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type AuthResponse = {
  error?: string
  token?: string
}

const router = useRouter()
const authState = useAuthState()
const { getSession, signIn, signUp } = useAuth()

const isSignup = ref(false)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

function resetMessages () {
  error.value = ''
  success.value = ''
}

function toggleMode () {
  isSignup.value = !isSignup.value
  resetMessages()
  password.value = ''
  confirmPassword.value = ''
}

async function handleSubmit () {
  resetMessages()

  if (!email.value || !password.value) {
    error.value = 'Vyplnte prosim e-mail a heslo.'
    return
  }

  if (isSignup.value) {
    if (password.value !== confirmPassword.value) {
      error.value = 'Hesla se neshoduji.'
      return
    }

    try {
      const res = await signUp(
        {
          email: email.value,
          password: password.value
        },
        {
          preventLoginFlow: true
        }
      ) as AuthResponse | undefined

      if (res?.error) {
        error.value = res.error
        return
      }

      success.value = 'Ucet byl vytvoren. Nyni se prihlaste.'
      isSignup.value = false
      password.value = ''
      confirmPassword.value = ''
      return
    } catch (signupError) {
      console.error(signupError)
      error.value = 'Registrace se nezdarila.'
      return
    }
  }

  try {
    const res = await signIn(
      {
        email: email.value,
        password: password.value
      },
      {
        redirect: false,
        callGetSession: false
      }
    ) as AuthResponse | undefined

    if (res?.error || !res?.token) {
      authState.clearToken()
      error.value = res?.error ?? 'Neplatny e-mail nebo heslo.'
      return
    }

    const session = await getSession()

    if (!session) {
      authState.clearToken()
      error.value = 'Nepodarilo se nacist prihlaseni.'
      return
    }

    await router.push('/shop')
  } catch (signinError) {
    console.error(signinError)
    authState.clearToken()
    error.value = 'Chyba pri prihlasovani.'
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <p class="login-copy">
      {{ isSignup ? 'Vytvorte si ucet pomoci e-mailu a hesla.' : 'Prihlaste se pomoci e-mailu a hesla.' }}
    </p>

    <label class="field">
      <span>E-mail</span>
      <input v-model="email" type="email" autocomplete="email" placeholder="vas@email.cz">
    </label>

    <label class="field">
      <span>Heslo</span>
      <input v-model="password" type="password" :autocomplete="isSignup ? 'new-password' : 'current-password'" placeholder="********">
    </label>

    <label v-if="isSignup" class="field">
      <span>Potvrzeni hesla</span>
      <input v-model="confirmPassword" type="password" autocomplete="new-password" placeholder="********">
    </label>

    <button type="submit" class="submit">
      {{ isSignup ? 'Vytvorit ucet' : 'Prihlasit se' }}
    </button>

    <p v-if="error" class="message error">
      {{ error }}
    </p>

    <p v-if="success" class="message success">
      {{ success }}
    </p>

    <button type="button" class="switch-mode" @click="toggleMode">
      {{ isSignup ? 'Uz mate ucet? Prihlaste se.' : 'Nemate ucet? Zaregistrujte se.' }}
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-copy {
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
  line-height: 1.5;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #d1d5db;
  font-size: 0.95rem;
}

.field input {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f9fafb;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus {
  outline: none;
  border-color: rgba(74, 222, 128, 0.65);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.18);
}

.submit {
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: #04130a;
  font-weight: 700;
  padding: 0.9rem 1rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(34, 197, 94, 0.2);
}

.message {
  margin: 0;
  font-size: 0.95rem;
}

.error {
  color: #fca5a5;
}

.success {
  color: #86efac;
}

.switch-mode {
  align-self: flex-start;
  padding: 0;
  border: none;
  background: transparent;
  color: #4ade80;
  cursor: pointer;
  font-size: 0.95rem;
}

.switch-mode:hover {
  color: #86efac;
}
</style>
