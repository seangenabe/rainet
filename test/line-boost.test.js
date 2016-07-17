const t = require('tape-catch')
const helpers = require('./helpers')
const {
  Team,
  InvalidMoveError
} = require('..')
const { setup } = helpers
const partial = require('lodash.partial')

t.test("line boost", t => {
  const game = setup([[4], [4]])
  let {
    install,
    uninstall,
    getSquare,
    doMove,
    getInstallSquare
  } = helpers(game)
  install = partial(install, 'lineBoost', undefined)
  uninstall = partial(uninstall, 'lineBoost')
  getInstallSquare = partial(getInstallSquare, 'lineBoost')

  t.notOk(getInstallSquare('top'), "must be uninstalled initially")
  t.notOk(getInstallSquare('bottom'), "must be uninstalled initially")

  t.throws(() => doMove("A8UU"), "cannot move too far when uninstalled")

  install('D2')
  install('D7')

  let d2 = getSquare('D2')
  t.ok(d2.card.lineBoosted, "card must be line boosted")
  t.equal(d2, getInstallSquare('bottom'))
  let d7 = getSquare('D7')
  t.ok(d7.card.lineBoosted, "card must be line boosted")
  t.equal(d7, getInstallSquare('top'))

  doMove('D2UU')
  t.equals(getSquare('D4').card.owner, Team.bottom,
    "card must have traveled two squares")

  doMove('D7DD')

  t.throws(() => doMove('D4UR'), InvalidMoveError,
    "card cannot travel through an enemy card")
  t.throws(() => doMove('D4UU'), InvalidMoveError,
    "card cannot travel through an enemy card")
  t.throws(() => doMove('D4UL'), InvalidMoveError,
    "card cannot travel through an enemy card")

  t.doesNotThrow(() => doMove('D4LU'))
  doMove('D5R')

  let m = doMove('C5RR')
  t.equals(m.capture.subject, Team.bottom, "move should be a capture")
  t.equals(getSquare('E5').card.owner, Team.bottom,
    "card should be on target square")
  t.equals(getInstallSquare('bottom'), getSquare('E5'),
    "state must update to target square")
  t.notOk(getInstallSquare('top'),
    "state must revert to uninstalled after capture")

  doMove('H8D')
  t.doesNotThrow(() => uninstall('bottom'),
    "opts.source must be optional when uninstalling")
  t.throws(() => doMove('E5RR'), "cannot move too far when uninstalled")

  t.end()
})
