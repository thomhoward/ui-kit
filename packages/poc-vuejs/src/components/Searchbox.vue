<template>
  <input v-bind:placeholder="placeholder" v-on:keyup="search" v-model="expression" />
</template>

<style scoped>
input {
  height: 50px;
  width: 100%;
}
</style>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {headlessEngine} from '../main';

@Component
export default class Searchbox extends Vue {
  @Prop() private placeholder!: string;

  expression: string | null = null;

  search() {
    if (this.expression !== null) {
      headlessEngine.updateQueryExpression(this.expression);
      headlessEngine.performSearch();
    }
  }
}
</script>

