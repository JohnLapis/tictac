<template>
  <div class="container">
    <div class="row" v-for="i in {{ gridDimension }}">
      <div
        class="square"
        v-for="i in {{ gridDimension }}"
        v-on:click="{{ clickHandler }}"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    gridDimension: Int,
  }
}
</script>
