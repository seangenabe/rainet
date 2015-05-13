
var assert = require('assert')
var OnlineCardType = require('./online-card-type')
var Team = require('./team')
var values = require('./util/values')

const onlineCardTypes = values(OnlineCardType)

/**
 * Represents an online card.
 * @class
 * @memberof RaiNet
 * @param {Symbol} opts.type
 * @param {Symbol} opts.owner
 */
class Card {

  constructor(opts) {

    assert(typeof(opts) === 'object', "Invalid argument: opts")
    assert(typeof(OnlineCardType[opts.type]) === 'string', "Invalid argument: opts.type")
    assert(typeof(Team[opts.owner]) === 'string', "Invalid argument: opts.owner")

    var {type, owner} = opts
    this._type = type
    this._owner = owner
    this.revealed = false
    this.lineBoosted = false

    Object.seal(this)
  }

  /**
   * The type of the online card.
   * @returns {Symbol} OnlineCardType
   */
  get type() {
    return this._type
  }

  /**
   * The team who owns the online card.
   * @returns {Symbol} A Team value.
   */
  get owner() {
    return this._owner
  }

  /**
   * Whether this card has been revealed by a Virus Checker card.
   * @returns {boolean}
   */
  get revealed(): boolean {
    return this._revealed
  }
  /** @param {boolean} value */
  set revealed(value) {
    this._revealed = !!value
  }

  /**
   * Whether this card is line boosted.
   * @returns {boolean}
   */
  get lineBoosted() {
    return this._lineBoosted
  }
  /** @param {boolean} value */
  set lineBoosted(value) {
    this._lineBoosted = !!value
  }

  /**
   * Generates online cards of the specified type for the specified team.
   * @static
   * @param {Symbol} owner Player
   * @param {Symbol} [type] OnlineCardType
   * @returns {Card[]}
   */
  static generateOnlineCardsForTeam(owner, type) {

    assert(typeof(Team[owner]) === 'string')
    assert(typeof(OnlineCardType[type]) === 'string')

    if (type)
      return Card._generateOnlineCardsOfTypeForTeam(owner, type)
    else
      return Card._generateOnlineCardsForTeam(owner)
  }

  /**
   * @param {Symbol} owner
   * @returns {Card[]}
   * @private
   */
  static _generateOnlineCardsForTeam(owner) {
    var cards = []
    for (let type of onlineCardTypes) {
      cards = cards.concat(Card._generateOnlineCardsOfTypeForTeam(owner, type))
    }
    return cards
  }

  /**
   * @param {Symbol} owner
   * @param {Symbol} type
   * @returns {Card[]}
   * @private
   */
  static _generateOnlineCardsOfTypeForTeam(owner, type) {
    var cards = []
    for (let i = 0; i < 4; i++) {
      cards.push(new Card({
        type: type,
        owner: owner
      }))
    }
    return cards
  }

}

module.exports = Card
