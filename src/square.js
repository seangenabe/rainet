
var assert = require('assert')
var Location = require('./location')
var Team = require('./team')
var Card = require('./card')
var Direction = require('./direction')
var values = require('./util/values')

const directions = values(Direction)

/**
 *  Represents a square on the board.
 *  Also covers the special server squares.
 *  @class
 *  @memberof RaiNet
 *  @param {Location} The location of the square.
 */
class Square {

  constructor(location) {

    assert(location instanceof Location, "Invalid argument: location")

    this._location = location
    var adjacentSquares = {}
    this._adjacentSquares = adjacentSquares

    for (let direction of directions) {
      adjacentSquares[direction] = null
    }

    this._card = null
    this._firewall = null

    Object.seal(adjacentSquares)
    Object.seal(this)
  }

  endInitialize() {
    Object.freeze(this._adjacentSquares)
  }

  /** The location of this square. Can be null for the server squares.
   * @returns {Location}
   */
  get location() {
    return this._location
  }

  /**
   * The adjacent squares to this square.
   * @returns {Object.<Symbol, Square>} Direction => Square
   */
  get adjacentSquares() {
    return this._adjacentSquares
  }

  /**
   * The card currently occupying this square. Null if none.
   * @returns {?Card}
   */
  get card() {
    return this._card
  }
  /** @param {?Card} value */
  set card(value) {
    assert(value == null || value instanceof Card)
    this._card = value
  }

  /**
   * Whose player a Firewall card on this square belongs to. Null if none.
   * @return {Symbol} Team
   */
  get firewall() {
    return this._firewall
  }
  /** @param {Symbol} value */
  set firewall(value) {
    assert(value == null || typeof(Team[value]) === 'string')
    this._firewall = value
  }

}

module.exports = Square
