const Location = require('./location')
const OnlineCardType = require('./online-card-type')
const Square = require('./square')
const Team = require('./team')

/**
 * Initializes a new instance of `Grid`.
 * @class Grid
 * @classdesc The game main board, composed of 8 columns and 8 rows.
 */
module.exports = class Grid {

  constructor() {
    let squares = []
    let rows = []
    let columns = []
    this._squares = squares
    this._rows = rows
    this._columns = columns

    for (var i = 0; i < 8; i++) {
      rows.push(new Array(8))
      columns.push(new Array(8))
    }

    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (let colIndex = 0; colIndex < 8; colIndex++) {
        let location = new Location(colIndex, rowIndex)
        let square = new Square(location)
        this._rows[rowIndex][colIndex] = square
        this._columns[colIndex][rowIndex] = square
        this._squares.push(square)
      }
    }

    let startingSquares = new Map()
    this._startingSquares = startingSquares
    startingSquares.set(Team.top, [
      rows[0][0],
      rows[0][1],
      rows[0][2],
      rows[1][3],
      rows[1][4],
      rows[0][5],
      rows[0][6],
      rows[0][7]
    ])
    startingSquares.set(Team.bottom, [
      rows[7][0],
      rows[7][1],
      rows[7][2],
      rows[6][3],
      rows[6][4],
      rows[7][5],
      rows[7][6],
      rows[7][7]
    ])
  }

  /**
   * The rows of the board.
   * @var {Square[][]} rows
   * @memberof Grid.prototype
   * @readonly
   */
  get rows() {
    return this._rows
  }

  /**
   * The columns of the board.
   * @var {Square[][]} columns
   * @memberof Grid.prototype
   * @readonly
   */
  get columns() {
    return this._columns
  }

  /**
   * An array containing all squares.
   * @var {Square[]} squares
   * @memberof Grid.prototype
   * @readonly
   */
  get squares() {
    return this._squares
  }

  /**
   * Looks up a location
   * @function lookup
   * @memberof Grid.prototype
   * @param {Location} location The location to look up.
   * @returns {?Square} The square if found, otherwise null.
   */
  lookup(location) {
    if (!(location instanceof Location)) {
      throw new TypeError("location must be a Location")
    }
    return (this.rows[location.row] || [])[location.column]
  }

  /**
   * Returns the starting squares for each {@link Team} player.
   * @var {Map.<Symbol, Square[]>} startingSquares
   * @memberof Grid.prototype
   * @readonly
   */
  get startingSquares() {
    return this._startingSquares
  }

  toStringDebug() {
    const cardChar = {
      [Team.top]: {
        [OnlineCardType.link]: '▽',
        [OnlineCardType.virus]: '▼'
      },
      [Team.bottom]: {
        [OnlineCardType.link]: '△',
        [OnlineCardType.virus]: '▲'
      }
    }
    const firewall = {
      [Team.top]: '🖡',
      [Team.bottom]: '🖠'
    }
    let builder = [
      'LEGEND: owner/points to enemy filled=virus +=line boost <>=t/b firewall\n'
    ]
    let chars = Array.from(
      { length: 28 },
      v => Array.from({ length: 28 }, () => ' ')
    )
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      for (let colIndex = 0; colIndex < 9; colIndex++) {
        if (rowIndex < 8 && colIndex < 8) {
          let square = this.rows[rowIndex][colIndex]
          let card = square.card
          let c = card ? cardChar[card.owner][card.type] : ' '
          let boostChar = square.lineBoosted ? '🚀' : ' '
          let firewallChar = square.firewall ? firewall[square.firewall] : ' '
          chars[rowIndex * 3 + 1][colIndex * 3 + 1] = c
          chars[rowIndex * 3 + 1][colIndex * 3 + 2] = boostChar
          chars[rowIndex * 3 + 2][colIndex * 3 + 2] = firewallChar
        }
        // borders
        chars[rowIndex * 3][colIndex * 3] = '┼'
        chars[rowIndex * 3][colIndex * 3 + 1] = '─'
        chars[rowIndex * 3][colIndex * 3 + 2] = '─'
        chars[rowIndex * 3 + 1][colIndex * 3] = '│'
        chars[rowIndex * 3 + 2][colIndex * 3] = '│'
      }
    }
    // borders
    chars[0][0] = '┏'
    chars[0][24] = '┓'
    chars[24][0] = '┗'
    chars[24][24] = '┛'
    for (let a = 1; a < 24; a++) {
      for (let b = 0; b < 25; b += 24) {
        chars[b][a] = '━'
        chars[a][b] = '┃'
      }
    }
    for (let a = 3; a < 22; a += 3) {
      chars[0][a] = '┯'
      chars[24][a] = '┷'
      chars[a][0] = '┠'
      chars[a][24] = '┨'
    }

    // add to string
    for (let a = 0; a < 25; a++) {
      for (let b = 0; b < 25; b++) {
        builder.push(chars[a][b])
      }
      builder.push('\n')
    }
    return builder.join('')
  }

}
