<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth' // adjust import if different

const { setUser } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Vyplňte prosím obě pole.'
    return
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json()

    if (!res.ok) {
      error.value = data.message || 'Chyba přihlášení'
      return
    }

    // Update auth state (so topbar auto-updates)
    setUser(data.user)
  } catch (e) {
    error.value = 'Chyba serveru'
    console.error(e)
  }
}
</script>

<template>
  <form class="spinnin login" @submit.prevent="handleLogin">
    <label>
      <span>Email</span>
      <input v-model="email" type="email" class="loginInput">
    </label>

    <label>
      <span>Heslo</span>
      <input v-model="password" type="password" class="loginInput">
    </label>

    <p v-if="error" style="color: red; font-size: 0.9rem;">
      {{ error }}
    </p>

    <button type="submit" class="submit">
      Přihlásit idiot
    </button>
  </form>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: antiquewhite;
  color: grey;
  text-shadow: 0 1px 0 #000;
  padding: 2rem;
  border-radius: 2rem;
}

.spinnin {
  --border-angle: 0turn;
  --main-bg: conic-gradient(
    from var(--border-angle),
    #213,
    #112 5%,
    #112 60%,
    #213 95%
  );
  border: solid 5px transparent;
  border-radius: 2em;
  --gradient-border: conic-gradient(
    from var(--border-angle),
    transparent 25%,
    #08f,
    #f03 99%,
    transparent
  );
  background: var(--main-bg) padding-box, var(--gradient-border) border-box,
    var(--main-bg) border-box;
  background-position: center center;
  animation: bg-spin 3s linear infinite;
  &:hover {
    animation-play-state: paused;
  }
}

@keyframes bg-spin {
  to {
    --border-angle: 1turn;
  }
}

@property --border-angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0turn;
}

.loginInput {
  padding: 0.5rem;
  background-color: transparent;
  border-bottom: 1px solid grey;
  color: grey;
}

.submit {
  background-color: transparent;
  color: grey;
  border: 0;
  cursor: pointer;
}
</style>
