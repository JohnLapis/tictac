<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="" alt="ALT" width="30" height="24" class="d-inline-block align-text-top">
        tictac
      </a>
    </div>
  </nav>
  <Game id="#grid"></Game>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.red {
  background-color: red;
}

.blue {
  background-color: blue;
}
</style>
