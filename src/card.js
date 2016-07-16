const OnlineCardType = require('./online-card-type')
const Team = require('./team')
const typeCheck = require('./typecheck')

const a1 = typeCheck().object
const a2 = typeCheck().enum(OnlineCardType, 'OnlineCardType')
const a3 = typeCheck().enum(Team, 'Team')

/**
 * Represents an online card.
 * @class Card
 * @param {object} opts
 * @param {Symbol} opts.type {@link OnlineCardType} The type of Online Card.
 * @param {Symbol} opts.owner {@link Team} The owner of the Online Card.
 */
module.exports = class Card {

  /**
   * @var {Symbol} _type
   * @memberof Card.prototype
   * @access private
   */

  /**
   * @var {Symbol} _owner
   * @memberof Card.prototype
   * @access private
   */

  constructor(opts) {
    a1.assert(opts, 'opts')
    const { type, owner } = opts
    a2.assert(type, 'opts.type')
    a3.assert(owner, 'opts.owner')

    this._type = type
    this._owner = owner
    this._revealed = false
    this._lineBoosted = false

    Object.seal(this)
  }

  /**
   * {@link OnlineCardType} The type of the online card.
   * @var {Symbol} type
   * @memberof Card.prototype
   * @readonly
   */
  get type() {
    return this._type
  }

  /**
   * {@Team} The team who owns the online card.
   * @var {Symbol} owner
   * @memberof Card.prototype
   * @readonly
   */
  get owner() {
    return this._owner
  }

  /**
   * Whether this card has been revealed by a Virus Checker card.
   * @var {boolean} revealed
   * @memberof Card.prototype
   */
  get revealed() {
    return this._revealed
  }
  set revealed(value) {
    this._revealed = Boolean(value)
  }

  /**
   * Whether this card is line boosted.
   * @var {boolean} lineBoosted
   * @memberof Card.prototype
   */
  get lineBoosted() {
    return this._lineBoosted
  }
  set lineBoosted(value) {
    this._lineBoosted = Boolean(value)
  }

  /**
   * Generates online cards of the specified type for the specified team.
   * @function generateOnlineCardsForTeam
   * @memberof Card
   * @static
   * @param {Symbol} owner {@link Team}
   * @param {Symbol} [type] {@link OnlineCardType}
   * @returns {Iterator.<Card>}
   */
  static generateOnlineCardsForTeam(owner, type) {
    if (!Team.hasValue(owner)) {
      throw new TypeError("owner must be a member of Team")
    }

    if (type) {
      if (!OnlineCardType.hasValue(type)) {
        throw new TypeError("type must be a member of OnlineCardType")
      }
      return Card._generateOnlineCardsOfTypeForTeam(owner, type)
    }
    return Card._generateOnlineCardsForTeam(owner)
  }

  /**
   * @function _generateOnlineCardsForTeam
   * @memberof Card
   * @access private
   * @static
   * @param {Symbol} owner
   * @returns {Iterator.<Card>}
   */
  static *_generateOnlineCardsForTeam(owner) {
    for (let type of OnlineCardType.values()) {
      for (let item of Card._generateOnlineCardsOfTypeForTeam(owner, type)) {
        yield item
      }
    }
  }

  /**
   * @function _generateOnlineCardsOfTypeForTeam
   * @memberof Card
   * @access private
   * @static
   * @param {Symbol} owner
   * @param {Symbol} type
   * @returns {Iterator.<Card>}
   */
  static *_generateOnlineCardsOfTypeForTeam(owner, type) {
    for (let i = 0; i < 4; i++) {
      yield new Card({
        type,
        owner
      })
    }
  }

}
