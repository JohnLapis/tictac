<i18n lang="yaml">
pt:
  userSymbol: "Seu símbolo:"
  machineSymbol: "Símbolo da máquina:"
  gridDimension: "Dimensão do jogo:"
  startGame: "Começar novo jogo"
  userWins: "Você ganhou!"
  machineWins: "A máquina ganhou!"
  gameIsDrawn: "Velha!"
  searchForOpponent: "Procure por um oponente online"
  opponentFound: "Um oponente foi encontrado"
  userPlaysFirst: "A primeira jogada é sua"
  opponentPlaysFirst: "A primeira jogada é do oponente"
en:
  userSymbol: "Your symbol:"
  machineSymbol: "Machine's symbol:"
  gridDimension: "Grid dimension:"
  startGame: "Start new game"
  userWins: "You won!"
  machineWins: "The machine won!"
  gameIsDrawn: "Draw!"
  searchForOpponent: "Search for an opponent online"
  opponentFound: "An opponent has been found"
  userPlaysFirst: "You have the first move"
  opponentPlaysFirst: "You have the first move"
</i18n>

<template>
  <div class="container" :style="{color: 'white', fontWeight: 'bold'}">
    <div class="row">
      <div class="col-4">
        {{ $t('userSymbol') }}
        <input maxlength="1"
               v-model="userSymbol"
               @keydown="$event.target.value = ''"
               :style="{width: '20px'}">
      </div>
      <div class="col-4">
        {{ $t('machineSymbol') }}
        <input maxlength="1"
               v-model="machineSymbol"
               @keydown="$event.target.value = ''"
               :style="{width: '20px'}">
      </div>
      <div class="col-4">
        {{ $t('gridDimension') }}
        <input
          v-model.number="gridDimension"
          @keydown="isIntegerKey($event)"
          :style="{width: '40px'}">
      </div>
    </div>
  </div>
  <button class="btn btn-light mx-1"
          @click="gameStarted"
          :style="{margin: '0.5rem 0 -1.25rem 0'}">
      {{ $t('startGame') }}
  </button>
  <button class="btn btn-light mx-1"
          @click="mybstartWSConnection"
          :style="{margin: '0.5rem 0 -1.25rem 0'}">
      {{ $t('searchForOpponent') }}
  </button>
  <grid-layout v-model:layout="layout"
               :col-num="2 * gridDimension"
               :style="{width: `${Math.min(lgGridLength, maxGridLength)}px`}"
               :row-height="lgGridLength <= maxGridLength ?
               50 : Math.ceil((maxGridLength - 10) / (2 * gridDimension)) - 15"
               :is-draggable="false"
               :is-resizable="false">
    <grid-item v-for="square in layout"
               @click="(connection.readyState === 1
                 ? wsClickListener : clickListener)(square)"
               :style="square.style"
               :x="square.x"
               :y="square.y"
               :w="square.w"
               :h="square.h"
               :i="square.i"
               :key="square.i">
      <span class="symbol">{{square.symbol}}</span>
    </grid-item>
  </grid-layout>
</template>

<script>
const { GridLayout, GridItem } = () => import('vue-grid-layout')
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

function _getMaxGridLength () {
  // The margins were obtained from the available lengths to the grid, taking into
  // account the navbar, buttons, and etc.
  const horizontalMargin = 14
  const verticalMargin = window.innerWidth <= 768 ? 215 : 125
  return Math.min(
    window.innerWidth - horizontalMargin,
    window.innerHeight - verticalMargin
  )
}

async function getMaxGridLength () {
  // For some reason, on android, window.innerWidth changes without any resizing
  // of the screen when changing gridDimension. This delay prevents the bug.
  await new Promise(() => setTimeout(() => {}, 1))
  return _getMaxGridLength()
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
    async gridDimension (value) {
      value = Number(value)
      if (isNaN(value) || value < 0 || value > 20) return

      this.numberOfRemainingSquares = value ** 2
      this.getLine = (...args) => getLine(value, value, ...args)
      this.layout = makeLayout(value, this.squareSize)
      if (this.gameIsBeingPlayed) {
        this.resetGrid()
        this.gameIsBeingPlayed = false
      }

      this.lgGridLength = 110 * value + 10 * (value + 1)
      this.maxGridLength = await getMaxGridLength()
    }
  },
  data () {
    const gridDimension = 3
    const squareSize = 2
    return {
      gridDimension,
      userSymbol: 'X',
      machineSymbol: 'O',
      connection: null,
      opponentSymbol: null,
      gameIsBeingPlayed: false,
      squareSize,
      numberOfRemainingSquares: gridDimension ** 2,
      getLine: (...args) => getLine(gridDimension, gridDimension, ...args),
      layout: makeLayout(gridDimension, squareSize),
      lgGridLength: 110 * gridDimension + 10 * (gridDimension + 1),
      maxGridLength: _getMaxGridLength(),
    }
  },
  methods: {
    mybstartWSConnection () {
      if (this.connection !== null || this.connection.readyState !== 3) return

      const connection = new WebSocket(`ws://${location.hostname}:6001/app/pusher_key`)
      //wtf do i do with "protocol=7&client=js&version=7.0.6&flash=false"??
      window.C = connection
      this.connection = connection
      connection.addEventListener('message', event => {
        const data = JSON.parse(event.data)
        switch (data.event) {
          case 'opponentFound':
            if (!this.gameIsBeingPlayed) {
              this.opponentIdentifier = data.opponentIdentifier
              this.opponentSymbol = data.opponentSymbol
              this.isUserTurn = data.firstPlayerIdentifier !== this.opponentIdentifier
              alert(this.$t('opponentFound'))
              alert(this.$t(this.isUserTurn ? 'userPlaysFirst' : 'opponentPlaysFirst'))
            }
            break;
          case 'opponentPlay':
            const {X, Y, opponentIdentifier} = data
            const squareIndex = X + Y * this.gridDimension
            if (this.opponentIdentifier !== opponentIdentifier
                || this.isUserTurn
                || !this.gameIsBeingPlayed
                || this.layout[squareIndex].symbol !== '') return
            this.doPlay({X, Y}, this.opponentSymbol)
            if (!this.gameIsBeingPlayed) return this.connection.close()
            this.isUserTurn = true
            break;
        }
      })
    },
    clickListener (square) {
      if (!this.gameIsBeingPlayed || square.symbol !== '') return

      this.doPlay(square, this.userSymbol)
      if (!this.gameIsBeingPlayed) return
      this.doPlay(getRandomSquare(), this.machineSymbol)
    },
    wsClickListener (square) {
      if (!this.gameIsBeingPlayed || square.symbol !== '' || !this.isUserTurn) return

      this.doPlay(square, this.userSymbol)
      connection.send({X: square.X, Y: square.Y}) // async??
      if (!this.gameIsBeingPlayed) return this.connection.close()
      this.isUserTurn = false
    },
    doPlay ({ X, Y }, symbol) {
      this.layout[X + Y * this.gridDimension].symbol = symbol
      this.numberOfRemainingSquares -= 1
      const line = this.getLine(this.layout, symbol)
      if (line) this.gameEnded(line, symbol)
      if (!this.numberOfRemainingSquares) this.gameEnded()
    },
    getRandomSquare () {
      let randomSquare
      do {
        randomSquare = this.layout[randint(this.layout.length)]
      } while (randomSquare.symbol !== '')
      return {X, Y}
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
      if (machinePlaysFirst) this.doPlay(getRandomSquare(), this.machineSymbol)
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
    isIntegerKey (event) {
      if (['ctrlKey', 'altKey', 'metaKey'].includes(event.key)) return
      if (event.key.length === 1 && isNaN(event.key)) event.preventDefault()
    },
  }
}
</script>

<style>
.vue-grid-layout {
  background: #000;
  flex: 0 0 auto;
  margin: 1.5rem auto 0;
  clip-path: inset(15px 15px 15px 15px);
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #fff;
  display: flex;
  align-items: center;
  text-align: center;
  touch-action: auto;
}
.vue-grid-item .symbol {
  width: 100%;
  font-size: 33px;
}
</style>
