const setupUtils = require('./utils.js')

describe("getLine with length 3", function() {
  const {getLine} = setupUtils({lineRequiredLength: 3})

  it.each([
    [
      [["X", "O", "O"],
       ["O", "X", "O"],
       ["O", "O", "X"]],
      "X",
      [{pos: {x: 0, y: 0}}, {pos: {x: 1, y: 1}}, {pos: {x: 2, y: 2}}],
    ],
    [
      [["X", "O", "O"],
       ["O", "O", "O"],
       ["O", "O", "X"]],
      "O",
      [{pos: {x: 1, y: 0}}, {pos: {x: 1, y: 1}}, {pos: {x: 1, y: 2}}],
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
    let formattedSquares

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
  const {getLine} = setupUtils({lineRequiredLength: 4})

  it.each([
    [
      [["X", "O", "O", "O"],
       [" ", "X", "O", "X"],
       [" ", "O", " ", "X"],
       ["O", "O", "O", "X"]],
      "O",
      [
        {pos: {x: 3, y: 0}},
        {pos: {x: 2, y: 1}},
        {pos: {x: 1, y: 2}},
        {pos: {x: 0, y: 3}}
      ],
    ],
  ])("getLine", function(squares, symbol, expected) {
    let formattedSquares

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
