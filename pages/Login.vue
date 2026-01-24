<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: 'shop'
  }
})
</script>

<template>
  <div class="toplevel">
    <Topbar class="topbar" />
    <div class="login-wrapper">
      <div class="login-card fade-in">
        <h2 class="login-title">
          Vítejte zpět
        </h2>

        <!-- Default login component -->
        <Login />

        <div class="divider">
          <span>nebo</span>
        </div>

        <!-- Manual login link -->
        <div class="manual-login-link">
          <p>Nemáte Google účet?</p>
          <button @click="$router.push('/manual-login')">
            Ruční přihlášení
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toplevel {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "topbar"
    "login";
  background: radial-gradient(circle at 20% 30%, #18181c, #0c0c0f 70%);
  color: #eaeaea;
  font-family: "Inter", sans-serif;
}

.topbar {
  grid-area: topbar;
}

.login-wrapper {
  grid-area: login;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.login-card {
  background: rgba(30, 30, 34, 0.95);
  padding: 2.5rem 3rem;
  border-radius: 1rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 420px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.login-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.login-title {
  text-align: center;
  font-weight: 600;
  color: #fafafa;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  color: #888;
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: "";
  height: 1px;
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 0.75rem;
}

.manual-login-link {
  text-align: center;
}

.manual-login-link p {
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.manual-login-link button {
  background: linear-gradient(90deg, #6b46c1, #55349d);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: background 0.2s ease, transform 0.1s ease;
}

.manual-login-link button:hover {
  background: linear-gradient(90deg, #7a57d1, #6441b5);
  transform: translateY(-2px);
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
