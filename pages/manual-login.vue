<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '#imports'

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: 'shop'
  }
})

const router = useRouter()
const { signIn } = useAuth()

// form state
const isSignup = ref(false)
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

// toggle
function toggleMode () {
  isSignup.value = !isSignup.value
  error.value = ''
  success.value = ''
  email.value = ''
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
}

// SUBMIT HANDLER
async function handleSubmit () {
  error.value = ''
  success.value = ''

  // SIGNUP
  if (isSignup.value) {
    if (!email.value || !username.value || !password.value || !confirmPassword.value) {
      error.value = 'Vyplňte prosím všechna pole.'
      return
    }
    if (password.value !== confirmPassword.value) {
      error.value = 'Hesla se neshodují.'
      return
    }

    try {
      const res = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: {
          email: email.value,
          username: username.value,
          password: password.value
        }
      })

      if ((res as any)?.error) {
        error.value = (res as any).error
        return
      }

      success.value = 'Účet byl vytvořen! Nyní se přihlaste.'
      toggleMode()
    } catch (err) {
      console.error(err)
      error.value = 'Nastala chyba při komunikaci se serverem.'
    }

    return
  }

  // LOGIN — FIXED (Nuxt Auth)
  if (!email.value || !password.value) {
    error.value = 'Vyplňte prosím e-mail a heslo.'
    return
  }

  try {
    const res = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: false
    })

    if (res?.error) {
      error.value = 'Neplatný e-mail nebo heslo.'
      return
    }

    router.push('/shop')
  } catch (err) {
    console.error(err)
    error.value = 'Chyba při přihlašování.'
  }
}
</script>

<template>
  <div class="toplevel">
    <Topbar class="topbar" />

    <div class="login-container">
      <form class="login-box" @submit.prevent="handleSubmit">
        <h2>{{ isSignup ? 'Vytvoření účtu' : 'Přihlášení' }}</h2>

        <input v-model="email" type="text" placeholder="E-mail">
        <input
          v-if="isSignup"
          v-model="username"
          type="text"
          placeholder="Uživatelské jméno"
        >
        <input v-model="password" type="password" placeholder="Heslo">
        <input
          v-if="isSignup"
          v-model="confirmPassword"
          type="password"
          placeholder="Potvrzení hesla"
        >

        <button type="submit">
          {{ isSignup ? 'Vytvořit účet' : 'Přihlásit se' }}
        </button>

        <p v-if="error" class="error">
          {{ error }}
        </p>
        <p v-if="success" class="success">
          {{ success }}
        </p>

        <div class="switch-mode">
          <span v-if="!isSignup">
            Ještě nemáte účet?
            <a href="#" @click.prevent="toggleMode">Zaregistrujte se</a>
          </span>
          <span v-else>
            Už máte účet?
            <a href="#" @click.prevent="toggleMode">Přihlaste se</a>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.toplevel {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  color: #eee;
}

.topbar {
  flex: 0 0 auto;
  background: #1c1c1c;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: #1e1e1e;
  padding: 2rem 3rem;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #fafafa;
}

.login-box input {
  background: #2a2a2a;
  border: 1px solid #444;
  color: #eee;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
}

.login-box input:focus {
  outline: none;
  border-color: #5a5a5a;
  background: #333;
}

.login-box button {
  background: #3a3aff;
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
}

.login-box button:hover {
  background: #5757ff;
}

.error {
  text-align: center;
  color: #ff4d4d;
  margin-top: 0.5rem;
}

.success {
  text-align: center;
  color: #4dff4d;
  margin-top: 0.5rem;
}

.switch-mode {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.switch-mode a {
  color: #3a3aff;
  text-decoration: none;
  font-weight: bold;
}

.switch-mode a:hover {
  text-decoration: underline;
}
</style>
