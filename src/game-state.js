
var assert = require('assert')
var Board = require('./board')
var Card = require('./card')
var Team = require('./team')
var Move = require('./move')
var TerminalCardType = require('./terminal-card-type')
var OnlineCardType = require('./online-card-type')
var values = require('./util/values')
var getEnemyTeam = require('./get-enemy-team')

const teams = values(Team)
const terminalCardTypes = values(TerminalCardType)
const onlineCardTypes = values(OnlineCardType)

/**
 * The game state.
 * @class
 * @memberof RaiNet
 */
class GameState {

  constructor() {

    // Initialize cards.
    var cards = {}
    cards[Team.top] = []
    cards[Team.bottom] = []
    this._cards = Object.seal(cards)

    // Initialize terminal card state.
    var terminalCardState = {}
    for (let team of teams) {
      let o = {}
      for (let type of terminalCardTypes) {
        o[type] = false
      }
      terminalCardState[team] = Object.seal(o)
    }
    this._terminalCardState = Object.seal(terminalCardState)

    var lineBoostLocation = {}
    for (let team of teams) {
      lineBoostLocation[team] = null
    }
    this._lineBoostLocation = Object.seal(lineBoostLocation)

    var firewallLocation = {}
    for (let team of teams) {
      firewallLocation[team] = null
    }
    this._firewallLocation = Object.seal(firewallLocation)

    // Initialize card score.
    var cardScore = {}
    for (let team of teams) {
      let o = {}
      for (let type of onlineCardTypes) {
        o[type] = 0
      }
      cardScore[team] = Object.seal(o)
    }
    this._cardScore = Object.seal(cardScore)

    this._board = new Board()
    this._startingPlayer = null
    this._moves = []
  }

  /**
   * Initializes the GameState to a starting state.
   * @param {Object} args
   * @param {?Symbol} [args.startingTeam] The starting team.
   * @param {Object.<Symbol, number[]>} args.arrangement The arrangement, where each array element indicates the number of link cards to put before each virus card.
   */
  initialize(args) {

    var arrangement = args.arrangement
    var startingPlayer = args.startingPlayer

    assert(typeof(args) === 'object', "Invalid argument: args")
    assert(startingPlayer == null || typeof(Team[startingPlayer]) === 'string', "Invalid argument: args.startingPlayer")
    assert(typeof(arrangement) === 'object', "Invalid argument: args.arrangement")
    assert(Array.isArray(arrangement[Team.top]), "Invalid argument: args.arrangement[Team.top]")
    assert(Array.isArray(arrangement[Team.bottom]), "Invalid argument: args.arrangement[Team.bottom]")

    if (arrangement != null) {
      this.cards[Team.top] = generateForArrangement(arrangement, Team.top)
      this.cards[Team.bottom] = generateForArrangement(arrangement, Team.bottom)
    }
    else {
      for (let team of teams) {
        this.cards[team] = Card.generateOnlineCardsForTeam(team)
      }
    }

    var topToPlace = [].concat(this.cards[Team.top])
    var bottomToPlace = [].concat(this.cards[Team.bottom])
    for (let team of teams) {
      let toPlace = this.cards[team].slice()
      for (let square of this.board.startingSquares[team]) {
        square.card = toPlace.shift()
      }
    }

    if (startingPlayer != null)
      this.turn = startingPlayer
    this._startingPlayer = startingPlayer
  }

  /**
   * The game board.
   * @returns {Board}
   */
  get board() {
    return this._board
  }

  /**
   * The online cards owned by each player.
   * @returns {Object.<Symbol, Card>} Team => Card
   */
  get cards() {
    return this._cards
  }

  /**
   * The starting player.
   * @returns {?Symbol} Team
   */
  get startingPlayer() {
    return this._startingPlayer
  }

  /**
   * The player whose turn it is.
   * @returns {?Symbol} Team
   */
  get turn() {
    return this._turn
  }
  /** @param {?Symbol} value Team The value. Note: null assignment not allowed. */
  set turn(value) {
    assert(typeof(Team[value]) === 'string')
    this._turn = value
  }

  /**
   * The moves done so far on the game.
   * @returns {Move[]}
   */
  get moves() {
    return this._moves
  }

  /**
   * The state of each terminal card.
   * Set to true if the card is installed or consumed, false otherwise.
   * @returns {Object.<Symbol, Object.<Symbol, boolean>>} Team => TerminalCardType => boolean
   */
  get terminalCardState() {
    return this._terminalCardState
  }

  /**
   * Convenience variable to look up the current square of the line boost card.
   * @returns {Object.<Symbol, Square>} Team => Square
   */
  get lineBoostLocation() {
    return this._lineBoostLocation
  }

  /**
   * Convenience variable to look up the current square of the firewall card.
   * @returns {Object.<Symbol, Square>} Team => Square
   */
  get firewallLocation() {
    return this._firewallLocation
  }

  /**
   * The card score of each player.
   * @returns {Object.<Symbol, Object.<Symbol, number>>} Team => OnlineCardType => number
   */
  get cardScore() {
    return this._cardScore
  }

  /**
   * The winner of the game.
   * @returns {?Symbol} Team
   */
  get winner() {
    if (this._winner)
      return this._winner
    for (let team of teams) {
      if (this.cardScore[team][OnlineCardType.link] >= 4) {
        this._winner = team
        return team
      }
      if (this.cardScore[team][OnlineCardType.virus] >= 4) {
        return getEnemyTeam(team)
      }
    }
    return null
  }
}

/**
 * @param {Object} arrangementObj
 * @param {Symbol} team
 * @returns {Card[]}
 */
function generateForArrangement(arrangementObj, team) {

  var arrangement = arrangementObj[team]

  if (!Array.isArray(arrangement))
    arrangement = []

  var cards = []
  var linkCards = Card.generateOnlineCardsForTeam(team, OnlineCardType.link)
  var virusCards = Card.generateOnlineCardsForTeam(team, OnlineCardType.virus)

  for (let i = 0; i < arrangement.length; i++) {

    let linkCount = arrangement[i]
    assert(typeof(linkCount) === 'number')

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
  cards = cards.concat(linkCards)
  return cards
}

module.exports = GameState
