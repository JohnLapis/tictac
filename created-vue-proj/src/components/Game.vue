<template>
  Enter your symbol: <input id="userSymbol" v-model="userSymbol" maxlength="1">
  Enter machine's symbol:
  <input id="machineSymbol" v-model="machineSymbol" maxlength="1">
  Grid dimension: <input v-model="gridDimension" disabled>

  <button v-on:click="$emit('gameStarted', this)">Play</button>
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
</template>

<script>
function positionsAreEqual (pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

function randint (ending) {
  return Math.floor(Math.random() * ending)
}

function getIdFromPos ({x, y}) {
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
  data () {
    const gridDimension = 3
    return {
      gridDimension,
      userSymbol: 'X',
      machineSymbol: 'O',
      gameIsBeingPlayed: false,
      squares: makeGridSquares(gridDimension),
      squareElements: [],
      getLine: require('../utils')({
        requiredLineLength: gridDimension,
        gridDimension: gridDimension,
      }).getLine,
    }
  },
  methods: {
    clickListener (square) {
      if (!this.gameIsBeingPlayed) return

      this.doUserPlay(square)
      let line = this.getLine(
        JSON.parse(JSON.stringify(this.squares)), this.userSymbol
      )
      if (line) return this.$emit('gameEnded', this, line, this.userSymbol)

      this.doMachinePlay()
      line = this.getLine(
        JSON.parse(JSON.stringify(this.squares)), this.machineSymbol
      )
      if (line) this.$emit('gameEnded', this, line, this.machineSymbol)
    },
    updateSquare (chosenPos, chosenSymbol) {
      this.squares = this.squares.map(({pos, symbol}) =>
        positionsAreEqual(pos, chosenPos) ?
        {pos, symbol: chosenSymbol} : {pos, symbol}
      )
    },
    doUserPlay (square) {
      this.updateSquare(square.pos, this.userSymbol)
    },
    doMachinePlay () {
      const emptySquares = this.squares.filter(s => s.symbol === '')
      const randomSquare = emptySquares[randint(emptySquares.length)]
      if (randomSquare) this.updateSquare(randomSquare.pos, this.machineSymbol)
    },
    getSquareElement ({pos}) {
      return this.squareElements[this.gridDimension * pos.y + pos.x]
    },
    resetGrid () {
      this.squares = makeGridSquares(this.gridDimension)
    },
  },
  emits: {
    gameStarted (_this) {
      document.querySelector("#userSymbol").readOnly = true
      document.querySelector("#machineSymbol").readOnly = true
      _this.gameIsBeingPlayed = true
      _this.resetGrid()
      _this.squareElements = document.querySelectorAll('.square')
    },
    gameEnded (_this, line, symbol) {
      alert(symbol === _this.userSymbol ? 'voce ganhou' : 'a maquina ganhou')
      line.forEach(square => _this.getSquareElement(square).classList.add('blue'))

      document.querySelector("#userSymbol").readOnly = false
      document.querySelector("#machineSymbol").readOnly = false
      _this.gameIsBeingPlayed = false
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
