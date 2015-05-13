
var assert = require('assert')
var Direction = require('./direction')

// Location objects are immutable.
/**
 * A two-dimensional representation of a location on the main game board.
 * @class
 * @param {?number} column
 * @param {?number} row
 * @memberof RaiNet
 */
class Location {

  constructor(column, row) {

    assert(typeof(column) === 'number' || column == null, "Invalid argument: column")
    assert(typeof(row) === 'number' || row == null, "Invalid argument: row")

    this._column = column
    this._row = row
    Object.freeze(this)
  }

  /**
   * Returns the zero-based indexed row of the location from the top.
   * @returns {?number}
   */
  get column(): number {
    return this._column
  }

  /**
   * Returns the zero-based indexed column of this location from the left.
   * @returns {?number}
   */
  get row(): number {
    return this._row
  }

  toString(): string {
    return this.column + ',' + this.row
  }

  equals(other: Location): boolean {
    if (other == null)
      throw new TypeError()
    return this.column === other.column && this.row === other.row
  }

  /**
   * Displaces a location by a direction or by a pair of relative row-column coordinates.
   * @param {Location} location The location to displace.
   * @param {(number|Symbol)} direction The direction, or the relative number of columns.
   * @param {number} [y] The relative number of rows.
   * @returns {Location}
   */
  static shift(location, direction, y): Location {
    if (y != null) {
      let x = direction
      return Location._shiftRelative(location, x, y)
    }
    else {
      return Location._shiftDirection(location, direction)
    }
  }

  static _shiftRelative(location, x, y) {
    assert(location instanceof Location)
    assert(typeof(x) === 'number' || x == null)
    assert(typeof(y) === 'number' || y == null)
    return new Location(numberDevouringAdder(location.column, x), numberDevouringAdder(location.row, y))
  }

  static _shiftDirection(location, direction) {
    assert(typeof(Direction[direction]) === 'string')
    var x = 0
    var y = 0
    if (direction === Direction.up) y = -1
    else if (direction === Direction.down) y = 1
    else if (direction === Direction.left) x = -1
    else if (direction === Direction.right) x = 1
    return Location._shiftRelative(location, x, y)
  }

  static get null() {
    return nullLocation
  }
}

const nullLocation = new Location(null, null)

/**
 * Safely adds nullable numbers. Anything added to null will be null.
 * @param {...?number} n
 */
function numberDevouringAdder(...n) {
  var ret = 0
  for (let num of n) {
    if (num == null) ret = null
    ret += num
  }
  return ret
}

module.exports = Location
