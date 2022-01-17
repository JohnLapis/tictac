<i18n lang="yaml">
pt:
  userSymbol: "Seu símbolo:"
  machineSymbol: "Símbolo da máquina:"
  gridDimension: "Dimensão do jogo:"
  startGame: "Começar novo jogo"
  userWins: "Você ganhou!"
  machineWins: "A máquina ganhou!"
  gameIsDrawn: "Velha!"
en:
  userSymbol: "Your symbol:"
  machineSymbol: "Machine's symbol:"
  gridDimension: "Grid dimension:"
  startGame: "Start new game"
  userWins: "You won!"
  machineWins: "The machine won!"
  gameIsDrawn: "Draw!"
</i18n>

<template>
  <div class="container" :style="{color: 'white', fontWeight: 'bold'}">
    <div class="row">
      <div class="col-4">
          {{ $t('userSymbol') }}
          <input maxlength="1" v-model="userSymbol" :style="{width: '20px'}">
      </div>
      <div class="col-4">
          {{ $t('machineSymbol') }}
        <input maxlength="1" v-model="machineSymbol" :style="{width: '20px'}">
      </div>
      <div class="col-4">
          {{ $t('gridDimension') }}
          <input
            v-model.number="gridDimension"
            v-on:keydown="isNavOrInt($event)"
            :style="{width: '40px'}"
          >
      </div>
    </div>
  </div>
  <button class="btn btn-light"
    :style="{margin: '0.5rem 0 -1.25rem 0'}"
    v-on:click="gameStarted"
  >{{ $t('startGame') }}</button>
  <grid-layout v-model:layout="layout"
    :style="{width: `${gridDimension <= 8 ? 10 * gridDimension : 80}%`}"
    :col-num="2 * gridDimension"
    :row-Height="50"
    :is-draggable="false"
    :is-resizable="false"
  >
    <grid-item v-for="square in layout"
      v-on:click="clickListener(square)"
      :style="square.style"
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
import { getLine } from '../utils'

function randint (ending) {
  return Math.floor(Math.random() * ending)
}

function range (n) {
  return [...Array(n).keys()]
}

function makeLayout (gridDimension, squareSize) {
  return range(gridDimension).map(y => range(gridDimension).map(x => ({
    // "x", "y" are used for visual position of squares
    x: x * squareSize,
    y: y * squareSize,
    // "X", "Y" are used for algorithms
    X: x,
    Y: y,
    w: squareSize,
    h: squareSize,
    i: `${x}-${y}`,
    symbol: '',
    style: {}
  }))).flat()
}

export default {
  components: {
    GridLayout,
    GridItem
  },
  name: 'Grid',
  watch: {
    userSymbol () {
      if (this.gameIsBeingPlayed) {
        this.resetGrid()
        this.gameIsBeingPlayed = false
      }
    },
    machineSymbol () {
      if (this.gameIsBeingPlayed) {
        this.resetGrid()
        this.gameIsBeingPlayed = false
      }
    },
    gridDimension (value) {
      value = Number(value)
      if (isNaN(value) || value < 0 || value > 20) return
      this.numberOfRemainingSquares = value ** 2
      this.getLine = (...args) => getLine(value, value, ...args)
      this.layout = makeLayout(value, this.squareSize)
      if (this.gameIsBeingPlayed) {
        this.resetGrid()
        this.gameIsBeingPlayed = false
      }
    }
  },
  data () {
    const gridDimension = 3
    const squareSize = 2
    return {
      gridDimension,
      userSymbol: 'X',
      machineSymbol: 'O',
      gameIsBeingPlayed: false,
      squareSize,
      numberOfRemainingSquares: gridDimension ** 2,
      getLine: (...args) => getLine(gridDimension, gridDimension, ...args),
      layout: makeLayout(gridDimension, squareSize)
    }
  },
  methods: {
    clickListener (square) {
      if (!this.gameIsBeingPlayed || square.symbol !== '') return

      this.doUserPlay(square)
      let line = this.getLine(this.layout, this.userSymbol)
      if (line) return this.gameEnded(line, this.userSymbol)
      if (!this.numberOfRemainingSquares) return this.gameEnded()

      this.doMachinePlay()
      line = this.getLine(this.layout, this.machineSymbol)
      if (line) return this.gameEnded(line, this.machineSymbol)
      if (!this.numberOfRemainingSquares) this.gameEnded()
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
    resetGrid () {
      for (const square of this.layout) {
        square.symbol = ''
        square.style.background = '#ffffff'
      }
    },
    gameStarted () {
      if (this.gridDimension === 0) return this.gameEnded()
      this.gameIsBeingPlayed = true
      this.numberOfRemainingSquares = this.gridDimension ** 2
      this.resetGrid()
      const machinePlaysFirst = randint(2)
      if (machinePlaysFirst) this.doMachinePlay()
      if (machinePlaysFirst && this.gridDimension === 1) {
        this.gameEnded(this.layout, this.machineSymbol)
      }
    },
    gameEnded (line, symbol) {
      this.gameIsBeingPlayed = false
      if (line) {
        alert(this.$t(symbol === this.userSymbol ? 'userWins' : 'machineWins'))
        for (const square of line) {
          square.style.background = '#c4faf8'
        }
      } else {
        alert(this.$t('gameIsDrawn'))
        for (const square of this.layout) {
          square.style.background = '#ff9999'
        }
      }
    },
    isNavOrInt (event) {
      // Only allows navigation and numeric inputs
      const allowedKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Delete',
        'Backspace',
        'PageUp',
        'PageDown',
        'Home',
        'End'
      ]
      if (!allowedKeys.includes(event.key) && isNaN(event.key)) event.preventDefault()
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
