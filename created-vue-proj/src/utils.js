module.exports = ({ requiredLineLength, gridDimension }) => {
  function getDistance (square1, square2) {
    return {
      x: Math.abs(square1.pos.x - square2.pos.x),
      y: Math.abs(square1.pos.y - square2.pos.y)
    }
  }

  function compareDistance (dist1, dist2) {
    return dist1.x === dist2.x && dist1.y === dist2.y
  }

  function squaresAreEquallyDistanced (squares, distance) {
    if (squares.length < 2) return true
    // Squares are ordered from top to bottom and left to right
    squares = squares.sort(s => `${s.pos.y}${s.pos.x}`)
    for (let i = 1; i < squares.length; i++) {
      const squaresDistance = getDistance(squares[i - 1], squares[i])
      if (!compareDistance(squaresDistance, distance)) return false
    }

    return true
  }

  function getLine (squares, symbol) {
    squares = squares.filter(s => s.symbol === symbol)

    // Main diagonal
    let squaresInSameDiagonal = squares.filter(s => s.pos.y - s.pos.x === 0)
    if (squaresInSameDiagonal.length === requiredLineLength &&
       squaresAreEquallyDistanced(squaresInSameDiagonal, { x: 1, y: 1 })) {
      return squaresInSameDiagonal
    }
    // Reflected diagonal
    squaresInSameDiagonal = squares.filter(s => s.pos.y + s.pos.x === gridDimension - 1)
    if (squaresInSameDiagonal.length === requiredLineLength &&
         squaresAreEquallyDistanced(squaresInSameDiagonal, { x: 1, y: 1 })) {
      return squaresInSameDiagonal
    }

    // Rows
    for (let j = 0; j < gridDimension; j++) {
      const squaresInSameRow = squares.filter(s => s.pos.y === j)
      if (squaresInSameRow.length === requiredLineLength &&
         squaresAreEquallyDistanced(squaresInSameRow, { x: 1, y: 0 })) {
        return squaresInSameRow
      }
    }

    // Columns
    for (let i = 0; i < gridDimension; i++) {
      const squaresInSameCol = squares.filter(s => s.pos.x === i)
      if (squaresInSameCol.length === requiredLineLength &&
         squaresAreEquallyDistanced(squaresInSameCol, { x: 0, y: 1 })) {
        return squaresInSameCol
      }
    }

    return false
  }

  return { getLine }
}
