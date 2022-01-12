<template>
  <nav class="navbar mb-3">
    <div class="container-fluid">
      <a id="logo" class="navbar-brand" href="#">τικτακ</a>
    </div>
  </nav>
  <Game />
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: {
    Game,
  },
}
</script>

<style>
html, #app {
  text-align: center;
  background: #ffbebc;
  width: 100%;
  height: 100%;
}
.navbar {
  background: #d8bfd8;
  padding: 0 !important;
}
#logo {
  font-size: 40px;
  font-family: monospace;
  color: white;
}
</style>
