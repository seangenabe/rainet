
var assert = require('assert')
var GameState = require('./game-state')
var InvalidMoveError = require('./invalid-move-error')
var Move = require('./move')
var OnlineCardMove = require('./online-card-move')
var TerminalCardMove = require('./terminal-card-move')
var StackedOnlineCard = require('./stacked-online-card')
var InstallableTerminalCardMove = require('./installable-terminal-card-move')
var NotFoundTerminalCardMove = require('./not-found-terminal-card-move')
var TerminalCardType = require('./terminal-card-type')
var Team = require('./team')
var Square = require('./square')
var Direction = require('./direction')
var StackCause = require('./stack-cause')
var Card = require('./card')
var getEnemyTeam = require('./get-enemy-team')
var OnlineCardType = require('./online-card-type')
var values = require('./util/values')
var merge = require('./util/merge')

const teams = values(Team)

/**
 * Represents a game
 * @class
 * @memberof RaiNet
 */
class Game {

  constructor() {
    this._state = new GameState()
    this._isInitialized = false
    this._winningTeam = null
  }

  /**
   * The game's state
   * @returns {GameState}
   */
  get state() {
    return this._state
  }
  /** @param {GameState} value */
  set state(value) {
    assert(value instanceof GameState)
    this._state = value
  }

  /**
   * Start the game.
   * @param {object} startArgs
   * @param {Symbol} startArgs.startingTeam
   * @param {Object.<Symbol, Array<number>>} startArgs.arrangement
   */
  start(startArgs) {
    this.state.initialize(startArgs)
    this.isInitialized = true
  }

  /**
   * Submits a move to the game and modifies the game state.
   * @throws {InvalidMoveError} The move is not allowed.
   * @returns ExecutedMoveData
   */
  submitMove(move) {

    assert(move instanceof Move, "Invalid argument: move")

    var ret = { terminal: [] }

    // Validations
    if (!this.isInitialized)
      throw new Error("Game has not been initialized.")
    if (this.state.winner != null)
      throw new Error("Game has already ended.")

    // Check if it's the specified team's turn.
    var team = this.state.turn
    var nullTeamFlag = team == null
    if (nullTeamFlag) {
      team = move.team
    }
    else {
      // Verify submitted move player.
      if (team != move.team)
        throw new InvalidMoveError("It is not the turn of the player of the specified move.")
    }

    var currentSquare = move.source // can be null when move.uninstall === true
    var card = currentSquare ? currentSquare.card : null;

    // Check if the card moved is an online card.
    if (move instanceof OnlineCardMove) {

      // Require the owner's card in the specified square.
      this._requireTeamCardOnSquare(currentSquare, team)

      // Check if we can move the card.
      var submove1 = this._tryMoveToSquare(team, currentSquare, move.direction)
      var submove2

      if (submove1.server) {
        submove1.revealCard = move.revealCard
      }
      if (move.direction2) {
        // Check if we're line boosted and the first submove is move-ending.
        // (Which is an invalid move since the first submove ended
        // but the player attempts to make a second one.)
        if (submove1.stop) {
          throw new InvalidMoveError("Cannot do second move due to the first move having ended.")
        }

        // Check if we can move the card a second time.
        submove2 = this._tryMoveToSquare(team, submove1.destinationSquare, move.direction2)
        if (submove2.server) {
          submove2.revealCard = move.revealCard
        }
      }

      // Execute the moves.
      var realSubmove = this._moveToSquare(team, submove1, card, currentSquare)
      if (submove2 != null) {
        realSubmove = this._moveToSquare(team, submove2, card, submove1.destinationSquare)
      }

      merge(ret, realSubmove)
    }
    else {
      // Check if the card moved is an installable terminal card.
      if (move instanceof InstallableTerminalCardMove) {

        // Check if not installed / already installed.
        // (Condensed version that accounts for both installation and uninstallation using an XOR (!=))
        if (move.uninstall !== this.state.terminalCardState[team][move.cardType]) {
          throw new InvalidMoveError("Terminal card is already installed / uninstalled.")
        }

        // Check if the card moved is a Line Boost card.
        if (move.cardType === TerminalCardType.lineBoost) {

          if (move.uninstall) {

            card = this.state.lineBoostLocation[team].card

            // Uninstall line boost.
            this._uninstallLineBoostCore(team, card)
          }
          else {

            // Require the owner's card in the specified square.
            this._requireTeamCardOnSquare(currentSquare, team)

            // Check if the square is given.
            if (currentSquare == null)
              throw new InvalidMoveError("Source square not specified.")

            // Make sure the card on the square has line boost uninstalled.
            if (card.lineBoosted)
              throw new Error("Invalid game state.")

            // Install line boost.
            this.state.lineBoostLocation[team] = currentSquare
            this.state.terminalCardState[team][TerminalCardType.lineBoost] = true

            card.lineBoosted = true
          }
        }
        // Check if the card is a Firewall card.
        else if (move.cardType === TerminalCardType.firewall) {

          if (move.uninstall) {

            // Uninstall firewall.
            this.state.firewallLocation[team].firewall = null
            this.state.firewallLocation[team] = null
            this.state.terminalCardState[team][TerminalCardType.firewall] = false
          }
          else {

            // Check if the target square has an enemy card.
            if (currentSquare.card != null && currentSquare.card.owner != team) {
              throw new InvalidMoveError("Cannot install firewall on a square occupied by an enemy card.")
            }

            // Install firewall.
            currentSquare.firewall = team
            this.state.firewallLocation[team] = currentSquare
            this.state.terminalCardState[team][TerminalCardType.firewall] = true
          }
        }
        else {

          throw new Error("Invalid type for terminal card.")
        }
      }
      else if (move instanceof NotFoundTerminalCardMove) {

        // Check if the card is a 404 Not Found card.
        if (move.cardType === TerminalCardType.notFound) {

          // Check if the card is not consumed.
          if (this.state.terminalCardState[team][TerminalCardType.notFound]) {
            throw new InvalidMoveError("404 Not Found card already consumed.")
          }

          // Require own cards on both squares.
          this._requireTeamCardOnSquare(currentSquare, team)
          var other: Square = move.other
          this._requireTeamCardOnSquare(other, team)
          var otherCard: Card = other.card

          if (move.swap) {

            // Swap the cards.
            currentSquare.card = other.card
            other.card = card
            function lineBoostSwap(c1, c2) {

              if (c1.lineBoosted) {
                c2.lineBoosted = true
                c1.lineBoosted = false
              }
            }
            lineBoostSwap(card, otherCard)
            lineBoostSwap(otherCard, card)
            card.revealed = false
            otherCard.revealed = false
          }
        }
        else {

          throw new Error("Invalid type for terminal card.")
        }
      }
      else if (move instanceof TerminalCardMove) {

        // Check if the card is a Virus Checker card.
        if (tmove.cardType === TerminalCardType.virusCheck) {

          // Check if the card is not consumed.
          if (this.state.terminalCardState[team][TerminalCardType.virusCheck]) {
            throw new InvalidMoveError("Virus Checker already consumed.")
          }

          // Check if the card is owned by the enemy team.
          if (card == null || card.owner === team) {
            throw new InvalidMoveError("Invalid target square for Virus Checker.")
          }

          // Reveal the card.
          card.revealed = true

          this.state.terminalCardState[team][TerminalCardType.virusCheck] = true
        }
        else {

          throw new Error("Invalid type for terminal card.")
        }
      }
      else {

        throw new Error("Unrecognized move.")
      }

      ret.terminal.push({
        type: move.cardType,
        team: team,
        uninstall: move.uninstall
      })
    }

    // Add move to move history.
    this.state.moves.push(move)

    if (nullTeamFlag) {
      // We have to set this after all the throw statements
      // so we don't change the game state when they throw.
      this.state.turn = team
    }

    // Detect winner.
    var winner = this.state.winner
    if (winner != null) {
      ret.winner = winner
    }
    else {
      // Pass to next player.
      this.state.turn = this._getNextPlayer()
    }

    return ret
  }

  /**
   * Returns the next player to play.
   * @returns {Symbol} Team
   * @private
   */
  _getNextPlayer() {
    return getEnemyTeam(this.state.turn)
  }

  /**
   * Test if an online card can be moved.
   * @param {Symbol} team Team
   * @param {Square} source
   * @param {Symbol} direction Direction
   * @returns {MoveParameters}
   * @private
   */
  _tryMoveToSquare(team, source, direction) {

    var destinationSquare = source.adjacentSquares[direction]

    // Check if the square is not outside the board.
    if (destinationSquare == null) {
      throw new InvalidMoveError("Invalid destination square. Check if the card is moved outside the board.")
    }

    // Check if the card is moving toward an enemy firewall.
    if (destinationSquare.firewall != null && destinationSquare.firewall != team) {
      throw new InvalidMoveError("Cannot move card to firewalled square.")
    }

    // Check if the card is moving towards own server area.
    if (destinationSquare === this.state.board.server[team]) {
      throw new InvalidMoveError('Cannot move to own server area.');
    }

    var ret

    for (let enemy of teams) {
      if (enemy != team && destinationSquare === this.state.board.server[enemy]) {
        ret = {
          destinationSquare: destinationSquare,
          stop: true,
          server: enemy
        }
        break
      }
    }

    if (ret != null)
      return ret

    if (destinationSquare.card != null) {

      // Destination not empty.

      // Check owner.
      if (destinationSquare.card.owner == team) {
        throw new InvalidMoveError("Cannot move to a square occupied by player's own card.")
      }

      return {
        destinationSquare: destinationSquare,
        stop: true,
        capture: true
      }
    }

    return {
      destinationSquare: destinationSquare
    }
  }


  /**
   * Execute a submove.
   * @param {Symbol} team Team
   * @param {MoveParameters} move
   * @param {Card} card
   * @param {Square} source
   * @returns {object}
   */
  _moveToSquare(team, move, card, source) {

    var ret = { terminal: [] }

    if (move.server) {

      // Uninstall the line boost from the card if present.
      if (card.lineBoosted) {
        this._uninstallLineBoostCore(team, card)
        ret.terminal.push({
          team: team,
          type: TerminalCardType.lineBoost,
          uninstall: true
        })
      }

      // Reveal the card.
      if (move.revealCard) {
        card.revealed = true
      }

      // Remove the card.
      source.card = null

      // Add to stack.
      var stacked = new StackedOnlineCard(card, StackCause.infiltrated)
      this.state.board.stackArea[team].push(stacked)
      ret.deltaStackArea = [{owner: team, stacked: stacked}]

      // Add score.
      this.state.cardScore[team][card.type]++

      ret.server = {
        serverTeam: move.server
      }

      return ret
    }
    if (move.capture) {

      var enemyCard = move.destinationSquare.card
      var enemy = enemyCard.owner

      // Reveal card.
      enemyCard.revealed = true

      // Add to stack.
      var enemyStacked = new StackedOnlineCard(card, StackCause.captured)
      this.state.board.stackArea[team].push(enemyStacked)
      ret.deltaStackArea = [{owner: team, stacked: enemyStacked}]

      // Uninstall the line boost from the enemy card if present.
      if (enemyCard.lineBoosted) {
        this._uninstallLineBoostCore(enemy, enemyCard)
        ret.terminal.push({
          team: enemy,
          type: TerminalCardType.lineBoost,
          uninstall: true
        })
      }

      // Add score.
      this.state.cardScore[team][enemyCard.type]++

      ret.capture = {
        subject: team,
        object: enemy,
        type: enemyCard.type
      }
    }
    // Move the card.
    move.destinationSquare.card = card
    source.card = null
    // Update line boost location.
    this.state.lineBoostLocation[team] = move.destinationSquare

    return ret
  }

  // This is a core method; verifications about the current game state should be made beforehand.
  /**
   * Uninstall the player's line boost card.
   * @param {Symbol} team Team
   * @param {Card} card
   */
  _uninstallLineBoostCore(team, card) {
    this.state.terminalCardState[team][TerminalCardType.lineBoost] = false
    this.state.lineBoostLocation[team] = null
    card.lineBoosted = false
  }

  /**
   * Throws an exception if the board square does not have a card owned by the player.
   * @param {Square} square
   * @param {Symbol} team Team
   */
  _requireTeamCardOnSquare(square, team) {

    try {
      if (square == null)
        throw new InvalidMoveError("Source square not provided.")

      if (square.card == null)
        throw new InvalidMoveError("There is no card on that square.")

      if (square.card.owner != team) {
        throw new InvalidMoveError("The player does not own an online card on that square.")
      }
    }
    catch (err) {
      throw err
    }
  }

}

/**
 * @typedef {Object} MoveParameters
 * @property {Square} destinationSquare
 * @property {boolean} [stop]
 * @property {Symbol} [server]
 * @property {boolean} [capture]
 * @property {boolean} [revealCard]
 */

/**
 * @typedef ExecutedSubmoveTerminalCardData
 * @property {Team}  team  The team that owns the terminal card.
 * @property {TerminalCardType}  type  The type of the terminal card.
 * @property {?boolean}  uninstall  Whether to uninstall the terminal card.
 */

/**
 * @typedef ExecutedSubmoveData
 * @property {ExecutedSubmoveTerminalCardData[]}  terminal
 * @property {?object}  server
 * @property {Team}  server.serverTeam  The team of the invaded server.
 * @property {?object}  capture
 * @property {Team}  capture.subject  The team capturing the card.
 * @property {OnlineCardType}  capture.type  The type of the captured card.
 */

/**
 * @typedef ExecutedMoveData
 * @extends ExecutedSubmoveData
 * @property {?Team} winner
 */

module.exports = Game
