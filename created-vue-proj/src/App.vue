<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <!-- is th id required -->
  <Grid
    id="#grid"
    numberOfRows="numberOfRows"
    numberOfCols="numberOfCols"
    clickHandler="clickHandlerWithBetterName"
  >
  <img alt="Vue logo" src="./assets/logo.png">
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="" alt="ALT" width="30" height="24" class="d-inline-block align-text-top">
        tictac
      </a>
    </div>
  </nav>
</template>

<script>
const {getLine} = require('./utils')({lineRequiredLength: 3})

const squares = Array.from(document.querySelectorAll(".square"))
function randint(ending) {
  return Math.floor(Math.random() * ending)
}

function doMachinePlay() {
  const emptySquares = squares.filter(s => s.innerText === '')
  const chosenSquare = emptySquares[randint(emptySquares.length)]
  chosenSquare.innerText = vm.$data.machineSymbol
}

function getRowsOfSquares() {
  return Array.from(document.querySelectorAll("#grid > .row"))
              .map((row, j) =>
                Array.from(row.querySelectorAll(".square"))
                     .map((square, i) => {
                       pos: {x: i, y: j},
                       symbol: square.innerText
              }))
                // .map(square => square.innerText))
}

function showPlayerWon(line) {
  alert("alguém ganhou")
}

function incorrectPlay(square) {
  showSmallMsg("Esse quadrado não está vazio.")
  square.become("red")
}

function clickHandlerWithBetterName(event) {
  const square = event.target

  if (!vm.$data.gameHasStarted) return
  if (square.innerText !== "") return incorrectPlay(square)

  element.innerText = vm.$data.userSymbol
  line = getLine(getRowsOfSquares(), vm.$data.userSymbol)
  if (line) showPlayerWon(line)

  makeRandomPlay()
  line = getLine()
  if (line) showPlayerWon(line, vm.$data.machineSymbol)
}

export default {
  name: "App",
  data() {
    return {
      numberOfRows: 3,
      numberOfCols: 3,
      userSymbol: null,
      machineSymbol: null,
    }
  },
  methods: {
    setUserSymbol(str) {
      if (str === "X") {
        this.userSymbol = "X"
        this.machineSymbol = "O"
      } else if (str === "O") {
        this.userSymbol = "O"
        this.machineSymbol = "X"
      } else {
        throw Error('Os únicos símbolos válidos são "X" e "O".')
      }
    },
  }
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
</style>
