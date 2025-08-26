<script setup lang="ts">
import { ref, watch } from 'vue'

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

// Keep parent v-model in sync
watch(searchInput, val => emit('update:modelValue', val))
</script>

<template>
  <div class="topbar">
    <NuxtLink to="/" class="link">
      Home
    </NuxtLink>

    <div class="search-wrapper">
      <input
        id="search"
        v-model="searchInput"
        type="text"
        placeholder="Search products..."
      >
    </div>

    <NuxtLink to="/admin/users" class="link">
      Admin
    </NuxtLink>

    <NuxtLink
      v-if="user.status.value === 'authenticated' && role === 'admin'"
      to="/admin/itemdashboard"
      class="link"
    >
      Product Dashboard
    </NuxtLink>

    <NuxtLink to="/cart" class="link">
      Cart
    </NuxtLink>

    <div v-if="user.status.value !== 'authenticated'">
      <NuxtLink to="/login" class="link">
        Not Logged In
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
  background-color: #111111;
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
