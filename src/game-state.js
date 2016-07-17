const Board = require('./board')
const Card = require('./card')
const getEnemyTeam = require('./get-enemy-team')
const OnlineCardType = require('./online-card-type')
const Team = require('./team')
const TerminalCardType = require('./terminal-card-type')

/**
 * Initializes a new instance of `GameState`.
 * @class GameState
 * @classdesc The game state.
 */
module.exports = class GameState {

  constructor() {

    // Initialize cards.
    let cards = new Map(
      [
        [Team.top, []],
        [Team.bottom, []]
      ]
    )
    this._cards = cards

    // Initialize terminal card state.
    let terminalCardState = new Map()
    for (let team of Team.values()) {
      let state = new Map()
      for (let type of TerminalCardType.values()) {
        state.set(type, false)
      }
      terminalCardState.set(team, state)
    }
    this._terminalCardState = terminalCardState

    // Initialize card score.
    let cardScore = new Map()
    for (let team of Team.values()) {
      let o = new Map()
      for (let type of OnlineCardType.values()) {
        o.set(type, 0)
      }
      cardScore.set(team, o)
    }
    this._cardScore = cardScore

    this._board = new Board()
    this._startingPlayer = null
    this._moves = []
  }

  /**
   * Initializes the GameState to a starting state.
   * @function initialize
   * @memberof GameState.prototype
   * @param {Object} opts
   * @param {?Symbol} [opts.startingTeam] {@link Team}
       The starting team. If null, any team can submit their first move.
   * @param {Map.<Symbol, number[]>} opts.arrangement
   *   The arrangement for each {@link Team} player, where each array element
   *   indicates the number of link cards to put before each virus card.
   */
  initialize(opts) {

    if (typeof opts !== 'object') {
      throw new TypeError("args must be an object")
    }

    let { arrangement, startingTeam } = opts

    if (!(arrangement instanceof Map)) {
      arrangement = new Map(arrangement)
    }
    if (!(startingTeam == null || Team.hasValue(startingTeam) === 'string')) {
      throw new TypeError("opts.startingPlayer must be a member of Team")
    }

    for (let team of Team.values()) {
      this.cards.set(team, generateForArrangement(arrangement, team))
    }

    for (let team of Team.values()) {
      let toPlace = this.cards.get(team).slice()
      for (let square of this.board.startingSquares.get(team)) {
        square.card = toPlace.shift()
      }
    }

    if (startingTeam != null) {
      this.turn = startingTeam
    }
    this._startingTeam = startingTeam
  }

  /**
   * The game board.
   * @var {Board} board
   * @memberof GameState.prototype
   * @readonly
   */
  get board() {
    return this._board
  }

  /**
   * The online cards owned by each {@link Team} player.
   * @var {Map.<Symbol, Card[]>} cards
   * @memberof GameState.prototype
   * @readonly
   */
  get cards() {
    return this._cards
  }

  /**
   * {@link Team} The starting player.
   * @var {?Symbol} startingPlayer
   * @memberof GameState.prototype
   * @deprecated
   * @readonly
   */
  get startingPlayer() {
    return this._startingTeam
  }

  /**
   * {@link Team} The starting player.
   * @var {?Symbol} startingTeam
   * @memberof GameState.prototype
   * @readonly
   */
  get startingTeam() {
    return this._startingTeam
  }

  /**
   * {@link Team} The player whose turn it is.
   * Value can be null from `startingPlayer = null` but cannot be set to `null`.
   * Throws `TypeError`.
   * @var {?Symbol} turn
   * @memberof GameState.prototype
   */
  get turn() {
    return this._turn
  }
  set turn(value) {
    if (!Team.hasValue(value)) {
      throw new TypeError("turn must be a member of Team")
    }
    this._turn = value
  }

  /**
   * The moves done so far on the game.
   * @var {Move[]} moves
   * @memberof GameState.prototype
   * @readonly
   */
  get moves() {
    return this._moves
  }

  /**
   * The state of each terminal card keyed by {@link Team} player.
   * Falsy if the card is not installed or consumed.
   * For line boost and firewall, the relevant {@link Square} square.
   * @var {Map.<Symbol, Map.<TerminalCardType, ?(Square|boolean)>>} terminalCardState
   * @memberof GameState.prototype
   * @readonly
   */
  get terminalCardState() {
    return this._terminalCardState
  }

  /**
   * The card score of each player,
   * keyed by {@link Team} player then by `OnlineCardType`.
   * @var {Map.<Symbol, Map.<Symbol, number>>} cardScore
   * @memberof GameState.prototype
   * @readonly
   */
  get cardScore() {
    return this._cardScore
  }

  /**
   * {@link Team} The winner of the game.
   * @var {?Symbol} winner
   * @memberof GameState.prototype
   * @readonly
   */
  get winner() {
    if (this.winnerBySurrender) {
      return this.winnerBySurrender
    }
    if (this._winner) {
      return this._winner
    }
    for (let team of Team.values()) {
      if (this.cardScore.get(team).get(OnlineCardType.link) >= 4) {
        this._winner = team
        return team
      }
      if (this.cardScore.get(team).get(OnlineCardType.virus) >= 4) {
        let enemy = getEnemyTeam(team)
        this._winner = enemy
        return enemy
      }
    }
  }

  /**
   * {@link Team} The winner of the game when the other player surrenders.
   * Can be null but cannot be set to null. Throws `TypeError`.
   * @var {?Symbol}
   */
  get winnerBySurrender() {
    return this._winnerBySurrender
  }
  set winnerBySurrender(value) {
    if (!Team.hasValue(value)) {
      throw new TypeError("winnerBySurrender must a member of Team")
    }
    this._winnerBySurrender = value
  }

}

/**
 * @function {Card[]} generateForArrangement
 * @access private
 * @param {Map} arrangementObj
 * @param {Symbol} team
 */
function generateForArrangement(arrangementObj, team) {

  let arrangement = arrangementObj.get(team)

  arrangement = Array.from(arrangement)

  let cards = []
  let linkCards = Array.from(
    Card.generateOnlineCardsForTeam(team, OnlineCardType.link)
  )
  let virusCards = Array.from(
    Card.generateOnlineCardsForTeam(team, OnlineCardType.virus)
  )

  for (let i = 0; i < arrangement.length; i++) {

    let linkCount = arrangement[i]
    if (!Number.isFinite(linkCount) || linkCount < 0) {
      throw new TypeError("invalid number for arrangement element")
    }

    for (let j = 0; j < linkCount; j++) {
      let linkCard = linkCards.pop()
      if (linkCard === undefined) {
        break
      }
      cards.push(linkCard)
    }

    let virusCard = virusCards.pop()
    if (virusCard === undefined) {
      break
    }
    cards.push(virusCard)
  }
  cards = cards.concat(virusCards)
  cards = cards.concat(linkCards)
  return cards
}
