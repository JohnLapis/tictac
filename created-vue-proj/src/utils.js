// export default function({requiredLineLength}) {
module.exports = ({requiredLineLength}) => {
  const validDistances = [{x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]

  function getDistance(square1, square2) {
    return {
      x: Math.abs(square1.pos.x - square2.pos.x),
      y: Math.abs(square1.pos.y - square2.pos.y),
    }
  }
  function compareDistance(dist1, dist2) {
    return dist1.x === dist2.x && dist1.y === dist2.y
  }

  function getLine(squares, symbol) {
    let line = []
    let lineDistance = []

    // Parametrize the "3" later
    for (let i = 0; i < 3; i++) {
      // This is done because every line contains a square from top row.
      if (squares[i].symbol !== symbol) continue
      line.push(squares[i])

      for (let j = i + 1; j < squares.length; j++) {
        const square = squares[j]
        if (square.symbol !== symbol) continue

        if (line.length === 1) {
          const lastSquare = line[line.length - 1]
          const distToLastSquare = getDistance(square, lastSquare)
          if (validDistances.find(dist => compareDistance(dist, distToLastSquare))) {
            lineDistance = distToLastSquare
            line.push(square)
          }
        } else if (line.length > 1) {
          const lastSquare = line[line.length - 1]
          const distToLastSquare = getDistance(square, lastSquare)
          if (compareDistance(lineDistance, distToLastSquare)) {
            line.push(square)
          }
        }
        if (line.length === requiredLineLength) break
        // console.log(line)
      }

      if (line.length === requiredLineLength) break
      else line = []
    }

    return line.length ? line : false
  }

  function getLineV2(squares, symbol) {
    // diags
    if(squares.filter(s => s.pos.y === s.pos.x).length === 3) {
      return squares.filter(s => s.pos.y === 0);
    }

    // rows
    if(squares.filter(s => s.pos.y === 0).length === 3) {
      return squares.filter(s => s.pos.y === 0);
    } else if(squares.filter(s => s.pos.y === 1).length === 3) {
      return squares.filter(s => s.pos.y === 1);
    } else if(squares.filter(s => s.pos.y === 2).length === 3) {
      return squares.filter(s => s.pos.y === 2);
    }

    // cols
    if(squares.filter(s => s.pos.x === 0).length === 3) {
      return squares.filter(s => s.pos.x === 0);
    } else if(squares.filter(s => s.pos.x === 1).length === 3) {
      return squares.filter(s => s.pos.x === 1);
    } else if(squares.filter(s => s.pos.x === 2).length === 3) {
      return squares.filter(s => s.pos.x === 2);
    }
  }

  function squaresAreInConsecutiveOrder(squares, dim) {
    if (squares.length < 2) return true
    // myb i shouldn't need to sort it
    // but then the order would be kinda implicit
    squares = squares.sort(s => s.pos[dim])
    for (let i = 1; i < squares.length; i++) {
      if (getDistance(squares[i] - squares[i - 1])[dim] !== 1) return false
    }
  }

  function getLineV3(squares, symbol) {
    // diagS
    const squaresInSameDiagonal = squares.filter(s => s.pos.y === s.pos.x)
    if(squaresInSameDiagonal.length === requiredLineLength
       && squaresAreInConsecutiveOrder(squaresInSameDiagonal, "x")) {
      return squaresInSameDiagonal;
    }

    // rows
    for (let i = 0; i < numberOfRows; i++) {
      const squaresInSameRow = squares.filter(s => s.pos.y === i)
      if(squaresInSameRow.length === requiredLineLength
         && squaresAreInConsecutiveOrder(squaresInSameRow, "x")) {
        return squaresInSameRow;
      }

    // cols
    for (let i = 0; i < numberOfCols; i++) {
      const squaresInSameCol = squares.filter(s => s.pos.x === i)
      if(squaresInSameCol.length === requiredLineLength
         && squaresAreInConsecutiveOrder(squaresInSameCol), "y") {
        return squaresInSameCol;
    }
  }

  return {getLine, getLineV2}
}
