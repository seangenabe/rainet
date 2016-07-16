const Direction = require('./direction')
const typeCheck = require('./typecheck')

const a1 = typeCheck().nullable.integer.between(-1, 8)

// Location objects are immutable.
/**
 * Initializes a new instance of Location.
 * @class Location
 * @classdesc A two-dimensional representation of a location on the main game
 * board.
 * @param {?number} column The zero-based indexed column from the left.
 * @param {?number} row The zero-based indexed row from the top.
 * @throws {TypeError}
 */
class Location {

  constructor(column, row) {
    a1.assert(column, 'column')
    a1.assert(row, 'row')

    this._column = column
    this._row = row
    Object.freeze(this)
  }

  /**
   * Returns the zero-based indexed row of the location from the top.
   * @var column
   * @type {?number}
   * @memberof Location.prototype
   * @readonly
   */
  get column() {
    return this._column
  }

  /**
   * Returns the zero-based indexed column of this location from the left.
   * @var row
   * @type {?number}
   * @memberof Location.prototype
   * @readonly
   */
  get row() {
    return this._row
  }

  /**
   * Returns a string representation of this Location instance.
   * @function toString
   * @memberof Location.prototype
   */
  toString() {
    return this.column + ',' + this.row
  }

  /**
   * Returns whether the value of this instance of Location is equivalent to another instance of Location.
   * @function equals
   * @memberof Location.prototype
   * @param {Location} other
   * @returns {boolean}
   * @throws {TypeError} Thrown when `this` or `other` is null.
   */
  equals(other) {
    if (this == null) {
      throw new TypeError("context cannot be null")
    }
    if (other == null) {
      throw new TypeError("other cannot be null")
    }
    return this.column === other.column && this.row === other.row
  }

  /**
   * Displaces a location by a direction or by a pair of relative row-column coordinates.
   * @function shift
   * @memberof Location
   * @static
   * @param {Location} location The location to displace.
   * @param {(?number|Symbol)} direction The {@link Direction} direction, or the relative number of columns.
   * @param {?number} [y] The relative number of rows.
   * @returns {Location} A new location with the displacement applied.
   * @throws {TypeError}
   * @throws {Error} Thrown when `direction` is not a member of {@link Direction}.
   */
  static shift(location, direction, y) {
    if (!(location instanceof Location)) {
      throw new TypeError("location must be Location")
    }
    if (y != null) {
      let x = direction
      return Location._shiftRelative(location, x, y)
    }
    else {
      return Location._shiftDirection(location, direction)
    }
  }

  /**
   * @function _shiftRelative
   * @memberof Location
   * @static
   * @access private
   * @param {Location} location
   * @param {?number} x
   * @param {?number} y
   * @returns {Location}
   */
  static _shiftRelative(location, x, y) {
    return new Location(numberDevouringAdder(location.column, x), numberDevouringAdder(location.row, y))
  }

  /**
   * @function _shiftDirection
   * @memberof Location
   * @static
   * @access private
   * @param {Location} location
   * @param {Symbol} direction
   * @returns {Location}
   * @throws {Error} `direction` is not a member of `Direction`.
   */
  static _shiftDirection(location, direction) {
    if (typeof Direction[direction] !== 'string') {
      throw new Error("direction must be a member of Direction")
    }
    const relativeLookup = new Map([
      [Direction.up, [0, -1]],
      [Direction.down, [0, 1]],
      [Direction.left, [-1, 0]],
      [Direction.right, [1, 0]]
    ])
    let relative = relativeLookup.get(direction)
    return Location._shiftRelative(location, ...relative)
  }

  /**
   * @var {Location} null
   * @memberof Location
   * @static
   */
  static get null() {
    const nullLocation = new Location(null, null)
    return nullLocation
  }

}

/**
 * Safely adds nullable numbers. Anything added to null will be null.
 * @function numberDevouringAdder
 * @access private
 * @param {...?number} n
 */
function numberDevouringAdder(...n) {
  let ret = 0
  for (let num of n) {
    if (num == null) { ret = null }
    ret += num
  }
  return ret
}

module.exports = Location
