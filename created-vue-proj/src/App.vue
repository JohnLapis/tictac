<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <nav class="navbar mb-3">
    <div class="container-fluid">
      <a id="logo" class="navbar-brand" href="#">
        <span>τικτακ</span>
      </a>
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
