<template>
  <div class="container">
    <div class="col-6">
      <button v-on:click="setUserSymbol('X')">
        <img alt="X" src=""/>
      </button>
    </div>
    <div class="col-6">
      <button v-on:click="setUserSymbol('O')">
        <img alt="O" src=""/>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'symbolChoicePopup',
}
</script>
