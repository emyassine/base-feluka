<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const organization = ref('')
const email = ref('')
const message = ref('')
const phoneNumber = '212620990692'

function sendMessage() {
  const lines = [
    'Hello Numerimondes, I would like to discuss a project.',
    `Name: ${name.value.trim()}`,
    organization.value.trim() ? `Organization: ${organization.value.trim()}` : '',
    email.value.trim() ? `Email: ${email.value.trim()}` : '',
    `Project: ${message.value.trim()}`,
  ].filter(Boolean)
  window.location.assign(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(lines.join('\n'))}`)
}
</script>

<template>
  <form class="nm-contact-form" @submit.prevent="sendMessage">
    <label>
      <span>Name</span>
      <input v-model="name" name="name" autocomplete="name" required maxlength="120" />
    </label>
    <label>
      <span>Organization <small>(optional)</small></span>
      <input v-model="organization" name="organization" autocomplete="organization" maxlength="160" />
    </label>
    <label>
      <span>Email <small>(optional)</small></span>
      <input v-model="email" name="email" type="email" autocomplete="email" maxlength="254" />
    </label>
    <label class="nm-contact-form__message">
      <span>How can we help?</span>
      <textarea v-model="message" name="message" rows="5" required maxlength="3000" />
    </label>
    <div class="nm-contact-form__submit"><FeluqaButton type="submit" size="md">Continue to WhatsApp</FeluqaButton></div>
    <p class="nm-contact-form__note">Your browser opens a WhatsApp draft for you to review and send. This site does not receive or store these fields.</p>
  </form>
</template>

<style scoped>
.nm-contact-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; max-width: 46rem; margin: 2rem auto; padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 1rem; background: var(--vp-c-bg-soft); }
.nm-contact-form label { display: grid; gap: .45rem; color: var(--vp-c-text-1); font-size: .9rem; font-weight: 600; }
.nm-contact-form small, .nm-contact-form__note { color: var(--vp-c-text-2); font-weight: 400; }
.nm-contact-form input, .nm-contact-form textarea { width: 100%; box-sizing: border-box; border: 1px solid var(--vp-c-divider); border-radius: .55rem; padding: .7rem .8rem; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; }
.nm-contact-form input:focus, .nm-contact-form textarea:focus { outline: 2px solid var(--vp-c-brand-1); outline-offset: 1px; }
.nm-contact-form__message { grid-column: 1 / -1; }
.nm-contact-form__submit { justify-self: start; }
.nm-contact-form button { justify-self: start; border: 0; border-radius: 999px; padding: .75rem 1.1rem; background: var(--vp-c-brand-1); color: var(--vp-c-white); font: inherit; font-weight: 700; cursor: pointer; }
.nm-contact-form button:hover { filter: brightness(1.08); }
.nm-contact-form__note { grid-column: 1 / -1; margin: 0; font-size: .85rem; line-height: 1.55; }
@media (max-width: 640px) { .nm-contact-form { grid-template-columns: 1fr; padding: 1rem; } .nm-contact-form__message, .nm-contact-form__note { grid-column: auto; } }
</style>
