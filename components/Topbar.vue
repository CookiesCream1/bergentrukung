<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = useAuthState()
const { signOut } = useAuth()
const { data: role } = await useFetch('/api/user/role')

// Search logic
const searchQuery = ref('')
const router = useRouter()

function onSearch (e: Event) {
  e.preventDefault()
  if (!searchQuery.value.trim()) { return }
  // Navigate to search page with query param
  router.push(`/search?query=${encodeURIComponent(searchQuery.value)}`)
}
</script>

<template>
  <div class="mainmenu">
    <NuxtLink to="/">
      home
    </NuxtLink>

    <!-- Search form -->
    <form style="display: flex; align-items: center;" @submit="onSearch">
      <input
        id="search"
        v-model="searchQuery"
        type="text"
        name="search"
        placeholder="Search products..."
      >
      <button type="submit">
        🔍
      </button>
    </form>

    <NuxtLink to="/admin/users">
      admin
    </NuxtLink>

    <NuxtLink
      v-if="user.status.value === 'authenticated' && role.value === 'admin'"
      to="/admin/itemdashboard"
    >
      product dashboard
    </NuxtLink>

    <NuxtLink to="/cart">
      Cart
    </NuxtLink>

    <NuxtLink v-if="user.status.value !== 'authenticated'" to="/login">
      not logged in
    </NuxtLink>

    <button v-else style="color: white" @click="signOut()">
      user: {{ user.data.value?.user?.name ?? "No Name" }}
    </button>
  </div>
</template>

<style>
.mainmenu {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #000;
  height: 4rem;
  padding: 1rem;
  color: antiquewhite;
}
input[type="text"] {
  padding: 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>
