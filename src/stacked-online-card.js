'use strict'

const StackCause = require('./stack-cause')
const Card = require('./card')

// StackedOnlineCard objects are immutable.
/**
 * Initializes a new instance of `StackedOnlineCard`.
 * @class StackedOnlineCard
 * @classdesc Represents an Online Card in the stack area.
 * @param {Card} card The online card.
 * @param {Symbol} cause {@link StackCause} How the online card got in the stack area.
 */
module.exports = class StackedOnlineCard {

  constructor(card, cause) {

    if (!(card instanceof Card)) {
      throw new TypeError("card must be a Card")
    }
    if (!StackCause.hasValue(cause)) {
      throw new TypeError("cause must be a member of StackCause")
    }

    this._card = card
    this._cause = cause
    Object.freeze(this)
  }

  /**
   * The online card.
   * @var {Card} card
   * @memberof StackedOnlineCard.prototype
   * @readonly
   */
  get card() {
    return this._card
  }

  /**
   * {@link StackCause} How the online card got in the stack area.
   * @var {Symbol} cause
   * @memberof StackedOnlineCard.prototype
   * @readonly
   */
  get cause() {
    return this._cause
  }

}
