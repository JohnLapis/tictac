<template>
  <div class="container">
    <div class="row">
      <div
        class="col-4"
        v-for="square in squares"
        v-on:click="clickListener(square); /* updateSquare(square.pos, $userSymbol) */"
      >
        <div class="square">
          {{ square.symbol }}
        </div>
      </div>
    </div>
  </div>

  <button id="playAgain" v-on:click="resetGrid" hidden>Play Again</button>
</template>

<script>
function positionsAreEqual (pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

function randint (ending) {
  return Math.floor(Math.random() * ending)
}

function getRowsOfSquares () {
  return Array.from(document.querySelectorAll('#grid > .row'))
              .map((row, j) =>
                Array.from(row.querySelectorAll('.square'))
                     .map((square, i) => ({
                       pos: { x: i, y: j },
                       symbol: square.innerText
              })))
}

function getSquareHTMLElement (square) {
  return document.querySelector(`#grid .row:nth-child(${square.pos.y + 1})`)
                 .querySelector(`.square:nth-child(${square.pos.x + 1})`)
}

function runVictoryEvent (line) {
  document.querySelector("#playAgain").hidden = false
  alert('alguém ganhou')
  line.forEach(square => getSquareHTMLElement(square).classList.add('blue'))
}

function incorrectPlay (square) {
  // this should be a small message
  alert('Esse quadrado não está vazio.')
  //squareHTMLElement.classList.add('red')
}

function getIdFromPos({x, y}) {
  return [x, y].join('-')
}

export default {
  name: 'Grid',
  props: {
    gridDimension: Number,
  },
  data () {
    function makeGridSquares (dim) {
      return new Array(dim ** 2).fill().map((_, i) => ({
        symbol: '',
        pos: {x: i % dim, y: Math.floor(i / dim)}
      }))
    }

    return {
      squares: makeGridSquares(this.gridDimension),
      resetGrid () {
        this.squares = makeGridSquares(this.gridDimension)
      },
      getLine: require('../utils')({
        requiredLineLength: this.gridDimension,
        gridDimension: this.gridDimension,
      }).getLine,
    }
  },
  methods: {
    updateSquare(chosenPos, chosenSymbol) {
      this.squares = this.squares.map(({pos, symbol}) =>
        positionsAreEqual(pos, chosenPos) ?
        {pos, symbol: chosenSymbol} : {pos, symbol}
      )
    },
    makeUserPlay (square) {
      this.updateSquare(square.pos, vm.$data.userSymbol)
    },
    makeRandomPlay () {
      const emptySquares = this.squares.filter(s => s.symbol === '')
      const randomSquare = emptySquares[randint(emptySquares.length)]
      if (randomSquare) this.updateSquare(randomSquare.pos, vm.$data.machineSymbol)
    },
    clickListener (square) {
      if (!vm.$data.gameHasStarted) return
      if (square.symbol !== '') return incorrectPlay(square)

      this.makeUserPlay(square)
      let line = this.getLine(this.squares, vm.$data.userSymbol)
      if (line) runVictoryEvent(line)

      this.makeRandomPlay()
      line = this.getLine(this.squares, vm.$data.machineSymbol)
      if (line) runVictoryEvent(line)
    }
  }
}
</script>

<style>
.square {
  border: solid;
  height: 30px;
  width:  30px;
}
</style>
