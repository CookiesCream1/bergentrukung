<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const user = useAuthState()
const { data: role } = await useFetch('/api/user/role')
const { signOut } = useAuth()

// Prop for v-model binding
defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

// Local search state
const searchInput = ref('')
watch(searchInput, val => emit('update:modelValue', val))

// Dropdown state
const demoOpen = ref(false)
function toggleDemo () {
  demoOpen.value = !demoOpen.value
}

// Click outside handler
function handleClickOutside (e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.demo-dropdown')) {
    demoOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="topbar">
    <NuxtLink to="/" class="link">
      <h1 class="text-2xl font-bold text-emerald-600">
        Zamazon
      </h1>
    </NuxtLink>

    <div class="search-wrapper">
      <input
        id="search"
        v-model="searchInput"
        type="text"
        placeholder="Vyhledávej"
      >
    </div>

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

    <!-- DEMO dropdown -->
    <div
      v-if="user.status.value === 'authenticated' && role === 'admin'"
      class="relative demo-dropdown"
    >
      <button class="link flex items-center" @click="toggleDemo">
        DEMO
        <svg
          class="ml-1 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        v-if="demoOpen"
        class="absolute mt-2 bg-[#222] border border-gray-700 rounded-md shadow-lg z-50"
      >
        <NuxtLink
          to="/indexdemo"
          class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
          @click="demoOpen = false"
        >
          Demo stránka
        </NuxtLink>
        <NuxtLink
          to="/indexdemonight"
          class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
          @click="demoOpen = false"
        >
          Demo stránka (nightmode)
        </NuxtLink>
      </div>
    </div>

    <NuxtLink to="/cart" class="link">
      Košík
    </NuxtLink>

    <div v-if="user.status.value !== 'authenticated'">
      <NuxtLink to="/login" class="link">
        Nepřihlášen
      </NuxtLink>
    </div>
    <div v-else>
      <button class="user-btn" @click="signOut()">
        {{ user.data.value?.user?.name ?? "No Name" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 4rem;
  background-color: #1f2937;
  color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  font-family: Arial, sans-serif;
}

.link {
  color: #f0f0f0;
  text-decoration: none;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.link:hover {
  color: #ffcc00;
}

.search-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

input#search {
  width: 60%;
  max-width: 300px;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: none;
  outline: none;
  font-size: 1rem;
}

.user-btn {
  background-color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-btn:hover {
  background-color: #555;
}
</style>
