<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
definePageMeta({
  auth: false
})

// Auth state
const user = useAuthState()
const { signOut } = useAuth()

// Props & emits
defineProps<{ modelValue: string }>()
const emit = defineEmits<{(event: 'update:modelValue', value: string): void}>()

// Search state
const searchInput = ref('')
watch(searchInput, val => emit('update:modelValue', val))

// Dropdown state
const demoOpen = ref(false)

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
  <div class="min-h-screen bg-gray-950 text-gray-100">
    <!-- Navbar -->
    <header class="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur shadow">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-emerald-400">
          Zamazon
        </h1>
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/shop" class="hover:text-emerald-400 relative after:block after:h-0.5 after:bg-emerald-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
            Produkty
          </NuxtLink>
          <a href="#o-nas" class="hover:text-emerald-400">O nás</a>
          <a href="#kontakt" class="hover:text-emerald-400">Kontakt</a>
        </nav>
        <div class="flex items-center space-x-4">
          <NuxtLink to="/cart" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm shadow">
            Košík
          </NuxtLink>
          <div v-if="user.status.value !== 'authenticated'">
            <NuxtLink to="/login" class="link">
              přihlášení
            </NuxtLink>
          </div>
          <div v-else>
            <button class="user-btn" @click="signOut()">
              {{ user.data.value?.user?.name ?? "No Name" }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <!-- Hero -->
      <section class="relative h-[85vh] flex items-center justify-center text-center text-white">
        <img src="/img/indexdemoalt.jpg" class="absolute inset-0 w-full h-full object-cover opacity-70">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950/90 to-transparent" />
        <div class="relative z-10 px-6">
          <h2 class="text-5xl font-extrabold text-emerald-400 mb-4">
            Váš nový styl začíná zde
          </h2>
          <p class="text-lg text-gray-200 mb-8">
            Nakupujte moderní oblečení za skvělé ceny, rychle a pohodlně.
          </p>
          <NuxtLink to="/shop" class="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl shadow-lg text-lg font-medium">
            Prohlédnout kolekci
          </NuxtLink>
        </div>
      </section>

      <!-- About -->
      <section id="o-nas" class="bg-gray-900 py-20">
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
          <div>
            <h3 class="text-3xl font-semibold mb-6 text-emerald-300">
              O nás
            </h3>
            <p class="text-lg text-gray-300 leading-relaxed">
              Zamazon je český internetový obchod s oblečením.<br>
              Nabízíme moderní a pohodlné kousky pro každého.<br>
              Rychlé doručení, snadné vrácení a rychlé odpovědi!
            </p>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section id="kontakt" class="py-20 px-6">
        <div class="max-w-3xl mx-auto text-center bg-gray-900 rounded-2xl shadow-lg p-12">
          <h3 class="text-3xl font-semibold mb-6 text-emerald-300">
            Kontaktujte nás
          </h3>
          <p class="text-lg mb-6 text-gray-300">
            Máte otázky? Jsme tu pro vás.
          </p>
          <a href="mailto:info@zamazon.cz" class="text-emerald-400 font-medium hover:text-emerald-300 text-lg">
            info@zamazon.cz
          </a>
        </div>
      </section>

      <!-- Terms -->
      <section id="podminky" class="bg-gray-900 py-20">
        <div class="max-w-4xl mx-auto px-6">
          <h3 class="text-3xl font-semibold mb-6 text-emerald-300 text-center">
            Obchodní a dodací podmínky
          </h3>

          <details class="bg-gray-800 rounded-xl p-6 mb-4">
            <summary class="cursor-pointer text-xl font-semibold text-emerald-400">
              Dodací podmínky
            </summary>
            <p class="mt-4 text-gray-300 leading-relaxed">
              Dodání obvykle probíhá do 2–5 pracovních dnů. Zákazník má právo na vrácení zboží do 14 dnů od převzetí.
            </p>
          </details>

          <!-- NEW: Poštovné -->
          <details class="bg-gray-800 rounded-xl p-6 mb-4">
            <summary class="cursor-pointer text-xl font-semibold text-emerald-400">
              Poštovné a určování jeho výše
            </summary>
            <div class="mt-4 text-gray-300 leading-relaxed space-y-4">
              <p>
                Výše poštovného se odvíjí od hmotnosti vámi objednaného zboží.
                Při platbě na dobírku účtujeme poplatek 59 Kč (propadá dopravci).
                Doporučujeme platbu předem na účet, pokud chcete ušetřit.
              </p>
              <p>
                Větší a objemnější zásilky přepravujeme na paletách z bezpečnostních důvodů.
                Paletu Vám přiveze auto PPL Sprint s plošinou a pomocí paletového vozíku složí dle vašeho přání.
                U paletové přepravy není možná platba kartou – pouze hotově.
              </p>
              <p>
                Upozorňujeme, že výpočet poštovného dle tabulky nemusí vždy platit u palet a objemných zásilek
                (rozhoduje objem – volumetrika). Celkové poštovné uvidíte v košíku ještě před odesláním objednávky.
                Balné neúčtujeme nikdy!
              </p>

              <p class="font-medium text-emerald-300">
                Cena je stanovena následovně:
              </p>

              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-sm">
                  <thead>
                    <tr class="bg-gray-700 text-emerald-300">
                      <th class="py-2 px-4 text-center">
                        Váha zásilky
                      </th>
                      <th class="py-2 px-4 text-right">
                        Cena poštovného
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-700">
                    <tr>
                      <td class="py-2 px-4 text-center">
                        0 – 2 kg (balík)
                      </td><td class="py-2 px-4 text-right">
                        129 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        2 – 7 kg (balík)
                      </td><td class="py-2 px-4 text-right">
                        149 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        8 – 15 kg (balík)
                      </td><td class="py-2 px-4 text-right">
                        164 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        15 – 30 kg (balík)
                      </td><td class="py-2 px-4 text-right">
                        174 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        30 – 60 kg (balíky)
                      </td><td class="py-2 px-4 text-right">
                        314 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        30 – 60 kg (paleta/atyp)
                      </td><td class="py-2 px-4 text-right">
                        568,70 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        60 – 90 kg (balíky)
                      </td><td class="py-2 px-4 text-right">
                        578 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        60 – 95 kg (paleta/atyp)
                      </td><td class="py-2 px-4 text-right">
                        907,50 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        90 – 150 kg (balíky)
                      </td><td class="py-2 px-4 text-right">
                        786 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        96 – 150 kg (paleta/atyp)
                      </td><td class="py-2 px-4 text-right">
                        1694 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        150 – 350 kg (balíky/paleta)
                      </td><td class="py-2 px-4 text-right">
                        914 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        151 – 220 kg (paleta/atyp)
                      </td><td class="py-2 px-4 text-right">
                        2601,50 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        221 – 350 kg (paleta/atyp)
                      </td><td class="py-2 px-4 text-right">
                        3509 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        350 – 800 kg (balíky/paleta)
                      </td><td class="py-2 px-4 text-right">
                        1386 Kč
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 text-center">
                        Více než 800 kg (balíky/paleta)
                      </td><td class="py-2 px-4 text-right">
                        2039 Kč
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          <details class="bg-gray-800 rounded-xl p-6 mb-4 shadow-lg transition-all duration-300 open:shadow-emerald-500/20">
            <summary class="cursor-pointer text-xl font-semibold text-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg px-2 py-1 transition-colors duration-200">
              Reklamační řád
            </summary>
            <div class="mt-4 text-gray-300 leading-relaxed space-y-6">
              <section>
                <h3 class="text-lg font-semibold text-emerald-300 mb-2">
                  Reklamace zásilky
                </h3>
                <p>
                  Jak postupovat, pokud se nám něco nepovedlo. Občas se může něco pokazit. Po doručení či vyzvednutí balíku můžete zjistit, že se poškodil, část z toho, co jste si objednali, chybí anebo jsme Vám omylem poslali jiné zboží. Může se to stát, i když se tomu snažíme zabránit. Občas se stane, že si objednáte něco jiného, než jste potřebovali. I v těchto případech Vám chceme pomoci. Pokud máte s dodaným zbožím jakýkoliv problém, prosím postupujte dle níže uvedeného návodu.
                </p>
              </section>

              <section>
                <h4 class="text-lg font-semibold text-emerald-300 mb-2">
                  Zásilka je poškozena
                </h4>
                <p>
                  Pokud jste poškození zásilky zjistili již při převzetí od kurýra, např. byla viditelně poškozena, můžete její převzetí odmítnout, anebo ji převzít s výhradou. V lepším případě je zboží v pořádku a poškozen byl pouze obal. Pokud je poškozeno i zboží, případně jste poškození zjistili až při vybalování, prosíme, neprodleně nás kontaktujte na telefonu nebo emailu.
                </p>
                <p>
                  Budeme rádi, pokud pořídíte pár fotek, které nám pomohou s uplatněním reklamace vůči přepravní službě. Stačí fotka krabice (palety) se štítky a otevřená krabice, kde je vidět výplň a poškozené zboží. Reklamace jde vždy za námi, vyřídíme ji z naší strany tak, abyste s tím neměli žádné starosti. Samozřejmě Vám nabídneme co nejrychlejší řešení situace k vaší spokojenosti. Když bude zboží mít pouze lehké poškození a nebude se vám ho chtít měnit, projednáme společně okamžitou slevu.
                </p>
              </section>

              <section>
                <h4 class="text-lg font-semibold text-emerald-300 mb-2">
                  V zásilce je něco jiného nebo něco chybí
                </h4>
                <p>
                  Pokud se něco nepovedlo z naší strany a do balíku jsme Vám zapomněli dát některý z objednaných produktů, nebo jsme poslali jiný produkt, než jste si objednali, opět platí, že nás stačí kontaktovat na telefon nebo email. Vše spěšně prověříme na expedici a produkt Vám v co nejkratším čase dopošleme nebo vyměníme.
                </p>
              </section>

              <section>
                <h4 class="text-lg font-semibold text-emerald-300 mb-2">
                  Přejete si zboží vrátit nebo vyměnit
                </h4>
                <p>
                  Pokud nejste spokojeni, nebo jste zjistili, že jste objednali nevhodný produkt, není nic snazšího než jej poslat zpět. Stačí, aby nebyl použitý. Prosím vložte do balíku průvodní dopis s tím, jak si přejete vypořádat vrácení – zda chcete výměnu za jiný výrobek nebo vrácení peněz (v tom případě prosíme, rovnou připojte své číslo bankovního účtu, kam si přejete vrátit peníze).
                </p>
              </section>

              <section>
                <h4 class="text-lg font-semibold text-emerald-300 mb-2">
                  Reklamace nefunkčního výrobku
                </h4>
                <p>
                  V tom případě platí vše výše zmíněné a my vás prosíme, abyste nás informovali na email s popisem závady a vyčkali našeho kontaktu s instrukcemi, zda a kam nám výrobek zaslat pro jeho opravu.
                </p>
              </section>
            </div>
          </details>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-950 border-t border-gray-800 text-gray-400 py-8 text-center space-y-3">
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
