<template>
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
      getLine: require('../utils')({
        requiredLineLength: this.gridDimension,
        gridDimension: this.gridDimension,
      }).getLine,
    }
  },
  methods: {
    clickListener (square) {
      if (!vm.$data.gameIsBeingPlayed) return

      this.doUserPlay(square)
      let line = this.getLine(JSON.parse(JSON.stringify(this.squares)),
                              vm.$data.userSymbol)
      if (line) return this.$emit('gameEnded', (line, vm.$data.userSymbol))

      this.doMachinePlay()
      line = this.getLine(JSON.parse(JSON.stringify(this.squares)),
                          vm.$data.machineSymbol)
      if (line) this.$emit('gameEnded', (line, vm.$data.machineSymbol))
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
    resetGrid () {
      this.squares = makeGridSquares(this.gridDimension)
    },
  },
  emits: {
    gameEnded (line, symbol) {
      alert(symbol === vm.$data.userSymbol ? 'voce ganhou' : 'a maquina ganhou')
      console.log(line)
      line.forEach(square => this.getSquareHTMLElement(square).classList.add('blue'))
    },
    gameStarted (_this) {
      _this.resetGrid()
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
