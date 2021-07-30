const setupUtils = require('../../src/utils.js')
// const setupUtils = require('src/utils.js')

function makeSquare(x, y, symbol) {
  return {pos: {x, y}, symbol}
}

fdescribe("getLine with length 3", function() {
  // const {getLine} = setupUtils({requiredLineLength: 3})
  const {getLine} = setupUtils({requiredLineLength: 3}).getLineV3

  it.each([
    [
      [["X", "O", "O"],
       ["O", "X", "O"],
       ["O", "O", "X"]],
      "X",
      [makeSquare(0, 0, "X"), makeSquare(1, 1, "X"), makeSquare(2, 2, "X")],
    ],
    [
      [["X", "O", "O"],
       ["O", "O", "O"],
       ["O", "O", "X"]],
      "O",
      [makeSquare(1, 0, "O"), makeSquare(1, 1, "O"), makeSquare(1, 2, "O")],
    ],
    [
      [["X", "O", "O"],
       ["O", "O", "O"],
       ["O", "O", "X"]],
      "X",
      false,
    ],
    [
      [["X", "O", "X"],
       ["O", "X", "O"],
       ["O", "X", "O"]],
      "X",
      false,
    ],
    [
      [["X", "O", "X"],
       ["O", "X", "O"],
       ["O", "X", "O"]],
      "O",
      false,
    ],
  ])("getLine", function(squares, symbol, expected) {
    let formattedSquares = []

    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares.length; j++) {
        formattedSquares.push({
          pos: {x: j, y: i},
          symbol: squares[i][j],
        })
      }
    }

    expect(getLine(formattedSquares, symbol)).toEqual(expected)
  })
})

describe("getLine with length 4", function() {
  const {getLine} = setupUtils({requiredLineLength: 4})

  it.each([
    [
      [["X", "O", "O", "O"],
       [" ", "X", "O", "X"],
       [" ", "O", " ", "X"],
       ["O", "O", "O", "X"]],
      "O",
      [
        makeSquare(3, 0, "O"),
        makeSquare(2, 1, "O"),
        makeSquare(1, 2, "O"),
        makeSquare(0, 3, "O"),
      ],
    ],
  ])("getLine", function(squares, symbol, expected) {
    let formattedSquares = []

    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares.length; j++) {
        formattedSquares.push({
          pos: {x: j, y: i},
          symbol: squares[i][j],
        })
      }
    }

    expect(getLine(formattedSquares, symbol)).toEqual(expected)
  })
})
