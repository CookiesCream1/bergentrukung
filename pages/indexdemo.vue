<script>
definePageMeta({
  auth: false
})
</script>
<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <!-- Topbar -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-emerald-600">
          Zamazon
        </h1>
        <nav class="space-x-6">
          <NuxtLink to="/shop" class="hover:text-emerald-600">
            Produkty
          </NuxtLink>
          <a href="#o-nas" class="hover:text-emerald-600">O nás</a>
          <a href="#kontakt" class="hover:text-emerald-600">Kontakt</a>
        </nav>
      </div>
    </header>
    <body>
      <img src="public\img\indexdemoalt.jpg" width="95%" style="padding-left: 5%;"></img>
      <section class="bg-emerald-100 py-20 text-center">
        <h2 class="text-4xl font-bold mb-4">
          Váš nový styl začíná zde
        </h2>
        <p class="text-lg mb-6">
          Nakupujte moderní oblečení za skvělé ceny, rychle a pohodlně.
        </p>
        <NuxtLink
          to="/shop"
          class="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-700"
        >
          Prohlédnout kolekci
        </NuxtLink>
      </section>

      <!-- About -->
      <section id="o-nas" class="bg-gray-100 py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h3 class="text-3xl font-semibold mb-6">
            O nás
          </h3>
          <p class="text-lg text-gray-700">
            Zamazon je český internetový obchod s oblečením.<br>
            Nabízíme moderní a pohodlné kousky pro každého.<br>
            Rychlé doručení, snadné vrácení a rychlé odpovědi!
          </p>
        </div>
      </section>

      <!-- Contact -->
      <section id="kontakt" class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h3 class="text-3xl font-semibold mb-6">
          Kontaktujte nás
        </h3>
        <p class="text-lg mb-4">
          Máte otázky? Jsme tu pro vás.
        </p>
        <a href="mailto:info@zamazon.cz" class="text-emerald-600 font-medium">
          info@zamazon.cz
        </a>
      </section>
    </body>
    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-6 text-center">
      <p>&copy; 2025 Zamazon. Všechna práva vyhrazena.</p>
    </footer>
  </div>
</template>
