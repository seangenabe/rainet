'use strict'

const Card = require('./card')
const Location = require('./location')
const Team = require('./team')

/**
 * Initializes a new instance of `Square`.
 * @classdesc
 *   Represents a square on the board.
 *   Also covers the special server squares.
 * @class Square
 * @param {Location} location The location of the square.
 * @throws {TypeError}
 */
class Square {

  /**
   * @member {Location} _location
   * @memberof Square.prototype
   * @access private
   */

  /**
   * @member {Map.<Symbol, Square>} _adjacentSquares
   * @memberof Square.prototype
   * @access private
   */

  /**
   * @member {?Card} _card
   * @memberof Square.prototype
   * @access private
   */

  /**
   * @member {?Symbol} _firewall
   * @memberof Square.prototype
   * @access private
   */

  constructor(location) {

    if (!(location instanceof Location)) {
      throw new TypeError("location must be Location")
    }

    this._location = location
    this._adjacentSquares = new Map()

    this._card = null
    this._firewall = null

    Object.seal(this)
  }

  /**
   * The location of this square. Can be {@link Location.null} for the server squares.
   * @var {Location} location
   * @memberof Square.prototype
   * @readonly
   */
  get location() {
    return this._location
  }

  /**
   * The adjacent squares to this square keyed by {@link Direction}.
   * @var {Map.<Symbol, Square>} adjacentSquares
   * @memberof Square.prototype
   * @readonly
   */
  get adjacentSquares() {
    return this._adjacentSquares
  }

  /**
   * The card currently occupying this square. Null if none. Throws `TypeError`.
   * @var {?Card} card
   * @memberof Square.prototype
   */
  get card() {
    return this._card
  }
  set card(value) {
    if (!(value == null || value instanceof Card)) {
      throw new TypeError("card must be a nullable Card")
    }
    this._card = value
  }

  /**
   * {@link Team} Whose player a Firewall card on this square belongs to.
   * Null if none.
   * Throws `TypeError`.
   * @var {?Symbol} firewall
   * @memberof Square.prototype
   */
  get firewall() {
    return this._firewall
  }
  set firewall(value) {
    if (!(value == null || typeof Team[value] === 'string')) {
      throw new TypeError("firewall must be a nullable symbol")
    }
    this._firewall = value
  }

}

module.exports = Square
