const t = require('tape-catch')
const helpers = require('./helpers')
const { setup } = helpers
const {
  Team,
  InvalidMoveError
} = require('..')
const partial = require('lodash.partial')

t.test("firewall", t => {
  const game = setup([[4], [4]])
  let {
    getInstallSquare,
    getSquare,
    install,
    doMove,
    doMoves
  } = helpers(game)
  getInstallSquare = partial(getInstallSquare, 'firewall')

  t.notOk(getInstallSquare('top'), "must be uninstalled initially")
  t.notOk(getInstallSquare('bottom'), "must be uninstalled initially")

  install('firewall', 'bottom', 'D5')

  t.throws(() => install('firewall', 'top', 'D5'),
    "can't install on top of enemy firewall")
  t.equals(getSquare('D5').firewall, Team.bottom)

  doMoves([
    /* */ 'E7D',
    'D2U', 'E6D',
    'D3U'
  ])

  t.throws(() => doMove('E5L'), InvalidMoveError,
    "enemy can't go to firewalled square")
  doMove('A8D')
  t.doesNotThrow(() => doMove('D4U'),
    "owner can go to firewalled square")

  t.end()
})

t.test("firewall + line boost", t => {
  const game = setup([[4], [4]])
  let {
    doMove,
    install
  } = helpers(game)

  install('firewall', 'top', 'D3')
  install('lineBoost', 'bottom', 'D2')

  doMove('A8D')

  t.throws(() => doMove('D2UL'), InvalidMoveError,
    "can't pass through firewall")
  t.throws(() => doMove('D2UR'), InvalidMoveError,
    "can't pass through firewall")
  t.throws(() => doMove('D2UU'), InvalidMoveError,
    "can't pass through firewall")
  t.doesNotThrow(() => doMove('D2LU'),
    "can go around firewall")

  t.end()
})
