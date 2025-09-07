<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Topbar -->
    <header class="bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-emerald-400">
          Zamazon
        </h1>
        <nav class="space-x-6">
          <NuxtLink to="/shop" class="hover:text-emerald-400">
            Produkty
          </NuxtLink>
          <a href="#o-nas" class="hover:text-emerald-400">O nás</a>
          <a href="#kontakt" class="hover:text-emerald-400">Kontakt</a>
        </nav>
      </div>
    </header>

    <main>
      <!-- Hero Image -->
      <img src="public/img/indexdemoalt.jpg" width="95%" style="padding-left: 5%;">

      <!-- Hero Section -->
      <section class="bg-gray-800 py-20 text-center">
        <h2 class="text-4xl font-bold mb-4 text-emerald-400">
          Váš nový styl začíná zde
        </h2>
        <p class="text-lg mb-6 text-gray-300">
          Nakupujte moderní oblečení za skvělé ceny, rychle a pohodlně.
        </p>
        <NuxtLink
          to="/shop"
          class="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-600"
        >
          Prohlédnout kolekci
        </NuxtLink>
      </section>

      <!-- About -->
      <section id="o-nas" class="bg-gray-700 py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h3 class="text-3xl font-semibold mb-6 text-emerald-300">
            O nás
          </h3>
          <p class="text-lg text-gray-300">
            Zamazon je český internetový obchod s oblečením.<br>
            Nabízíme moderní a pohodlné kousky pro každého.<br>
            Rychlé doručení, snadné vrácení a rychlé odpovědi!
          </p>
        </div>
      </section>

      <!-- Contact -->
      <section id="kontakt" class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h3 class="text-3xl font-semibold mb-6 text-emerald-300">
          Kontaktujte nás
        </h3>
        <p class="text-lg mb-4 text-gray-300">
          Máte otázky? Jsme tu pro vás.
        </p>
        <a href="mailto:info@zamazon.cz" class="text-emerald-400 font-medium hover:text-emerald-300">
          info@zamazon.cz
        </a>
      </section>

      <!-- Terms & Policies -->
      <section id="podminky" class="bg-gray-800 py-16 text-center">
        <div class="max-w-4xl mx-auto px-4">
          <h3 class="text-3xl font-semibold mb-6 text-emerald-300">
            Obchodní a dodací podmínky
          </h3>
          <p class="text-lg text-gray-300 mb-6">
            Zakoupením produktů souhlasíte s našimi obchodními a dodacími podmínkami.
            Dodání obvykle probíhá do 2–5 pracovních dnů. Zákazník má právo na vrácení
            zboží do 14 dnů od převzetí.
          </p>

          <h4 class="text-xl font-semibold mb-4 text-emerald-400">
            Reklamační řád
          </h4>
          <p class="text-lg text-gray-300">
            Na všechny produkty se vztahuje zákonná záruka. V případě vad nás prosím
            kontaktujte na <a href="mailto:info@zamazon.cz" class="text-emerald-400 hover:text-emerald-300">info@zamazon.cz</a>.
          </p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-950 text-gray-400 py-6 text-center space-y-2">
      <p>&copy; 2025 Zamazon. Všechna práva vyhrazena.</p>
      <nav class="space-x-4 text-sm">
        <a href="#podminky" class="hover:text-emerald-400">Obchodní podmínky</a>
        <a href="#podminky" class="hover:text-emerald-400">Dodací podmínky</a>
        <a href="#podminky" class="hover:text-emerald-400">Reklamační řád</a>
        <a href="#kontakt" class="hover:text-emerald-400">Kontakty</a>
      </nav>
    </footer>
  </div>
</template>
