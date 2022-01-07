<template>
  Enter your symbol: <input id="userSymbol" v-model="userSymbol" maxlength="1">
  Enter machine's symbol:
  <input id="machineSymbol" v-model="machineSymbol" maxlength="1">
  Grid dimension: <input v-model="gridDimension" disabled>

  <button v-on:click="$emit('gameStarted', this)">Play</button>
  <grid-layout v-model:layout="layout"
    :style="{width: (gridDimension <= 8 ? 10 * gridDimension : 80) + '%'}"
    :col-num="2 * gridDimension"
    :row-Height="50"
    :is-draggable="false"
    :is-resizable="false"
  >
    <grid-item v-for="item in layout"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
    >
      <span class="symbol"></span>
    </grid-item>
  </grid-layout>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'

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

function range (n) {
  return [...Array(n).keys()]
}

export default {
  components: {
    GridLayout,
    GridItem
  },
  name: 'Grid',
  data () {
    const gridDimension = 3
    const squareSideLength = 2
    return {
      gridDimension,
      userSymbol: 'X',
      machineSymbol: 'O',
      gameIsBeingPlayed: false,
      squares: makeGridSquares(gridDimension),
      squareElements: [],
      getLine: require('../utils')({
        requiredLineLength: gridDimension,
        gridDimension: gridDimension
      }).getLine,
      layout: range(gridDimension).map(x => range(gridDimension).map(y => ({
        x: x * squareSideLength,
        y: y * squareSideLength,
        w: squareSideLength,
        h: squareSideLength,
        i: `${x}-${y}`,
        symbol: '',
      }))).flat()
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
.vue-grid-layout {
  background: #000;
  flex: 0 0 auto;
  margin: 1.5rem auto;
  clip-path: inset(15px 15px 15px 15px)
}
@media only screen and (max-width: 768px) {
  .vue-grid-layout {
    width: 100% !important;
  }
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #fff;
  width: 50px;
  display: flex;
  align-items: center;
  text-align: center;
}
.vue-grid-item .symbol {
  width: 100%;
  font-size: 33px;
}
</style>
