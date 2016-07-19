const t = require('tape-catch')
const {
  InvalidMoveError,
  Team,
  TerminalCardMove,
  TerminalCardType
} = require('..')
const helpers = require('./helpers')
const { setup } = helpers

t.test("virus check", t => {
  let game = setup([[4], [4]])
  const { doMove, getSquare } = helpers(game)

  t.notOk(getSquare('D7').card.revealed, "must be not revealed initially")

  doMove(new TerminalCardMove({
    cardType: TerminalCardType.virusCheck,
    source: getSquare('D7'),
    team: Team.bottom
  }))

  t.ok(getSquare('D7').card.revealed, "must be revealed")

  doMove('A8D')

  t.throws(() => doMove(new TerminalCardMove({
    cardType: TerminalCardType.virusCheck,
    source: getSquare('E7'),
    team: Team.bottom
  })), InvalidMoveError, "cannot use again")

  t.end()
})

t.test("virus check #2", t => {
  let game = setup([[4], [4]])
  const { doMove, getSquare } = helpers(game)

  doMove(new TerminalCardMove({
    cardType: TerminalCardType.virusCheck,
    source: getSquare('D2')
    // team: Team.top
  }))

  t.ok(getSquare('D2').card.revealed, "must be revealed (auto-team)")

  t.throws(() => {
    doMove(new TerminalCardMove({
      cardType: TerminalCardType.virusCheck,
      source: getSquare('E2')
      // team: Team.bottom
    }))
  }, InvalidMoveError, "can't virus check own cards")

  t.throws(() => {
    doMove(new TerminalCardMove({
      cardType: TerminalCardType.virusCheck,
      team: Team.bottom,
      source: getSquare('H5')
    }))
  }, InvalidMoveError, "cannot check empty square")

  t.end()
})
