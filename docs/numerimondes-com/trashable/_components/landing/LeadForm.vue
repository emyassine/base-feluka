<template>
  <form :id="formId" class="form" @submit.prevent="handleSubmit">
    <div class="form-header">
      <h3 class="form-title">{{ title }}</h3>
      <p v-if="subtitle" class="form-subtitle">{{ subtitle }}</p>
    </div>

    <div class="form-fields">
      <slot>
        <div class="field">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Jane Doe" required />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="jane@company.com" required />
        </div>

        <div class="field">
          <label for="company">Company size</label>
          <select id="company" name="company" required>
            <option value="">Select</option>
            <option>1-10</option>
            <option>11-50</option>
            <option>51-200</option>
            <option>201+</option>
          </select>
        </div>
      </slot>
    </div>

    <button type="submit" class="submit">{{ submitText }}</button>

    <p v-if="note" class="form-note">{{ note }}</p>
  </form>
</template>

<script setup lang="ts">
defineOptions({ name: 'LeadForm' });

type Props = {
  title?: string;
  subtitle?: string;
  submitText?: string;
  note?: string;
  formId?: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: 'Get the guide',
  submitText: 'Submit',
  note: 'No spam. Qualified leads only.',
  formId: 'form',
});

const handleSubmit = () => {
  // Handle form submission
};
</script>

<style scoped>
.form {
  max-width: 480px;
  padding: 32px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

@media (min-width: 960px) {
  .form {
    top: 32px;
  }
}

.form-header {
  margin-bottom: 24px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.form-subtitle {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.form-fields {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.field input,
.field select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus,
.field select:focus {
  border-color: var(--vp-c-brand-1);
}

.field input::placeholder {
  color: var(--vp-c-text-3);
}

.submit {
  width: 100%;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: var(--vp-c-brand-1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit:hover {
  background: var(--vp-c-brand-2);
}

.form-note {
  margin: 16px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: center;
}
</style>
