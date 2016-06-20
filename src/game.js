'use strict'

const assign = require('lodash.assign')
const GameState = require('./game-state')
const getEnemyTeam = require('./get-enemy-team')
const InstallableTerminalCardMove = require('./installable-terminal-card-move')
const InvalidMoveError = require('./invalid-move-error')
const Move = require('./move')
const NotFoundTerminalCardMove = require('./not-found-terminal-card-move')
const OnlineCardMove = require('./online-card-move')
const StackCause = require('./stack-cause')
const StackedOnlineCard = require('./stacked-online-card')
const SurrenderMove = require('./surrender-move')
const TerminalCardMove = require('./terminal-card-move')
const TerminalCardType = require('./terminal-card-type')

/**
 * Initializes a new instance of `Game`.
 * @class Game
 * @classdesc Represents a game.
 */
module.exports = class Game {

  constructor() {
    this._state = new GameState()
    this._isInitialized = false
    this._winningTeam = null
  }

  /**
   * The game's state. Throws `TypeError`.
   * @var {GameState} state
   * @memberof Game.prototype
   */
  get state() {
    return this._state
  }
  set state(value) {
    if (!(value instanceof GameState)) {
      throw new TypeError("state must be a GameState.")
    }
    this._state = value
  }

  /**
   * Starts the game.
   * @function start
   * @memberof Game.prototype
   * @param {object} startArgs Passed to {@link GameState#initialize}
   * @param {Symbol} startArgs.startingTeam
   * @param {Object.<Symbol, Array<number>>} startArgs.arrangement
   */
  start(startArgs) {
    this.state.initialize(startArgs)
    this.isInitialized = true
  }

  /**
   * Submits a move to the game and modifies the game state.
   * @function submitMove
   * @memberof Game.prototype
   * @returns {ExecutedMoveData}
   * @throws {InvalidMoveError} The move is not allowed.
   * @throws {TypeError}
   */
  submitMove(move) {
    let { state } = this
    let { terminalCardState } = state

    if (!(move instanceof Move)) {
      throw new TypeError("move must be a Move")
    }

    let ret = { terminal: [] }

    // Validations
    if (!this.isInitialized) {
      throw new Error("Game has not been initialized.")
    }

    if (state.winner != null) {
      throw new Error("Game has already ended.")
    }

    // Check for a surrender move (a team can surrender at any time)
    if (move instanceof SurrenderMove) {
      let winnerBySurrender = getEnemyTeam(move.team)
      state.winnerBySurrender = winnerBySurrender
      // Add move to move history.
      state.moves.push(move)
      return { winner: winnerBySurrender }
    }

    // Check if it's the specified team's turn.
    let team = state.turn
    let nullTeamFlag = team == null
    if (nullTeamFlag) {
      team = move.team
    }
    else {
      // Verify submitted move player.
      if (team !== move.team) {
        throw new InvalidMoveError("It is not the turn of the player of the specified move.")
      }
    }

    let terminalCardState_team = terminalCardState.get(team)
    let currentSquare = move.source // can be null when move.uninstall === true
    let card = currentSquare ? currentSquare.card : null;

    // Check if the card moved is an online card.
    if (move instanceof OnlineCardMove) {

      // Require the owner's card in the specified square.
      this._requireTeamCardOnSquare(currentSquare, team)

      // Check if we can move the card.
      let submove1 = this._tryMoveToSquare(team, currentSquare, move.direction)
      let submove2

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
        submove2 = this._tryMoveToSquare(
          team,
          submove1.destinationSquare,
          move.direction2
        )

        if (submove2.server) {
          submove2.revealCard = move.revealCard
        }
      }

      // Execute the moves.
      let realSubmove = this._moveToSquare(team, submove1, card, currentSquare)
      if (submove2 != null) {
        realSubmove =
          this._moveToSquare(team, submove2, card, submove1.destinationSquare)
      }

      assign(ret, realSubmove)
    }
    else {
      // Check if the card moved is an installable terminal card.
      if (move instanceof InstallableTerminalCardMove) {

        // Check if not installed / already installed.
        // (Condensed version that accounts for both installation
        //  and uninstallation using an XOR (!=))
        let isInstalled = terminalCardState_team.get(move.cardType)
        if (move.uninstall !== isInstalled) {
          throw new InvalidMoveError("Terminal card is already installed / uninstalled.")
        }

        // Check if the card moved is a Line Boost card.
        if (move.cardType === TerminalCardType.lineBoost) {
          if (move.uninstall) {

            // Get the card on the square.
            card = terminalCardState_team.get(TerminalCardType.lineBoost).card

            // Uninstall line boost.
            this._uninstallLineBoostCore(team, card)
          }
          else {

            // Require the owner's card in the specified square.
            this._requireTeamCardOnSquare(currentSquare, team)

            // Check if the square is given.
            if (currentSquare == null) {
              throw new InvalidMoveError("Source square not specified.")
            }

            // Make sure the card on the square has line boost uninstalled.
            if (card.lineBoosted) {
              throw new Error("Invalid game state.")
            }

            // Install line boost.
            terminalCardState_team.set(TerminalCardType.lineBoost, currentSquare)

            card.lineBoosted = true
          }
        }
        // Check if the card is a Firewall card.
        else if (move.cardType === TerminalCardType.firewall) {

          if (move.uninstall) {

            // Uninstall firewall.
            terminalCardState_team.get(TerminalCardType.firewall)
              .firewall = null
            terminalCardState_team.set(TerminalCardType.firewall, null)
          }
          else {

            // Check if the target square has an enemy card.
            if (card != null && card.owner !== team) {
              throw new InvalidMoveError("Cannot install firewall on a square occupied by an enemy card.")
            }

            // Check if enemy firewall is installed.
            if (currentSquare.firewall != null) {
              throw new InvalidMoveError("Cannot install firewall on a square where enemy firewall is installed.")
            }

            // Install firewall.
            currentSquare.firewall = team
            terminalCardState_team.set(TerminalCardType.firewall, currentSquare)
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
          if (terminalCardState.get(team).get(TerminalCardType.notFound)) {
            throw new InvalidMoveError("404 Not Found card already consumed.")
          }

          // Require own cards on both squares.
          this._requireTeamCardOnSquare(currentSquare, team)
          let other = move.other
          this._requireTeamCardOnSquare(other, team)
          let otherCard = other.card

          if (move.swap) {

            // Swap the cards.
            currentSquare.card = other.card
            other.card = card
            let lineBoostSwap = function lineBoostSwap(c1, c2) {

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
        if (move.cardType === TerminalCardType.virusCheck) {

          // Check if the card is not consumed.
          if (terminalCardState.get(team).has(TerminalCardType.virusCheck)) {
            throw new InvalidMoveError("Virus Checker already consumed.")
          }

          // Check if the card is owned by the enemy team.
          if (card == null || card.owner === team) {
            throw new InvalidMoveError("Invalid target square for Virus Checker.")
          }

          // Reveal the card.
          card.revealed = true

          terminalCardState.get(team).set(TerminalCardType.virusCheck, true)
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
    state.moves.push(move)

    if (nullTeamFlag) {
      // We have to set this after all the throw statements
      // so we don't change the game state when they throw.
      state.turn = team
    }

    // Detect winner.
    let winner = state.winner
    if (winner != null) {
      ret.winner = winner
    }
    else {
      // Pass to next player.
      state.turn = this._getNextPlayer()
    }

    return ret
  }

  /**
   * Returns the next player to play.
   * @function _getNextPlayer
   * @memberof Game.prototype
   * @access private
   * @returns {Symbol} {@link Team}
   */
  _getNextPlayer() {
    return getEnemyTeam(this.state.turn)
  }

  /**
   * Test if an online card can be moved.
   * @function _tryMoveToSquare
   * @memberof Game.prototype
   * @access private
   * @param {Symbol} team {@link Team} The team executing the move.
   * @param {Square} source The source square of the online card.
   * @param {Symbol} direction
   *   {@link Direction} The direction to move the card into.
   * @returns {MoveParameters}
   * @throws {InvalidMoveError}
   */
  _tryMoveToSquare(team, source, direction) {

    let destinationSquare = source.adjacentSquares.get(direction)

    // Check if the square is not outside the board.
    if (destinationSquare == null) {
      throw new InvalidMoveError("Invalid destination square. Check if the card is moved outside the board.")
    }

    // Check if the card is moving toward an enemy firewall.
    {
      let firewall = destinationSquare.firewall
      if (firewall != null && firewall !== team) {
        throw new InvalidMoveError("Cannot move card to firewalled square.")
      }
    }

    // Check if the card is moving towards own server area.
    if (destinationSquare === this.state.board.server.get(team)) {
      throw new InvalidMoveError('Cannot move to own server area.');
    }

    // Check if the card is moving towards the enemy server area.
    {
      let enemy = getEnemyTeam(team)
      if (destinationSquare === this.state.board.server.get(enemy)) {
        return {
          destinationSquare: destinationSquare,
          stop: true,
          server: enemy
        }
      }
    }

    if (destinationSquare.card != null) {

      // Destination is not empty.

      // Check if player owns card in the destination.
      if (destinationSquare.card.owner === team) {
        throw new InvalidMoveError("Cannot move to a square occupied by player's own card.")
      }

      return {
        destinationSquare: destinationSquare,
        stop: true,
        capture: true
      }
    }

    // Destination is not empty.
    return {
      destinationSquare: destinationSquare
    }
  }

  /**
   * Executes a submove.
   * @function _moveToSquare
   * @memberof Game.prototype
   * @access private
   * @param {Symbol} team Team
   * @param {MoveParameters} move
   * @param {Card} card
   * @param {Square} source
   * @returns {object}
   */
  _moveToSquare(team, move, card, source) {

    let ret = { terminal: [] }

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
      let stacked = new StackedOnlineCard(card, StackCause.infiltrated)
      this.state.board.stackArea.get(team).push(stacked)
      ret.deltaStackArea = [{owner: team, stacked: stacked}]

      // Add score.
      {
        let teamScore = this.state.cardScore.get(team)
        teamScore.set(card.type, teamScore.get(card.type) + 1)
      }

      ret.server = {
        serverTeam: move.server
      }

      return ret
    }
    if (move.capture) {

      let enemyCard = move.destinationSquare.card
      let enemy = enemyCard.owner

      // Reveal card.
      enemyCard.revealed = true

      // Add to stack.
      let enemyStacked = new StackedOnlineCard(card, StackCause.captured)
      this.state.board.stackArea.get(team).push(enemyStacked)
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
      {
        let teamCardScore = this.state.cardScore.get(team)
        teamCardScore.set(enemyCard.type, teamCardScore.get(enemyCard.type) + 1)
      }

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
    if (card.lineBoosted) {
      this.state.terminalCardState.get(team)
        .set(TerminalCardType.lineBoost, move.destinationSquare)
    }

    return ret
  }

  // This is a core method; verifications about the current game state should be made beforehand.
  /**
   * Uninstall the player's line boost card.
   * @function _uninstallLineBoostCore
   * @memberof Game.prototype
   * @access private
   * @param {Symbol} team {@link Team}
   * @param {Card} card
   */
  _uninstallLineBoostCore(team, card) {
    this.state.terminalCardState.get(team)
      .set(TerminalCardType.lineBoost, null)
    card.lineBoosted = false
  }

  /**
   * Throws an exception if the board square does not have a card owned by the player.
   * @function _requireTeamCardOnSquare
   * @memberof Game.prototype
   * @access private
   * @param {Square} square
   * @param {Symbol} team {@link Team}
   * @throws {InvalidMoveError}
   */
  _requireTeamCardOnSquare(square, team) {
    try {
      if (square == null) {
        throw new InvalidMoveError("Source square not provided.")
      }
      if (square.card == null) {
        throw new InvalidMoveError("There is no card on that square.")
      }
      if (square.card.owner !== team) {
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
 * @typedef StackAreaDelta
 * @property {Symbol} owner {@link Team}
 * @property {StackedOnlineCard} stacked
 */
          /**
           * @typedef ExecutedMoveToSquareData
           * @property {?TerminalMoveData[]} terminal
           * @property {?StackAreaDelta[]} deltaStackArea
           * @property {?Symbol} server {@link Team}
           * @property {?CaptureData} capture
           */

/**
 * @typedef ExecutedSubmoveTerminalCardData
 * @property {Symbol} team
 *   {@link Team} The team that owns the terminal card.
 * @property {Symbol} type
 *   {@link TerminalCardType} The type of the terminal card.
 * @property {?boolean} uninstall
 *   Whether to uninstall the terminal card.
 */

/**
 * @typedef ExecutedSubmoveData
 * @property {?ExecutedSubmoveTerminalCardData[]} terminal
 *   Terminal card move data.
 * @property {?StackAreaDelta[]} deltaStackArea
 *   Changes to the stack area.
 * @property {?object} capture Capture data.
 * @property {Symbol} capture.subject {@link Team} The team capturing the card.
 * @property {Symbol} capture.object
 *   {@link Team} The team with the captured card.
 * @property {Symbol} capture.type
 *   {@link OnlineCardType} The type of the captured card.
 * @property {?object} server
 *
 * @property {Team}  server.serverTeam  The team of the invaded server.
 * @property {?object}  capture
 * @property {Team}  capture.subject  The team capturing the card.
 * @property {OnlineCardType}  capture.type  The type of the captured card.
 */

/**
 * Data about the state of the game after submitting the move.
 * Also has the properties of {@link ExecutedSubmoveData}.
 * @typedef ExecutedMoveData
 * @property {?Team} winner
 */
