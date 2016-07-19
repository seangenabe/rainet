const StackCause = require('./stack-cause')
const Card = require('./card')
const typecheck = require('./typecheck')
const a1 = typecheck().instanceof(Card)
const a2 = typecheck().enum(StackCause)

// StackedOnlineCard objects are immutable.
/**
 * Initializes a new instance of `StackedOnlineCard`.
 * @class StackedOnlineCard
 * @classdesc Represents an Online Card in the stack area.
 * @param {Card} card The online card.
 * @param {Symbol} cause {@link StackCause} How the online card got in the stack
 * area.
 */
module.exports = class StackedOnlineCard {

  constructor(card, cause) {
    a1.assert(card, 'card')
    a2.assert(cause, 'cause')

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
