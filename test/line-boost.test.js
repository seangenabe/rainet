const t = require('tape')
const { setup, doMove, doMoves, getSquare } = require('./helpers')
const {
  InstallableTerminalCardMove,
  TerminalCardType,
  Team,
  InvalidMoveError
} = require('..')
const partial = require('lodash.partial')

t.test("line boost", t => {
  const game = setup([[4], [4]])
  const _install = partial(install, game)
  const _getSquare = partial(getSquare, game)
  const _doMove = partial(doMove, game)
  const _getInstallSquare = partial(getInstallSquare, game)

  t.notOk(_getInstallSquare('top'))
  t.notOk(_getInstallSquare('bottom'))

  _install('D2')
  _install('D7')

  let d2 = _getSquare('D2')
  t.ok(d2.card.lineBoosted, "card must be line boosted")
  t.equal(d2, _getInstallSquare('bottom'))
  let d7 = _getSquare('D7')
  t.ok(d7.card.lineBoosted, "card must be line boosted")
  t.equal(d7, _getInstallSquare('top'))

  _doMove('D2UU')
  t.equals(_getSquare('D4').card.owner, Team.bottom,
    "card must have traveled two squares")

  _doMove('D7DD')

  t.throws(() => _doMove('D4UR'), InvalidMoveError,
    "card cannot travel through an enemy card")
  t.throws(() => _doMove('D4UU'), InvalidMoveError,
    "card cannot travel through an enemy card")
  t.throws(() => _doMove('D4UL'), InvalidMoveError,
    "card cannot travel through an enemy card")

  t.doesNotThrow(() => _doMove('D4LU'))
  _doMove('D5R')

  let m = _doMove('C5RR')

  t.end()
})

function getInstallSquare(game, team) {
  return game.state.terminalCardState.get(Team[team])
    .get(TerminalCardType.lineBoost)
}

function install(game, locationString, uninstall) {
  return doMove(game, new InstallableTerminalCardMove({
    source: getSquare(game, locationString),
    cardType: TerminalCardType.lineBoost,
    uninstall
  }))
}

function uninstall(game, locationString) {
  return install(game, locationString, true)
}
