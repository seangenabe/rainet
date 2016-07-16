const t = require('tape-catch')
const { setup, doMove, getSquare } = require('./helpers')
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
  const _uninstall = partial(uninstall, game)
  const _getSquare = partial(getSquare, game)
  const _doMove = partial(doMove, game)
  const _getInstallSquare = partial(getInstallSquare, game)

  t.notOk(_getInstallSquare('top'), "must be uninstalled initially")
  t.notOk(_getInstallSquare('bottom'), "must be uninstalled initially")

  t.throws(() => _doMove("A8UU"), "cannot move too far when uninstalled")

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
  t.equals(m.capture.subject, Team.bottom, "move should be a capture")
  t.equals(_getSquare('E5').card.owner, Team.bottom,
    "card should be on target square")
  t.equals(_getInstallSquare('bottom'), _getSquare('E5'),
    "state must update to target square")
  t.notOk(_getInstallSquare('top'),
    "state must revert to uninstalled after capture")

  _doMove('H8D')
  t.doesNotThrow(() => _uninstall('bottom'),
    "opts.source must be optional when uninstalling")
  t.throws(() => _doMove('E5RR'), "cannot move too far when uninstalled")

  t.end()
})

function getInstallSquare(game, team) {
  return game.state.terminalCardState.get(Team[team])
    .get(TerminalCardType.lineBoost)
}

function install(game, locationString) {
  return doMove(game, new InstallableTerminalCardMove({
    source: locationString && getSquare(game, locationString),
    cardType: TerminalCardType.lineBoost
  }))
}

function uninstall(game, team) {
  return doMove(game, new InstallableTerminalCardMove({
    team: Team[team],
    cardType: TerminalCardType.lineBoost,
    uninstall: true
  }))
}
