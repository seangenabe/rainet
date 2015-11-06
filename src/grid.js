'use strict'

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

  // DEBUG
  toStringDebug() {
    var buffer = '\n'
    var teamChar = {
      [Team.top]: '^',
      [Team.bottom]: '%'
    }
    var typeChar = {
      [OnlineCardType.link]: 'L',
      [OnlineCardType.virus]: 'V'
    }
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (let colIndex = 0; colIndex < 8; colIndex++) {
        var square = this.rows[rowIndex][colIndex]
        var card = square.card
        if (card) {
          buffer += teamChar[card.owner]
          buffer += typeChar[card.type]
          buffer += card.lineBoosted ? '+' : ''
        }
        else {
          buffer += '__'
        }
        if (square.firewall) {
          buffer += '/' + teamChar[square.firewall]
        }
        else {
          buffer += '  '
        }
        buffer += ' '
      }
      buffer += '\n'
    }
    return buffer
  }

}
