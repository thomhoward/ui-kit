<template>
  <ul>
    <li v-if="loading">LOADING...</li>
    <li v-else v-for="result in results" :key="result.uniqueId">
      <h3>{{ result.title }}</h3>
      <div>{{ result.excerpt }}</div>
    </li>
  </ul>
</template>
<style scoped>
ul {
  text-align: left;
}
</style>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {headlessEngine} from '../main';
import {
  SearchResult,
  SearchStatus,
  CoveoHeadlessState,
} from 'coveo-headless-engine';

@Component
export default class ResultList extends Vue {
  state: CoveoHeadlessState | null = null;

  created() {
    headlessEngine.reduxStore.subscribe(() => {
      this.state = headlessEngine.reduxStore.getState();
    });
  }

  get results() {
    return this.state?.results.list;
  }

  get loading() {
    return this.state?.search.status == SearchStatus.LOADING;
  }
}
</script>