<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <DocsPagesHeaders v-if="showDocHeader" :header-align="headerAlign" />
    </template>
    <template #layout-bottom>
      <NDCFooter />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import DocsPagesHeaders from '../../../../imports/components/docs/DocsPagesHeaders.vue';

const { frontmatter } = useData();

const showDocHeader = computed(() => {
  const layout = frontmatter.value?.layout ?? 'doc';
  if (layout !== 'doc') return false;
  if (frontmatter.value?.docHeader === false) return false;
  return true;
});

const headerAlign = computed<'left' | 'center'>(() => {
  const value = frontmatter.value?.docHeaderAlign ?? frontmatter.value?.headerAlign ?? 'left';
  return value === 'center' ? 'center' : 'left';
});
</script>
