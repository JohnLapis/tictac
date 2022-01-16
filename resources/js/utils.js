function getDistance (square1, square2) {
  return {
    X: Math.abs(square1.X - square2.X),
    Y: Math.abs(square1.Y - square2.Y)
  }
}

function compareDistance (dist1, dist2) {
  return dist1.X === dist2.X && dist1.Y === dist2.Y
}

function squaresAreEquallyDistanced (squares, distance) {
  if (squares.length < 2) return true
  for (let i = 1; i < squares.length; i++) {
    // Squares are ordered from left to right and top to bottom, so this is okay.
    const squaresDistance = getDistance(squares[i - 1], squares[i])
    if (!compareDistance(squaresDistance, distance)) return false
  }

  return true
}

function getLine (requiredLineLength, gridDimension, squares, symbol) {
  squares = squares.filter(s => s.symbol === symbol)

  // Main diagonal
  let squaresInSameDiagonal = squares.filter(s => s.Y - s.X === 0)
  if (squaresInSameDiagonal.length === requiredLineLength &&
      squaresAreEquallyDistanced(squaresInSameDiagonal, { X: 1, Y: 1 })) {
    return squaresInSameDiagonal
  }
  // Reflected diagonal
  squaresInSameDiagonal = squares.filter(s => s.Y + s.X === gridDimension - 1)
  if (squaresInSameDiagonal.length === requiredLineLength &&
      squaresAreEquallyDistanced(squaresInSameDiagonal, { X: 1, Y: 1 })) {
    return squaresInSameDiagonal
  }

  // Rows
  for (let j = 0; j < gridDimension; j++) {
    const squaresInSameRow = squares.filter(s => s.Y === j)
    if (squaresInSameRow.length === requiredLineLength &&
        squaresAreEquallyDistanced(squaresInSameRow, { X: 1, Y: 0 })) {
      return squaresInSameRow
    }
  }

  // Columns
  for (let i = 0; i < gridDimension; i++) {
    const squaresInSameCol = squares.filter(s => s.X === i)
    if (squaresInSameCol.length === requiredLineLength &&
        squaresAreEquallyDistanced(squaresInSameCol, { X: 0, Y: 1 })) {
      return squaresInSameCol
    }
  }

  return false
}

export { getLine }
