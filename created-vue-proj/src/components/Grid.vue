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

function getIdFromPos({x, y}) {
  return [x, y].join('-')
}

function makeGridSquares (dim) {
  return new Array(dim ** 2).fill().map((_, i) => ({
    symbol: '',
    pos: {x: i % dim, y: Math.floor(i / dim)}
  }))
}

export default {
  name: 'Grid',
  props: {
    gridDimension: {type: Number, required: true},
  },
  data () {
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
    clickListener (square) {
      if (!vm.$data.gameBeingPlayed) return

      this.doUserPlay(square)
      let line = this.getLine(JSON.parse(JSON.stringify(this.squares)),
                              vm.$data.userSymbol)
      if (line) return this.runVictoryEvent(line, vm.$data.userSymbol)

      this.doMachinePlay()
      line = this.getLine(JSON.parse(JSON.stringify(this.squares)),
                          vm.$data.machineSymbol)
      if (line) this.runVictoryEvent(line, vm.$data.machineSymbol)
    },
    updateSquare(chosenPos, chosenSymbol) {
      this.squares = this.squares.map(({pos, symbol}) =>
        positionsAreEqual(pos, chosenPos) ?
        {pos, symbol: chosenSymbol} : {pos, symbol}
      )
    },
    doUserPlay (square) {
      this.updateSquare(square.pos, vm.$data.userSymbol)
    },
    doMachinePlay () {
      const emptySquares = this.squares.filter(s => s.symbol === '')
      const randomSquare = emptySquares[randint(emptySquares.length)]
      if (randomSquare) this.updateSquare(randomSquare.pos, vm.$data.machineSymbol)
    },
    getSquareHTMLElement ({pos}) {
      return document.querySelectorAll('.square')[this.gridDimension * pos.y + pos.x]
    },
    runVictoryEvent (line, symbol) {
      document.querySelector("#playAgain").hidden = false
      alert(symbol === vm.$data.userSymbol ? 'voce ganhou' : 'a maquina ganhou')
      line.forEach(square => this.getSquareHTMLElement(square).classList.add('blue'))
      document.querySelector("#userSymbol").readOnly = false
      document.querySelector("#machineSymbol").readOnly = false

      vm.$data.gameBeingPlayed = false
    },
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
