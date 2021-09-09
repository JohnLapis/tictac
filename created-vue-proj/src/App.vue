<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <!-- is th id required -->
  <Grid
    id="#grid"
    gridDimension="3"
    v-on:click="clickHandlerWithBetterName"
  >
  </Grid>
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
import Grid from './components/Grid.vue'
const { getLine } = require('./utils')({ lineRequiredLength: 3 })

const squares = Array.from(document.querySelectorAll('.square'))
function randint (ending) {
  return Math.floor(Math.random() * ending)
}

function getIdFromPos({x, y}) {
  return [x, y].join('-')
}

export default {
  name: 'App',
  components: {
    Grid,
  },
  data () {
    const gridDimension = 3
    return {
      gridDimension,
      userSymbol: null,
      machineSymbol: null,
      updateSquare(pos, symbol) {
        this.squares[getIdFromPos(pos)].symbol = symbol
      },
      squares: Object.fromEntries(
        new Array(gridDimension**2).fill().map((_, i) => {
          const pos = {
            x: i % gridDimension,
            y: Math.floor(i / gridDimension),
          }
          return [getIdFromPos(pos), { symbol: '', pos }]
        })
      ),
    }
  },
  methods: {
    setUserSymbol (str) {
      if (str === 'X') {
        this.userSymbol = 'X'
        this.machineSymbol = 'O'
      } else if (str === 'O') {
        this.userSymbol = 'O'
        this.machineSymbol = 'X'
      } else {
        throw Error('Os únicos símbolos válidos são "X" e "O".')
      }
    },
    getRowsOfSquares () {
      return Array.from(document.querySelectorAll('#grid > .row'))
                  .map((row, j) =>
                    Array.from(row.querySelectorAll('.square'))
                         .map((square, i) => ({
                           pos: { x: i, y: j },
                           symbol: square.innerText
                  })))
    },
    getSquareHTMLElement (square) {
      return document.querySelector(`#grid .row:nth-child(${square.pos.y + 1})`)
                     .querySelector(`.square:nth-child(${square.pos.x + 1})`)
    },
    showPlayerWon (line) {
      alert('alguém ganhou')
      line.forEach(square => getSquareHTMLElement(square).classList.add('blue'))
    },
    incorrectPlay (square) {
      // this should be a small message
      alert('Esse quadrado não está vazio.')
      squareHTMLElement.classList.add('red')
    },
    makeUserPlay (square) {
      square.innerText = vm.$data.userSymbol
      updateSquare(JSON.parse(square.dataset.pos), vm.$data.userSymbol)
    },
    makeRandomPlay () {
      const emptySquares = squares.filter(s => s.innerText === '')
      const chosenSquare = emptySquares[randint(emptySquares.length)]
      chosenSquare.innerText = vm.$data.machineSymbol
      const [x, y] = chosenSquare.dataset.pos.split('-')
      updateSquare({x, y}, vm.$data.machineSymbol)
    },
    clickHandlerWithBetterName (event) {
      alert("ee")
      window.ee = event
    },
    _clickHandlerWithBetterName (event) {
      const square = event.target

      if (!vm.$data.gameHasStarted) return
      if (square.innerText !== '') return incorrectPlay(square)

      makeUserPlay(square)
      let line = getLine(vm.$data.squares, vm.$data.userSymbol)
      if (line) showPlayerWon(line)

      makeRandomPlay()
      line = getLine(vm.$data.squares, vm.$data.machineSymbol)
      if (line) showPlayerWon(line)
    }
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

.red {
  background-color: red;
}

.blue {
  background-color: blue;
}
</style>
