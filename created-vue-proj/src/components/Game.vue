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
    <grid-item v-for="square in layout"
      v-on:click="clickListener(square)"
      :x="square.x"
      :y="square.y"
      :w="square.w"
      :h="square.h"
      :i="square.i"
      :key="square.i"
    >
      <span class="symbol">{{square.symbol}}</span>
    </grid-item>
  </grid-layout>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'

function randint (ending) {
  return Math.floor(Math.random() * ending)
}

function makeGridSquares (dim) {
  return new Array(dim ** 2).fill().map((_, i) => ({
    symbol: '',
    pos: { x: i % dim, y: Math.floor(i / dim) }
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
      numberOfRemainingSquares: gridDimension ** 2,
      squares: makeGridSquares(gridDimension),
      squareElements: [],
      getLine: require('../utils')({
        requiredLineLength: gridDimension,
        gridDimension: gridDimension
      }).getLine,
      layout: range(gridDimension).map(x => range(gridDimension).map(y => ({
        // "x", "y" are used for visual position of squares
        x: x * squareSideLength,
        y: y * squareSideLength,
        // "X", "Y" are used for algorithms
        X: x,
        Y: y,
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

      if (!this.numberOfRemainingSquares) {
        this.gameIsBeingPlayed = false
        return
      }
      this.doUserPlay(square)
      let line = this.getLine(this.layout, this.userSymbol)
      if (line) return this.$emit('gameEnded', this, line, this.userSymbol)

      if (!this.numberOfRemainingSquares) {
        this.gameIsBeingPlayed = false
        return
      }
      this.doMachinePlay()
      line = this.getLine(this.layout, this.machineSymbol)
      if (line) this.$emit('gameEnded', this, line, this.machineSymbol)
    },
    updateSquare (chosenPos, chosenSymbol) {
      const index = this.layout.findIndex(
        ({ X, Y }) => X === chosenPos.X && Y === chosenPos.Y
      )
      this.layout[index].symbol = chosenSymbol
    },
    doUserPlay ({ X, Y }) {
      this.updateSquare({ X, Y }, this.userSymbol)
      this.numberOfRemainingSquares -= 1
    },
    doMachinePlay () {
      let randomSquare
      do {
        randomSquare = this.layout[randint(this.layout.length)]
      } while (randomSquare.symbol !== '')
      this.updateSquare({ X: randomSquare.X, Y: randomSquare.Y }, this.machineSymbol)
      this.numberOfRemainingSquares -= 1
    },
    getSquareElement ({ X, Y }) {
      return this.squareElements[this.gridDimension * Y + X]
    },
    resetGrid () {
      this.squares = makeGridSquares(this.gridDimension)
    }
  },
  emits: {
    gameStarted (_this) {
      document.querySelector('#userSymbol').readOnly = true
      document.querySelector('#machineSymbol').readOnly = true
      _this.gameIsBeingPlayed = true
      _this.resetGrid()
      _this.squareElements = document.querySelectorAll('.square')
    },
    gameEnded (_this, line, symbol) {
      alert(symbol === _this.userSymbol ? 'voce ganhou' : 'a maquina ganhou')
      line.forEach(square => _this.getSquareElement(square).classList.add('blue'))

      document.querySelector('#userSymbol').readOnly = false
      document.querySelector('#machineSymbol').readOnly = false
      _this.gameIsBeingPlayed = false
    }
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
