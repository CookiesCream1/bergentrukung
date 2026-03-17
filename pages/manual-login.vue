<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: 'shop'
  }
})

await navigateTo('/login', { redirectCode: 301 })
</script>
