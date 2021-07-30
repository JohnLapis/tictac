<template>
  <div class="container">
    <div class="row" v-for="i in {{ numberOfRows }}">
      <div
        class="square"
        v-for="i in {{ numberOfCols }}"
        v-on:click="{{ clickHandler }}"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    numberOfRows: Int,
    numberOfCols: Int,
  }
}
</script>
