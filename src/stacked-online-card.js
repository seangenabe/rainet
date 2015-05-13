
var assert = require('assert')
var StackCause = require('./stack-cause')
var Card = require('./card')

// StackedOnlineCard objects are immutable.
/**
 * Represents an Online Card in the stack area.
 * @class
 * @memberof RaiNet
 * @param {Card} card
 * @param {StackCause} cause
 */
class StackedOnlineCard {

  constructor(card, cause) {

    assert(card instanceof Card, "Invalid argument: card")
    assert(typeof(StackCause[cause]) === 'string', "Invalid argument: cause")

    this._card = card
    this._cause = cause
    Object.freeze(this)
  }

  /**
   * The online card.
   * @returns {Card}
   */
  get card() {
    return this._card
  }

  /**
   * How the online card got in the stack area.
   * @returns {Symbol} StackCause
   */
  get cause() {
    return this._cause
  }

}

module.exports = StackedOnlineCard
