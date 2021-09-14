const setupUtils = require('../../src/utils.js')

function makeSquare (x, y, symbol) {
  return { pos: { x, y }, symbol }
}

function convertGridIntoArray (grid) {
  const array = []

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      array.push({
        pos: { x: j, y: i },
        symbol: grid[i][j]
      })
    }
  }
  return array
}

describe('getLine with length 3', function () {
  const { getLine } = setupUtils({ requiredLineLength: 3, gridDimension: 3 })

  it.each([
    [
      [['X', 'O', 'O'],
        ['O', 'X', 'O'],
        ['O', 'O', 'X']],
      'X',
      [makeSquare(0, 0, 'X'), makeSquare(1, 1, 'X'), makeSquare(2, 2, 'X')]
    ],
    [
      [['X', 'O', 'O'],
       ['', 'O', 'O'],
       ['', 'O', 'X']],
      'O',
      [makeSquare(1, 0, 'O'), makeSquare(1, 1, 'O'), makeSquare(1, 2, 'O')]
    ],
    [
      [['X', 'X', 'X'],
       ['O', '', 'O'],
       ['', 'O', 'X']],
      'X',
      [makeSquare(0, 0, 'X'), makeSquare(1, 0, 'X'), makeSquare(2, 0, 'X')]
    ],
    [
      [['X', 'O', 'X'],
        ['O', '', 'X'],
        ['', 'O', 'X']],
      'X',
      [makeSquare(2, 0, 'X'), makeSquare(2, 1, 'X'), makeSquare(2, 2, 'X')]
    ],
    [
      [['X', 'O', 'O'],
        ['O', 'O', 'O'],
        ['O', 'O', 'X']],
      'X',
      false
    ],
    [
      [['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'O']],
      'X',
      false
    ],
    [
      [['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'O']],
      'O',
      false
    ]
  ])('getLine', function (grid, symbol, expected) {
    const squares = convertGridIntoArray(grid)
    expect(getLine(squares, symbol)).toEqual(expected)
  })
})

describe('getLine with length 4', function () {
  const { getLine } = setupUtils({ requiredLineLength: 4, gridDimension: 4 })

  it.each([
    [
      [['X', 'O', 'O', 'O'],
        [' ', 'X', 'O', 'X'],
        [' ', 'O', 'X', 'X'],
        ['O', 'O', 'O', 'X']],
      'O',
      [
        makeSquare(3, 0, 'O'),
        makeSquare(2, 1, 'O'),
        makeSquare(1, 2, 'O'),
        makeSquare(0, 3, 'O')
      ]
    ],
    [
      [['X', 'O', 'O', 'O'],
        [' ', 'X', 'O', 'X'],
        [' ', 'O', 'X', 'X'],
        ['O', 'O', 'O', 'X']],
      'X',
      [
        makeSquare(0, 0, 'X'),
        makeSquare(1, 1, 'X'),
        makeSquare(2, 2, 'X'),
        makeSquare(3, 3, 'X')
      ]
    ]
  ])('getLine', function (grid, symbol, expected) {
    const squares = convertGridIntoArray(grid)
    expect(getLine(squares, symbol)).toEqual(expected)
  })
})
