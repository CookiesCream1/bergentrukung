<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const user = useAuthState()
const { signOut } = useAuth()
const role = computed(() => user.data.value?.role)

defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const searchInput = ref('')
watch(searchInput, val => emit('update:modelValue', val))

const demoOpen = ref(false)
function toggleDemo () {
  demoOpen.value = !demoOpen.value
}

function handleClickOutside (e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.demo-dropdown')) {
    demoOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="topbar">
    <div class="logo">
      <NuxtLink to="/" class="logo-text">
        Zamazon
      </NuxtLink>
    </div>

    <div class="search-wrapper">
      <input
        id="search"
        v-model="searchInput"
        type="text"
        placeholder="Vyhledavej produkty..."
      >
    </div>

    <div class="nav-links">
      <NuxtLink
        v-if="user.status.value === 'authenticated' && role === 'admin'"
        to="/admin/users"
        class="link"
      >
        Admin
      </NuxtLink>

      <NuxtLink
        v-if="user.status.value === 'authenticated' && role === 'admin'"
        to="/admin/itemdashboard"
        class="link"
      >
        Produkty
      </NuxtLink>

      <div
        v-if="user.status.value === 'authenticated' && role === 'admin'"
        class="relative demo-dropdown"
      >
        <button class="link dropdown-toggle" @click="toggleDemo">
          Demo
          <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <transition name="fade">
          <div
            v-if="demoOpen"
            class="dropdown-menu"
          >
            <NuxtLink
              to="/indexdemo"
              class="dropdown-item"
              @click="demoOpen = false"
            >
              Demo stranka
            </NuxtLink>
            <NuxtLink
              to="/indexdemonight"
              class="dropdown-item"
              @click="demoOpen = false"
            >
              Demo stranka (Nightmode)
            </NuxtLink>
          </div>
        </transition>
      </div>

      <NuxtLink to="/cart" class="link">
        Kosik
      </NuxtLink>

      <template v-if="user.status.value !== 'authenticated'">
        <NuxtLink to="/login" class="link">
          Prihlasit
        </NuxtLink>
      </template>
      <template v-else>
        <button class="user-btn" @click="signOut()">
          {{ user.data.value?.name ?? user.data.value?.email ?? "Uzivatel" }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #0f1115 0%, #14161c 100%);
  padding: 0.75rem 2rem;
  height: 4rem;
  border-bottom: 1px solid rgba(74, 222, 128, 0.15);
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  color: var(--text-main);
}

.logo-text {
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--zamazon-green, #4ade80);
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: color 0.25s ease, text-shadow 0.25s ease;
}

.logo-text:hover {
  color: var(--zamazon-green-glow, #86efac);
  text-shadow: 0 0 8px rgba(74,222,128,0.5);
}

.search-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 1.5rem;
}

input#search {
  background: #1b1d22;
  border: 1px solid rgba(255,255,255,0.05);
  color: var(--text-main);
  padding: 0.55rem 1rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 600px;
  min-width: 200px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input#search:focus {
  outline: none;
  border-color: var(--zamazon-green);
  box-shadow: 0 0 0 2px rgba(74,222,128,0.2);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-links .link {
  padding: 0.45rem 0.9rem;
  border-radius: 0.45rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease, text-shadow 0.2s ease;
}

.nav-links .link:hover {
  color: var(--zamazon-green);
  text-shadow: 0 0 6px rgba(74,222,128,0.4);
}

.user-btn {
  padding: 0.45rem 0.9rem;
  border-radius: 0.45rem;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.2);
  color: var(--text-main);
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.user-btn:hover {
  background: rgba(74, 222, 128, 0.18);
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.4);
}
</style>
